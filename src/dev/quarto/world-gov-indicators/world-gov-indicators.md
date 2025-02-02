---
theme: dashboard
title: Wold Governance Indicators
index: false
toc: false
footer: false
---

```js
import {html} from "htl"

const htmlContent = await FileAttachment("world-gov-indicators.html").text();

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
  srcdoc="${htmlContent}"
  style="
    width: 100%;
    height: 100vh;
    border: none;
    overflow: hidden;
    display: block;
    margin: 0;
    padding: 0;
  "
  sandbox="allow-scripts allow-same-origin"
></iframe>
  </div>
</div>
```