---
index: true
---

# iFrame Tester

This allows you to test HTML/iFrame code with live preview.

```js
import { html } from "htl";
```

```js
viewof iframeCode = Inputs.textarea({
  label: "Enter iframe code",
  value: '<iframe src="https://example.com" width="100%" height="400" frameborder="0"></iframe>',
  rows: 5,
  width: 600
})
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
      ${html([iframeCode])}
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

The key changes are:
1. Changed `testInput` to `iframeCode` for clarity
2. Used Observable's `Inputs.textarea()` instead of raw HTML
3. Fixed the template literal syntax in the display section
4. Changed the way we reference the input in the preview section

Note: Some websites may block embedding due to X-Frame-Options headers or Content Security Policy restrictions.​​​​​​​​​​​​​​​​
