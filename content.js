const state = {
  isHighlighted: false
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlight" && !state.isHighlighted) {
    const content = extractPageContent();
    // Send the message and handle the response
    chrome.runtime.sendMessage({
      action: "analyzeContent",
      content: content
    }).catch(error => {
      console.error('Error sending message:', error);
    });
    sendResponse({ status: 'Processing' });
  } else if (request.action === "highlightKeywords") {
    highlightContent(request.keywords);
    state.isHighlighted = true;
    sendResponse({ status: 'Highlighted' });
  } else if (request.action === "error") {
    console.error('Highlighting error:', request.message);
    // Show error to user
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff5252;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 10000;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    errorDiv.textContent = request.message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
    sendResponse({ status: 'Error shown' });
  }
  return true;
});

function extractPageContent() {
  // Get main content elements
  const contentElements = document.querySelectorAll('article, [role="main"], .main-content, #main-content, .post-content, .article-content');
  
  if (contentElements.length > 0) {
    return Array.from(contentElements)
      .map(element => element.innerText)
      .join('\n\n');
  }
  
  // Fallback to all paragraphs if no main content container found
  const paragraphs = document.querySelectorAll('p');
  return Array.from(paragraphs)
    .map(p => p.innerText)
    .join('\n\n');
}

function highlightContent(keywords) {
  const highlightStyle = `
    background-color: #ffeb3b;
    padding: 2px;
    border-radius: 2px;
  `;

  const contentElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
  
  contentElements.forEach(element => {
    if (shouldSkipElement(element)) {
      return;
    }

    const text = element.textContent.toLowerCase();
    const shouldHighlight = keywords.some(keyword => 
      text.includes(keyword.toLowerCase())
    );

    if (shouldHighlight) {
      element.style.cssText += highlightStyle;
    }
  });
}

function shouldSkipElement(element) {
  const skipSelectors = [
    'nav',
    'footer',
    'header',
    'sidebar',
    'menu',
    'comment',
    'advertisement'
  ];
  
  return skipSelectors.some(selector => 
    element.closest(`[class*="${selector}"]`) || 
    element.closest(`[id*="${selector}"]`)
  );
}