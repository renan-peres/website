---
theme: dashboard
title: Stock Explorer
index: true
toc: false
---

```js
import {html} from "htl"

const htmlContent = await FileAttachment("stock_explorer_dashboard.html").text();

const QuartoFrame = html`
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
></iframe>
`;

display(QuartoFrame);
```