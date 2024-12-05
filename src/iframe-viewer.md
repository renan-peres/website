---
index: true
---

# iFrame Tester

This allows you to test HTML/iFrame code with live preview.

```js
import { html } from "htl";
```

```js
viewof iframeInput = {
  const form = html`<textarea
    style="
      width: 100%;
      min-height: 100px;
      margin-right: 10px;
      padding: 10px;
      font-family: monospace;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #f8f8f8;
      color: #333;
    "
  ><iframe src="https://example.com" width="100%" height="400" frameborder="0"></iframe></textarea>`;

  form.oninput = () => {
    form.value = form.value;
  };
  
  form.value = form.value;
  return form;
}
```

```js echo
display(
  html`<div style="
    margin-top: 20px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
  ">
    <h3 style="margin: 0 0 10px 0">Preview:</h3>
    <div style="
      background: white;
      padding: 20px;
      border-radius: 4px;
      border: 1px solid #ddd;
    ">
      ${html([iframeInput])}
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
1. Added a `viewof` binding for the textarea
2. Set up proper value handling in the input element
3. Used the input value directly in the preview display
4. Connected everything using Observable's reactive runtime

Now you should be able to type or paste iFrame code in the textarea and see it rendered in real-time below!​​​​​​​​​​​​​​​​
