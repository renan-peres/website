---
theme: dashboard
title: Quarto HTML Basics
index: true
toc: false
---

```js
import {html} from "htl"

const htmlContent = await FileAttachment("quarto_html_basics.html").text();

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
  sandbox="allow-scripts allow-same-origin"
></iframe>
`;

display(QuartoFrame);
```