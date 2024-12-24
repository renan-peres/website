---
theme: dashboard
index: true
title: Stock Explorer
toc: false
---

```js
import {html} from "htl"

const htmlContent = await FileAttachment("stock_explorer_dashboard.html").text();

const QuartoFrame = html`
<iframe 
  srcdoc="${htmlContent}"
  style="width: 100vw; height: 100vh; border: none; position: fixed; top: 0; left: 1;"
></iframe>
`;

display(QuartoFrame);
```