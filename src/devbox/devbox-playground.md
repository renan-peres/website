---
theme: dashboard
title: DevBox Playground
toc: false
pager: false
---

```js
const fullscreenBtn = htl.html`
<button style="position: absolute; top: 10px; left: 10px; z-index: 1000; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
 onclick=${(e) => {
   const iframe = document.querySelector('iframe');
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
<div style="position: relative;">
  ${fullscreenBtn}
  <iframe 
    src="https://codesandbox.io/embed/nn83ln??fontsize=16&hidenavigation=1"
    style="width: 100vw; height: 100vh; border:0; border-radius: 4px; overflow:hidden;"
    title="iframe"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  ></iframe>
</div>
```