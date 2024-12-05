---
index: true
---

# iFrame Tester

This allows you to test HTML/iFrame code with live preview.

```js
import { html } from "htl";

// Create a mutable value to store the input
let inputValue = '<iframe src="https://example.com" width="100%" height="400" frameborder="0"></iframe>';

// Create the main view
const view = html`
<div style="font-family: system-ui; padding: 20px;">
  <p>Enter your HTML/iFrame code below to see it rendered in real-time.</p>
  <textarea 
    style="
      width: 100%;
      min-height: 100px;
      margin-right: 10px;
      padding: 10px;
      font-family: monospace;
      border: 1px solid #ccc;
      border-radius: 4px;
    "
    oninput=${(event) => {
      inputValue = event.target.value;
      previewElement.innerHTML = inputValue;
    }}
  >${inputValue}</textarea>
  <br />
  <div style="
    margin-top: 20px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
  ">
    <h3 style="margin: 0 0 10px 0">Preview:</h3>
    <div ${html.elem`preview`} style="
      background: white;
      padding: 20px;
      border-radius: 4px;
      border: 1px solid #ddd;
    "></div>
  </div>
</div>
`;

// Get reference to the preview element
const previewElement = view.querySelector("[preview]");

// Set initial preview
previewElement.innerHTML = inputValue;

// Return the view
return view;
```

```js
// Example iframes for reference
const examples = `
Try it with these examples:

1. Basic iFrame:
\`\`\`html
<iframe src="https://example.com" width="100%" height="400" frameborder="0"></iframe>
\`\`\`

2. Responsive iFrame:
\`\`\`html
<iframe 
  src="https://wikipedia.org" 
  style="width: 100%; height: 500px; border: none; border-radius: 8px;"
></iframe>
\`\`\`

3. YouTube Video Embed:
\`\`\`html
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>
\`\`\`
```

Note: Some websites may block embedding due to X-Frame-Options headers or Content Security Policy restrictions.
