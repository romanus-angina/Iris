# AI Article Highlighter

This Chrome extension leverages the power of OpenAI's GPT-3.5-turbo model to identify and highlight the most important paragraphs in an article, improving comprehension and reading efficiency.

## Features

*   **AI-Powered Analysis:** Employs OpenAI's GPT-3.5-turbo to analyze article content and extract key phrases.
*   **Automated Highlighting:** Automatically highlights the most important sections of the article based on AI analysis.
*   **OpenAI API Key Integration:** Requires an OpenAI API key for access to the GPT-3.5-turbo model.  The key is stored locally in the browser's storage.
*   **Robust Content Extraction:**  Intelligently extracts content from various website structures, prioritizing common article containers.  Falls back to all paragraphs if no standard article elements are found.
*   **Error Handling:** Includes comprehensive error handling for API requests, key management, and content extraction.
*   **User-Friendly Popup:** A popup interface allows for easy input of the OpenAI API key and initiates the highlighting process.


## Usage

1.  Install the extension.
2.  Open the extension's popup by clicking its icon in the Chrome toolbar.
3.  Enter your OpenAI API key in the provided field and click "Save".
4.  Navigate to an article you wish to analyze.
5.  Click the extension's icon or the "Highlight" button in the popup to begin analysis and highlighting.  The extension will extract the relevant text from the webpage and send it to OpenAI's API for processing. The results are then used to highlight the key phrases on the page.


## Installation

1.  Clone this repository: `git clone https://github.com/yourusername/AI-Article-Highlighter` (replace `yourusername` with your GitHub username).
2.  Open Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" in the top right corner.
4.  Click "Load unpacked".
5.  Select the cloned directory.


## Technologies Used

*   **OpenAI API:** Used for natural language processing and key phrase extraction.
*   **JavaScript:** The primary programming language for the extension's functionality.
*   **Chrome Extension APIs:** Used for interacting with the Chrome browser and web pages.  Specifically, `chrome.runtime`, `chrome.storage`, `chrome.tabs`, and `chrome.scripting` APIs are utilized.
*   **HTML & CSS:** Used for creating the user interface.


## Configuration

The extension requires an OpenAI API key.  Enter your key in the extension popup and click "Save".


## Dependencies

*   OpenAI Account (for API access)


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
