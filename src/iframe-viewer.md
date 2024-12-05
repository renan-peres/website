---
index: true
---

# iFrame Tester

This allows you to test HTML/iFrame code with live preview.

```js
import { html } from "htl";
```

```js
const view = html`
  <div style="font-family: system-ui; padding: 20px;">
    <p>Enter your HTML/iFrame code below and click "Display" to see it rendered.</p>
    <textarea 
      id="iframeInput" 
      style="
        width: 100%;
        min-height: 100px;
        margin-bottom: 10px;
        padding: 10px;
        font-family: monospace;
        border: 1px solid #ccc;
        border-radius: 4px;
      "
      placeholder="Paste your iFrame code here..."
    ></textarea>
    <button 
      id="displayButton"
      style="
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin-bottom: 20px;
      "
      onmouseover="this.style.backgroundColor='#45a049'"
      onmouseout="this.style.backgroundColor='#4CAF50'"
    >
      Display iFrame
    </button>
    <div id="preview-container" style="
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    ">
      <h3 style="margin: 0 0 10px 0">Preview:</h3>
      <div id="iframe-preview" style="
        background: white;
        padding: 20px;
        border-radius: 4px;
        border: 1px solid #ddd;
        min-height: 100px;
      "></div>
    </div>
  </div>
`;

// Get references to elements
const iframeInput = view.querySelector("#iframeInput");
const displayButton = view.querySelector("#displayButton");
const iframePreview = view.querySelector("#iframe-preview");

// Function to update preview
function updatePreview() {
  const inputValue = iframeInput.value.trim();
  iframePreview.innerHTML = inputValue;
}

// Add event listener to button
displayButton.addEventListener("click", updatePreview);

view
```

Try it with these examples:

1. Basic iFrame:
```html
<iframe src="https://example.com" width="100%" height="400" frameborder="0"></iframe>
```

2. Responsive iFrame:
```html
<iframe 
  src="https://wikipedia.org" 
  style="width: 100%; height: 500px; border: none; border-radius: 8px;"
></iframe>
```

3. YouTube Video Embed:
```html
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
```

Note: Some websites may block embedding due to X-Frame-Options headers or Content Security Policy restrictions.
