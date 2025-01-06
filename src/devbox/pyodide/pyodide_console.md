---
theme: dashboard
title: Pyodide Console
index: true
toc: false
header: false
footer: false
source: https://github.com/duckdb/duckdb-pyodide | https://duckdb.org/2024/10/02/pyodide.html
---

```js
import {html} from "htl"

const htmlContent = await FileAttachment("duckdb_console.html").text();

const pyodide = html`
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

display(pyodide);
```