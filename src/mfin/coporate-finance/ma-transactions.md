---
title: Historical M&A Transactions
theme: dashboard
index: true
toc: false
source: 
keywords: 
sql:
  company_profile: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/company_profile.parquet
  ma_transactions: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/historical_ma_transactions.parquet
  
---

```html
<style>
h1, h2, h3, h4, h5, h6, p, li, ul, ol {
  width: 100% !important;
  max-width: none !important;
  margin-right: 0 !important;
  padding-right: 0 !important;
}
</style>
```

# Historical M&A Transactions

```js
import {datetime} from "../../assets/components/datetime.js";
import * as vgplot from "npm:@uwdata/vgplot";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import { DEFAULT_CONFIG, getCustomTableFormat, createCollapsibleSection } from "../../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";
const db = await getDefaultClient();
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## <u>Tables Available</u>

```js
// Get tables
const tables = await db.sql`
  SELECT CONCAT(schema,'.' , name) AS table_name
  FROM (SHOW ALL TABLES)
  -- WHERE schema = 'main';
`;

// Extract table names from the SQL result
const tableNames = Array.from(tables, row => row.table_name);

// Create the select input and store its value
const selectedTable = view(Inputs.select(tables, {
  label: "Select Table",
  format: d => d.table_name
}));

const rowLimit = view(Inputs.range([10, 1000], {
  label: "Number of rows", 
  step: 10,
  value: 5
}));
```

```js
// For your query display block
const result = await db.query(`SELECT * FROM ${selectedTable.table_name} LIMIT ${rowLimit};`);

// Get the configuration and buttons
const tableConfig = getCustomTableFormat(result, {
  ...DEFAULT_CONFIG,
  datasetName: `${selectedTable.table_name}`
});

// Create collapsible content
const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

// Display the collapsible section
// display(createCollapsibleSection(collapsibleContent, "Show Data", "collapsed"));
display(createCollapsibleSection(collapsibleContent, "Show Data", "show"));
```

---

## <u>Responsive SQL Code</u>

```js
// Create the textarea that updates based on the selected query
const prebuiltCode = view(Inputs.textarea({
  value: `SELECT *
FROM ma_transactions;`,
  width: "100%",
  rows: 6,
  resize: "both",
  className: "sql-editor",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
// Execute and display pre-built query results
const prebuiltQueryResult = await db.query(prebuiltCode);

const tableConfig2 = getCustomTableFormat(prebuiltQueryResult, {
  ...DEFAULT_CONFIG,
  datasetName: 'query_result'
});

// Create collapsible content
const collapsibleContent2 = htl.html`
  ${tableConfig2.container}
  ${Inputs.table(tableConfig2.dataArray, tableConfig2)}
`;

// Display the collapsible section
// display(createCollapsibleSection(collapsibleContent2, "Show Data", "collapsed"));
display(createCollapsibleSection(collapsibleContent2, "Show Data", "show"));
```