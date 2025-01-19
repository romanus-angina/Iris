chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeContent") {
    try {
      analyzeWithGPT(request.content, sender.tab.id);
    } catch (error) {
      console.error('Error in message listener:', error);
      chrome.tabs.sendMessage(sender.tab.id, {
        action: "error",
        message: error.message
      });
    }
    return true;
  }
});

async function analyzeWithGPT(content, tabId) {
  try {
    // Check for API key
    const result = await chrome.storage.local.get(['openaiApiKey']);
    const apiKey = result.openaiApiKey;
    
    if (!apiKey) {
      chrome.tabs.sendMessage(tabId, {
        action: "error",
        message: "Please set your OpenAI API key in the extension popup first"
      });
      return;
    }

    try {
      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "You are an AI that analyzes article content and returns important keywords and phrases. Return only a JSON array of strings containing the most important phrases, with no other explanation or text."
          }, {
            role: "user",
            content: `Analyze this article and identify the most important phrases (max 10): ${content}`
          }]
        })
      });

      if (!chatResponse.ok) {
        throw new Error(`HTTP error! status: ${chatResponse.status}`);
      }

      const data = await chatResponse.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const keywords = JSON.parse(data.choices[0].message.content);
      
      chrome.tabs.sendMessage(tabId, {
        action: "highlightKeywords",
        keywords: keywords
      });

    } catch (fetchError) {
      console.error('Fetch or parsing error:', fetchError);
      chrome.tabs.sendMessage(tabId, {
        action: "error",
        message: `API request failed: ${fetchError.message}`
      });
    }

  } catch (error) {
    console.error('GPT Analysis Error:', error);
    chrome.tabs.sendMessage(tabId, {
      action: "error",
      message: error.message
    });
  }
}