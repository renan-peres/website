---
title: Attach Remote DuckDB Databases
theme: dashboard
index: true
toc: false
source: https://observablehq.com/framework/lib/duckdb | https://duckdb.org/docs/api/wasm/overview.html | https://duckdb.org/docs/guides/network_cloud_storage/duckdb_over_https_or_s3.html | https://observablehq.com/@bayre/duckdb-s3 | https://talk.observablehq.com/t/loading-a-duckdb-database/8977/4 | https://tobilg.com/using-duckdb-wasm-for-in-browser-data-engineering | https://duckdb.org/docs/guides/network_cloud_storage/duckdb_over_https_or_s3
keywords: 
sql:
  base: ../assets/loaders/duckdb_database.db
---

# Attach DuckDB Databases

```js
import {datetime} from "../assets/components/datetime.js";
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

# Method 1: YAML Definition (SQL Code Block & getDefaultClient())

```
--- 
sql:
  base: ../assets/data/duckdb/data_sample.db
---
```

```js echo=true
import * as vgplot from "npm:@uwdata/vgplot";
import {getDefaultClient} from "observablehq:stdlib/duckdb";

const db = await getDefaultClient();
```

<br>

## <u>Local</u> 

```sql echo=true
USE base;
-- SHOW TABLES;

SELECT * 
FROM dim_SRDESC;
```

<br>

## <u>Remote</u> (GitHub)

```sql echo=true
ATTACH 'https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/FRED-gov-data/data.db' AS github;
USE github;
-- SHOW TABLES;

SELECT * 
FROM dim_SRDESC
LIMIT 10;
```

<br>

## <u>Remote</u> (S3)

```sql echo=true
ATTACH 's3://duckdb-blobs/databases/stations.duckdb' AS s3;
-- SHOW DATABASES;

USE s3;

-- SHOW TABLES;

SELECT * 
FROM stations
LIMIT 10;
```

<br>

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
const result = await db.query(`SELECT * FROM ${selectedTable.table_name} LIMIT 10;`);

display(Inputs.table(result, {
  rows: 30,
  format: {
    url: (x) => x ? htl.html`<a href="${/^https?:\/\//.test(x) ? x : 'https://' + x}" target="_blank">${x}</a>` : ''
  }
}));
```

<br>

## <u>Interactive Code</u>

```js echo=true
// Create the textarea that updates based on the selected query
const prebuiltCode = view(Inputs.textarea({
  value: `USE s3;

-- SHOW TABLES;

SELECT * 
FROM stations
LIMIT 10;`,
  width: "880px",
  rows: 7,
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
const prebuiltQueryResult = db.query(prebuiltCode);
// display(Inputs.table(prebuiltQueryResult));

display(Inputs.table(prebuiltQueryResult, {
        rows: 30,
        format: {
          	url: (x) => x ? htl.html`<a href="${/^https?:\/\//.test(x) ? x : 'https://' + x}" target="_blank">${x}</a>` : ''
        }
      }));
```

---

# Method 2: FileAttachment (DuckDBClient.of())

<br>

## <u>Local</u>

```js echo=true
// Initialize DuckDB with predefined tables
const db2 = await DuckDBClient.of({base: FileAttachment('../assets/loaders/duckdb_database.db')});
```

```js echo=true
// Get tables
const tables2 = await db2.query(`
  SELECT DISTINCT CONCAT(table_catalog, '.', table_name) AS table_name
  FROM information_schema.tables 
  -- WHERE table_schema = 'main'
`);

// Create the select input and store its value
const selectedTable2 = view(Inputs.select(tables2, {
  format: d => d.table_name
}));

```

```js echo=true
const result = await db2.query(`SELECT * FROM ${selectedTable2.table_name} LIMIT 10;`);
// display(Inputs.table(result));

display(Inputs.table(result, {
        rows: 30,
        format: {
          	url: (x) => x ? htl.html`<a href="${/^https?:\/\//.test(x) ? x : 'https://' + x}" target="_blank">${x}</a>` : ''
        }
      }));
```

<br>

##  <u>Remote</u> (GitHub)

```js echo=true
// Initialize DuckDB with predefined tables
const db3 = DuckDBClient.of();
```

```js echo=true
// Create the textarea that updates based on the selected query
const prebuiltCode2 = view(Inputs.textarea({
  value: `ATTACH 'https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/FRED-gov-data/data.db' AS github;

USE github;

-- SHOW TABLES;

SELECT * 
FROM dim_SRDESC
LIMIT 10;`,
  width: "880px",
  rows: 9,
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
const prebuiltQueryResult2 = db3.query(prebuiltCode2);
// display(Inputs.table(prebuiltQueryResult));

display(Inputs.table(prebuiltQueryResult2, {
        rows: 30,
        format: {
          	url: (x) => x ? htl.html`<a href="${/^https?:\/\//.test(x) ? x : 'https://' + x}" target="_blank">${x}</a>` : ''
        }
      }));
```

---

<!-- ## MotherDuck (Not Available Yet) -->


<!-- ```js
import { MDConnection } from '@motherduck/wasm-client/with-arrow';
import * as XLSX from "npm:xlsx";
import * as vg from "@uwdata/vgplot";
import { token } from "../assets/secrets/motherduck_token.js";
import { html } from "@observablehq/stdlib";
import { Inputs } from "@observablehq/inputs";

const loadWasmModule = async () => {
  try {
    const connection = await MDConnection.create({
      mdToken: token,
      wasmUrl: "https://cdn.motherduck.com/motherduck-duckdb-wasm/1.1.3/motherduck.duckdb_extension.wasm",
      duckdbConfig: {
        mainModuleURL: "https://cdn.motherduck.com/motherduck-duckdb-wasm/1.1.3/duckdb-browser.worker.js"
      }
    });
    await connection.isInitialized();
    return connection;
  } catch (error) {
    console.error("WASM initialization error:", error);
    throw error;
  }
};

async function mdConnector(token) {
  const connection = await loadWasmModule();
  return {
    query: async (query) => {
      try {
        const { sql, type } = query;
        const result = await connection.evaluateQuery(sql);
        
        switch (type) {
          case "arrow":
            return result.data;
          case "json":
            return result.data.toRows();
          case "exec":
            return undefined;
        }
      } catch (error) {
        console.error("Query error:", error);
        throw error;
      }
    },
  };
}

const connector = await mdConnector(token);
const app = document.querySelector("#app");

vg.coordinator().databaseConnector(connector);

const table = "s.main.gaia_sample_1_percent_projected";
const size = await connector.query({ 
  sql: `SELECT * FROM information_schema.tables WHERE table_schema = 'main'`, 
  type: "arrow" 
});

const data = size.toRows();
const datasetname = "motherduck_tables";

display(html`
  <div style="display: flex; margin-bottom: 10px;">
    ${Inputs.button(`Download ${datasetname}.xlsx`, {
      reduce() {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet);
        XLSX.writeFile(workbook, `${datasetname}.xlsx`);
      }
    })}
    ${Inputs.button(`Download ${datasetname}.csv`, {
      reduce() {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const csvContent = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${datasetname}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    })}
  </div>
  ${Inputs.table(size, { rows: 30 })}
`);
``` -->