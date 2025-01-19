---
title: Pyodide
theme: dashboard
index: false
toc: false
source: https://pyodide.org/en/stable/usage/quickstart.html
keywords: Python, wasm
---


```html
<style>
.observablehq textarea,
.observablehq-input textarea,
.sql-editor {
  min-height: 50px !important;
  max-height: 1000px !important;
  width: 100% !important;
  max-width: none !important;
  margin-right: 0 !important;
  padding-right: 0 !important;
}

/* Header and container fixes */
.observablehq article {
  max-width: none !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.observablehq-markdown {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
}

h1, h2, h3, h4, h5, h6, p, li, ul, ol {
  width: 100% !important;
  max-width: none !important;
  margin-right: 0 !important;
  padding-right: 0 !important;
}

</style>
```

```js
import {datetime} from "../../../assets/components/datetime.js";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../../../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";
import { py, loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.mjs";

async function initializePyodide() {
  const countdownElement = document.getElementById('countdown');
  
  try {
    countdownElement.textContent = 'Initializing Pyodide...';
    
    let pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/"
    });
    
    countdownElement.textContent = 'Loading packages...';
    
    // Load core packages
    await pyodide.loadPackage(["micropip", "pyodide.http", "pyarrow", "requests", "polars"]);
    
    countdownElement.textContent = 'Ready!';
    return pyodide;
    
  } catch (err) {
    countdownElement.textContent = 'Initialization failed';
    console.error('Pyodide initialization error:', err);
    throw err;
  }
}

const pyodide = await initializePyodide();
```

# Pyodide (Read Data)

<div class="datetime-container">
  <div id="datetime"></div>
</div>

<div id="countdown"></div>

---

## Read Parquet

```js
const pythonCode4 = view(Inputs.textarea({
  value: `import io
import requests
import json

import polars as pl
import pyarrow.parquet as pq

def read_parquet(url):
    try:
        response = requests.get(url)
        buffer = io.BytesIO(response.content)
        table = pq.read_table(buffer)
        return pl.from_arrow(table)
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

# Execute
url = "https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/historical_ma_transactions.parquet"
df = read_parquet(url)
# str(df.head(10))

# Convert to list of dictionaries and serialize
json.dumps(df.to_dicts())`,
  width: "100%",
  rows: 24,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
// Run the Python code in Pyodide
const result2 = await pyodide.runPython(pythonCode4);
const tableData2 = JSON.parse(result2);

const tableConfig = getCustomTableFormat(tableData2, {
  ...DEFAULT_CONFIG,
  datasetName: 'results'
});

const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

display(createCollapsibleSection(collapsibleContent, "Show Data", "show"));
```

---

## Read CSV

```js
const pythonCode2 = view(Inputs.textarea({
  value: `import requests
import json
import polars as pl

# Fetch CSV data
r = requests.get("https://raw.githubusercontent.com/pola-rs/polars/main/examples/datasets/foods1.csv")
df = pl.read_csv(r.content)
# str(df.head(10))

# Convert to list of dictionaries and serialize
json.dumps(df.head(10).to_dicts())`,
  width: "100%",
  rows: 11,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
// Run the Python code in Pyodide
const result = await pyodide.runPython(pythonCode2);
const tableData2 = JSON.parse(result);

const tableConfig = getCustomTableFormat(tableData2, {
  ...DEFAULT_CONFIG,
  datasetName: 'results'
});

const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

display(createCollapsibleSection(collapsibleContent, "Show Data", "show"));
```
