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
    <p>Enter your HTML/iFrame code below to see it rendered in real-time.</p>
    <textarea 
      id="iframeInput" 
      style="
        width: 100%;
        min-height: 100px;
        margin-right: 10px;
        padding: 10px;
        font-family: monospace;
        border: 1px solid #ccc;
        border-radius: 4px;
      "
    ><iframe src="https://example.com" width="100%" height="400" frameborder="0"></iframe></textarea>
    <br />
    <div id="preview-container" style="
      margin-top: 20px;
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
      "></div>
    </div>
  </div>
`;

// Get references to elements
const iframeInput = view.querySelector("#iframeInput");
const iframePreview = view.querySelector("#iframe-preview");

// Function to update preview
function updatePreview() {
  iframePreview.innerHTML = iframeInput.value;
}

// Add event listeners
iframeInput.addEventListener("input", updatePreview);

// Initial preview
updatePreview();

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
