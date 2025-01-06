---
theme: dashboard
title: Pyodide Console
index: true
toc: false
header: false
footer: false
source: https://github.com/jupyterlite/demo | https://github.com/Alex-Monahan/jupyterlite_duckdb_demo?tab=readme-ov-file | https://jupyterlite.readthedocs.io/en/latest/quickstart/deploy.html | https://github.com/duckdb/duckdb-pyodide | https://duckdb.org/2024/10/02/pyodide.html
---

```js
import {html} from "htl"

const pyodide = html`
<iframe 
  src="https://renan-peres.github.io/jupyterlite/"
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
