---
title: Attach Remote DuckDB Databases
theme: dashboard
index: true
toc: false
source: https://observablehq.com/framework/lib/duckdb | https://duckdb.org/docs/api/wasm/overview.html | https://duckdb.org/docs/guides/network_cloud_storage/duckdb_over_https_or_s3.html | https://observablehq.com/@bayre/duckdb-s3 | https://talk.observablehq.com/t/loading-a-duckdb-database/8977/4 | https://tobilg.com/using-duckdb-wasm-for-in-browser-data-engineering | https://duckdb.org/docs/guides/network_cloud_storage/duckdb_over_https_or_s3
keywords: 
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

# Attach DuckDB Database from S3

```js
import {datetime} from "../assets/components/datetime.js";
import * as vgplot from "npm:@uwdata/vgplot";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import { DEFAULT_CONFIG, getCustomTableFormat, createCollapsibleSection } from "../assets/components/tableFormatting.js";
const db = await getDefaultClient();
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Setup
*Please wait a few seconds for the database to load.*

```sql echo=true display=false
ATTACH 's3://aws-test-duckdb/duckdb/data.db' AS s3;
SHOW DATABASES;
USE s3;
```

---

## <u>Tables Available</u>

```js
// Get tables
const tables = await db.sql`
  SELECT CONCAT(database, '.', schema,'.' , name) AS table_name
  FROM (SHOW ALL TABLES)
  -- WHERE schema = 'main';
`;

// Create the select input and store its value
const selectedTable = view(Inputs.select(tables, {
  format: d => d.table_name
}));
```

```js
// For your query display block
const result = await db.query(`SELECT * FROM ${selectedTable.table_name} LIMIT 10;`);

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
display(createCollapsibleSection(collapsibleContent, "Show Data", "expanded"));
```

---

## <u>Responsive SQL Code</u>

```js
// Create the textarea that updates based on the selected query
const prebuiltCode = view(Inputs.textarea({
  value: `USE s3;

SELECT * 
FROM us_president_favorability
ORDER BY "Very Favorable %" DESC
LIMIT 100;`,
  width: "600px",
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
display(createCollapsibleSection(collapsibleContent2, "Show Data", "expanded"));
```