---
theme: dashboard
index: true
title: Quarto
toc: false
---

```js
import {html} from "htl"

const htmlContent = await FileAttachment("quarto_html_basics.html").text();

const QuartoFrame = html`
<iframe 
  srcdoc="${htmlContent}"
  style="width: 100vw; height: 100vh; border: none; position: fixed; top: 0; left: 0;"
  sandbox="allow-scripts allow-same-origin"
></iframe>
`;

display(QuartoFrame);
```