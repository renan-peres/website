---
index: true
---

# iFrame Tester

This allows you to test HTML/iFrame code with live preview.

```js
import { html } from "htl";
```

```js
html`
<div style="display: flex; flex-direction: column; gap: 20px; padding: 20px;">
  <textarea
    id="input"
    style="width: 100%; height: 100px; padding: 10px; font-family: monospace;"
    placeholder="Enter your iFrame code here"
  ><iframe src="https://example.com" width="100%" height="400" frameborder="0"></iframe></textarea>
  
  <button 
    id="displayBtn"
    style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
  >
    Display iFrame
  </button>
  
  <div id="preview"></div>
</div>
`
```

```js
// Get the elements
const input = document.querySelector("#input");
const preview = document.querySelector("#preview");
const displayBtn = document.querySelector("#displayBtn");

// Add click handler
displayBtn.addEventListener("click", () => {
  preview.innerHTML = input.value;
});
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
