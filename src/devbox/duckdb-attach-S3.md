---
title: Attach Remote DuckDB Databases
theme: dashboard
index: true
toc: false
source: https://observablehq.com/framework/lib/duckdb | https://duckdb.org/docs/api/wasm/overview.html | https://duckdb.org/docs/guides/network_cloud_storage/duckdb_over_https_or_s3.html | https://observablehq.com/@bayre/duckdb-s3 | https://talk.observablehq.com/t/loading-a-duckdb-database/8977/4 | https://tobilg.com/using-duckdb-wasm-for-in-browser-data-engineering | https://duckdb.org/docs/guides/network_cloud_storage/duckdb_over_https_or_s3
keywords: 
---

# Attach DuckDB Database from S3

```js
import {datetime} from "../assets/components/datetime.js";
import { getTableFormat, getCustomTableFormat } from "../assets/components/tableFormatting.js"; // Table Formatting & Do
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

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
---

## Setup
*Please wait a few seconds for the database to load.*
```js echo=true
import * as vgplot from "npm:@uwdata/vgplot";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
const db = await getDefaultClient();
```

```sql echo=true
ATTACH 's3://aws-test-duckdb/duckdb/data.db' AS s3;
SHOW DATABASES;
USE s3;
```

---

## <u>Responsive Input</u>

```js echo=true
// Get tables
const tables = await db.sql`
  SELECT DISTINCT CONCAT(table_catalog, '.', table_name) AS table_name
  FROM information_schema.tables 
  -- WHERE table_schema = 'main'
`;

// Create the select input and store its value
const selectedTable = view(Inputs.select(tables, {
  format: d => d.table_name
}));
```

```js echo=true
// For your query display block
const result = await db.query(`SELECT * FROM ${selectedTable.table_name} LIMIT 10000000;`);

// Get the configuration and buttons
const tableConfig = getCustomTableFormat(result, {
  datasetName: `${selectedTable.table_name}`,
  rows: 10,
  dateColumns: ['Date', 'date', 'created_date', 'updated_date']
});

// Display the buttons and table
display(tableConfig.container);
display(Inputs.table(result, tableConfig));
```

<br>

## <u>Interactive Code</u>

```js echo=true
// Create the textarea that updates based on the selected query
const prebuiltCode = view(Inputs.textarea({
  value: `USE s3;

SELECT * 
FROM airports
LIMIT 10;`,
  width: "880px",
  rows: 5,
  resize: "both",
  className: "sql-editor",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js echo=true
// Execute and display pre-built query results
const prebuiltQueryResult = await db.query(prebuiltCode);

// Get the configuration and buttons
const tableConfig2 = getCustomTableFormat(prebuiltQueryResult, {
  datasetName: 'query_result',
  rows: 10
});

// Display the buttons and table
display(tableConfig2.container);
display(Inputs.table(prebuiltQueryResult, tableConfig2));
```