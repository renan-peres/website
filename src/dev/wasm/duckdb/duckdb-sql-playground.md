---
title: SQL Playground
theme: dashboard
index: true
toc: false
source: https://observablehq.com/framework/lib/duckdb | https://duckdb.org/docs/api/wasm/overview.html | https://duckdb.org/docs/guides/network_cloud_storage/duckdb_over_https_or_s3.html | https://observablehq.com/@bayre/duckdb-s3 | https://talk.observablehq.com/t/loading-a-duckdb-database/8977/4 | https://tobilg.com/using-duckdb-wasm-for-in-browser-data-engineering | https://duckdb.org/docs/guides/network_cloud_storage/duckdb_over_https_or_s3
keywords: 
---

```html
<style>
.observablehq textarea,
.observablehq-input textarea,
.sql-editor {
  min-height: 20px !important;
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

# DuckDB: SQL Playground

```js
import {datetime} from "../../../assets/components/datetime.js";
import * as vgplot from "npm:@uwdata/vgplot";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import { DEFAULT_CONFIG, getCustomTableFormat, createCollapsibleSection } from "../../../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";
// const db = await getDefaultClient();
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

```sql echo=false display=false
ATTACH 's3://aws-test-duckdb/datasets/data.db' AS s3;
SHOW DATABASES;
USE s3;
```

---

## Upload Data

```js
// Helper function to sanitize table names
function sanitizeTableName(filename) {
  return filename
    .replace(/\.(arrow|csv|parquet)$/, "")
    .replace(/[^a-zA-Z0-9_]/g, "_")  // Replace any non-alphanumeric chars with underscore
    .replace(/^(\d)/, '_$1');  // Prefix with underscore if starts with number
}

// Helper function to download files
function download(file) {
  const a = document.createElement("a");
  a.download = file.name;
  a.href = URL.createObjectURL(file);
  a.click();
  URL.revokeObjectURL(a.href);
}

// Helper function to convert to parquet
async function toParquet(duckDbClient, {table = "data", originalName = table, name = `${originalName}.parquet`} = {}) {
  const tmp = (Math.random() * 1e16).toString(16);
  const db = duckDbClient._db;
  await duckDbClient.query(`COPY ${duckDbClient.escape(table)} TO '${tmp}' (FORMAT PARQUET, COMPRESSION GZIP)`);
  const buffer = await db.copyFileToBuffer(tmp);
  return new File([buffer], name, {
    type: "application/vnd.apache.parquet"
  });
}
```

```js
const files = view(Inputs.file({
  accept: ".arrow,.csv,.parquet",
  description: "Upload data files",
  multiple: true  // Enable multiple file selection
}));
```

```js
// Handle multiple files
const tableEntries = files && Array.from(files).reduce((acc, file) => {
  const tableName = sanitizeTableName(file.name);
  acc[tableName] = file;
  return acc;
}, {});
```

```js
const db = files && DuckDBClient.of(tableEntries);
```

---

## Tables Available

```js
// Get tables
const tables = await db.sql`
  SELECT 
    -- CONCAT(database, '.', schema,'.' , name) AS table_name
    CONCAT(name) AS table_name
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

## Profile Schema (SQL)

```js
const firstTableName = Object.keys(tableEntries)[0] || 'data';

const schema = view(Inputs.textarea({
  value: `SUMMARIZE ${selectedTable.table_name};`,
  width: "100%",
  rows: 1,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
// Execute and display pre-built query results
const prebuiltQueryResult = await db.query(schema);

const tableConfig2 = getCustomTableFormat(prebuiltQueryResult, {
  ...DEFAULT_CONFIG,
  datasetName: 'schema_profile'
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

---

## Query Tables (SQL)

```js
// Create the textarea that updates based on the selected query
const prebuiltCode = view(Inputs.textarea({
  value: `SELECT * FROM table_name LIMIT 100;`,
  width: "100%",
  rows: 10,
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