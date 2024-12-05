---
index: true
---

# iFrame Tester

This allows you to test HTML/iFrame code with live preview.

```js
import { html } from "htl";
```

```js
const defaultIframe = `<iframe 
  src="https://example.com" 
  width="100%" 
  height="400" 
  frameborder="0"
></iframe>`;
```

```js
viewof testInput = html`<textarea 
  style="
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: monospace;
    margin-bottom: 10px;
  "
  placeholder="Paste your iframe or HTML code here..."
>${defaultIframe}</textarea>`
```

```js echo
display(
  html`<div style="
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
    margin-top: 20px;
  ">
    <h3 style="margin: 0 0 10px 0">Preview:</h3>
    <div style="
      background: white;
      padding: 20px;
      border-radius: 4px;
      border: 1px solid #ddd;
    ">
      ${html([testInput])}
    </div>
  </div>`
)
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

The key changes are:
1. Added a default iframe constant
2. Created a proper viewof binding for the textarea input
3. Used basic HTML textarea instead of Inputs.textarea for better compatibility
4. Added styling directly to the textarea element

Now you should see an input area where you can paste iframe code and see it rendered below in real-time.​​​​​​​​​​​​​​​​
