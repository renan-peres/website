---
theme: dashboard
index: true
toc: false
keywords: duckdb, wasm
sql:
  account_dim: ./data/account_dim.csv
  customer_details: ./data/customer_details.csv
  holdings_current: ./data/holdings_current.csv
  pricing_daily_new: ./data/pricing_daily_new.csv
  security_masterlist: ./data/security_masterlist.csv
---

# Data Extraction & Visualization

```js
import {datetime} from "../components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

```js
// Load predefined tables
const security_masterlist = FileAttachment("./data/security_masterlist.csv").csv({typed: true});
const account_dim = FileAttachment("./data/account_dim.csv").csv({typed: true});
const customer_details = FileAttachment("./data/customer_details.csv").csv({typed: true});
const holdings_current = FileAttachment("./data/holdings_current.csv").csv({typed: true});
const pricing_daily_new = FileAttachment("./data/pricing_daily_new.csv").csv({typed: true});

// Initialize DuckDB with predefined tables
const predefinedDb = DuckDBClient.of({
  security_masterlist,
  account_dim,
  customer_details,
  holdings_current,
  pricing_daily_new,
});

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

## Tables

```sql id=tables
SELECT DISTINCT table_name 
FROM information_schema.tables 
WHERE table_schema = 'main'
```

```js
// Create the select input and store its value
const selectedTable = view(Inputs.select(tables, {
  format: d => d.table_name,
  value: "security_masterlist" // default value
}));
```

```js
const code = view(Inputs.textarea({
  value: `SELECT *
FROM ${selectedTable.table_name}
LIMIT 10`,
  width: "1000px",
  rows: 8,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
// Execute and display query results
const queryResult = predefinedDb.query(code);
display(Inputs.table(queryResult));

// Display download buttons if we have results
if (queryResult) {
  display(html`
    <div class="flex gap-6 mt-4">
      <button
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${code}`);
          await predefinedDb.query(`COPY ${tmpTable} TO '${tmpTable}.csv' WITH (FORMAT CSV, HEADER)`);
          const buffer = await predefinedDb._db.copyFileToBuffer(`${tmpTable}.csv`);
          const file = new File([buffer], `result_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}.csv`, { type: "text/csv" });
          download(file);
          await predefinedDb.query(`DROP TABLE ${tmpTable}`);
          this.disabled = false;
        }}
      >
        Download Result as CSV
      </button>
      <button
        class="px-6 py-2 ml-4 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${code}`);
          const timestamp = `${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}`;
          const parquetFile = await toParquet(predefinedDb, {
            table: tmpTable,
            name: `result_${timestamp}.parquet`
          });
          download(parquetFile);
          await predefinedDb.query(`DROP TABLE ${tmpTable}`);
          this.disabled = false;
        }}
      >
        Download Result as Parquet
      </button>
    </div>
  `);
}
```

---

## Pre-Built Queries

```js
// Define pre-built queries
const queries = {
  "ror_25": `WITH sub1 AS (
SELECT
    date
    ,ticker
    ,value
    , lag(value,25) 
        OVER (
            PARTITION BY ticker
            ORDER BY date) AS "p25"
FROM pricing_daily_new
WHERE 
    price_type = 'Adjusted'
    AND date >= '2022-08-01'
    AND ticker IN ('TLSA', 'NVDA', 'CRM', 'SPY', 'AGG', 'GLD')
), 

sub2 AS (
SELECT 
    *
    , (value-p25)/p25 as p25_ror
FROM sub1
)

SELECT *
    ,CONCAT(ROUND(p25_ror * 100, 2), '%') as 'p25_ror_%'
FROM sub2
WHERE p25_ror IS NOT NULL
ORDER BY
    date
    ,ticker
    ,p25_ror`
};

// Create the dropdown for pre-built queries
const selectedPrebuiltQuery = view(Inputs.select(Object.keys(queries), {
  value: "ror_25"
}));

// Create the textarea that updates based on the selected query
const prebuiltCode = view(Inputs.textarea({
  value: `WITH sub1 AS (
SELECT
    date
    ,ticker
    ,value
    , lag(value,25) 
        OVER (
            PARTITION BY ticker
            ORDER BY date) AS "p25"
FROM pricing_daily_new
WHERE 
    price_type = 'Adjusted'
    AND date >= '2022-08-01'
    AND ticker IN ('TLSA', 'NVDA', 'CRM', 'SPY', 'AGG', 'GLD')
), 

sub2 AS (
SELECT 
    *
    , (value-p25)/p25 as p25_ror
FROM sub1
)

SELECT *
    ,CONCAT(ROUND(p25_ror * 100, 2), '%') as 'p25_ror_%'
FROM sub2
WHERE p25_ror IS NOT NULL
ORDER BY
    date
    ,ticker
    ,p25_ror`,
  width: "1000px",
  rows: 10,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
// Execute and display pre-built query results
const prebuiltQueryResult = predefinedDb.query(prebuiltCode);
display(Inputs.table(prebuiltQueryResult));

// Display download buttons if we have results
if (prebuiltQueryResult) {
  display(html`
    <div class="flex gap-6 mt-4">
      <button
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${prebuiltCode}`);
          await predefinedDb.query(`COPY ${tmpTable} TO '${tmpTable}.csv' WITH (FORMAT CSV, HEADER)`);
          const buffer = await predefinedDb._db.copyFileToBuffer(`${tmpTable}.csv`);
          const file = new File([buffer], `result_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}.csv`, { type: "text/csv" });
          download(file);
          await predefinedDb.query(`DROP TABLE ${tmpTable}`);
          this.disabled = false;
        }}
      >
        Download Result as CSV
      </button>
      <button
        class="px-6 py-2 ml-4 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${prebuiltCode}`);
          const timestamp = `${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}`;
          const parquetFile = await toParquet(predefinedDb, {
            table: tmpTable,
            name: `result_${timestamp}.parquet`
          });
          download(parquetFile);
          await predefinedDb.query(`DROP TABLE ${tmpTable}`);
          this.disabled = false;
        }}
      >
        Download Result as Parquet
      </button>
    </div>
  `);
}
```