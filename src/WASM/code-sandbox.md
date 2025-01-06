---
theme: dashboard
title: CodeSandbox Shell
index: true
toc: false
footer: false
---

```js
const fullscreenBtn = htl.html`
<button style="margin-bottom: 10px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
 onclick=${(e) => {
   // Find the next div's iframe
   const iframe = e.target.parentElement.nextElementSibling.querySelector('iframe');
   if (iframe.requestFullscreen) {
     iframe.requestFullscreen();
   } else if (iframe.webkitRequestFullscreen) {
     iframe.webkitRequestFullscreen();
   } else if (iframe.msRequestFullscreen) {
     iframe.msRequestFullscreen();
   }
 }}>
 Fullscreen
</button>`
```

```html
<div>
  ${fullscreenBtn}
  <div style="width: 100%; position: relative;">
    <iframe 
      src="https://codesandbox.io/embed/nn83ln??fontsize=16&hidenavigation=1"
      style="width: 100vw; height: 100vh; border:0; border-radius: 4px; overflow:hidden;"
      title="iframe"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
  </div>
</div>
```

