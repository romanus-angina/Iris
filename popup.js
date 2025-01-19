document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('api-key');
  const saveKeyButton = document.getElementById('save-key');
  const highlightButton = document.getElementById('highlight');
  const statusDiv = document.getElementById('status');
  
  // Disable highlight button if no API key is set
  async function updateHighlightButton() {
    const result = await chrome.storage.local.get(['openaiApiKey']);
    highlightButton.disabled = !result.openaiApiKey;
    if (!result.openaiApiKey) {
      statusDiv.textContent = 'Please enter and save your OpenAI API key first';
    }
  }
  
  // Check API key status on popup open
  updateHighlightButton();

  // Load saved API key
  chrome.storage.local.get(['openaiApiKey'], (result) => {
    if (result.openaiApiKey) {
      apiKeyInput.value = result.openaiApiKey;
    }
  });

  // Save API key
  saveKeyButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      if (!apiKey.startsWith('sk-')) {
        statusDiv.textContent = 'Error: Invalid API key format. Should start with "sk-"';
        return;
      }
      
      try {
        await chrome.storage.local.set({ openaiApiKey: apiKey });
        statusDiv.textContent = 'API key saved successfully!';
        await updateHighlightButton(); // Re-enable highlight button
        
        // Clear status after 2 seconds
        setTimeout(() => {
          statusDiv.textContent = '';
        }, 2000);
      } catch (error) {
        statusDiv.textContent = 'Error saving API key: ' + error.message;
      }
    } else {
      statusDiv.textContent = 'Please enter an API key';
    }
  });

  // Trigger highlighting
  highlightButton.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    statusDiv.textContent = 'Analyzing content...';
    
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });

      const response = await chrome.tabs.sendMessage(tab.id, { action: "highlight" });
      console.log('Highlight response:', response);
      
      if (response?.status === 'Processing') {
        statusDiv.textContent = 'Processing content with OpenAI...';
      } else if (response?.status === 'Error') {
        statusDiv.textContent = 'Error: ' + response.message;
      }
    } catch (error) {
      statusDiv.textContent = 'Error: ' + error.message;
      console.error('Extension error:', error);
    }
  });
});

