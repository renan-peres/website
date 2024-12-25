---
theme: dashboard
index: true
keywords: duckdb, wasm
---

# Parquet Converter (DuckDB WASM)

```js
import {datetime} from "../assets/components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>
A simple app that allows you to convert your datasets converts them to the parquet format, using DuckDB-wasm under the hood.

---

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

## Upload Dataset

```js
const file = view(Inputs.file({
  accept: ".arrow,.csv,.parquet",
  description: "Upload a data file"
}));
```

```js
const originalName = file?.name.replace(/\.(arrow|csv|parquet)$/, "");
const table = file && sanitizeTableName(file.name);
```

```js
const db = file && DuckDBClient.of({[table]: file});
```

```js
display(
  file
    ? html`
      <style>
        .download-btn {
          background-color: #2563eb;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .download-btn:hover {
          background-color: #1d4ed8;
        }
        .download-btn:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }
      </style>
      <button
        class="download-btn"
        onclick=${async function () {
          this.disabled = true;
          download(await toParquet(db, {table, originalName}));
          this.disabled = false;
        }}
      >
        Download ${originalName}.parquet
      </button>`
    : html`<button class="download-btn" disabled>…</button>`
);
```

<!-- ```js
display(
  file
    ? html`
      <button
         class="px-6 py-2 ml-4 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400"
          onclick=${async function () {
          this.disabled = true;
          download(await toParquet(db, {table, originalName}));
          this.disabled = false;
        }}
      >
        Download ${originalName}.parquet
      </button>`
    : html`<button class="download-btn" disabled>…</button>`
);
``` -->

---

## Query (SQL)

```js
const code = view(Inputs.textarea({
  value: `SELECT *
FROM ${table}
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
const queryResult = file && db && db.query(code);
display(file ? html`
  <div>
    ${Inputs.table(queryResult)}
    ${queryResult && html`
      <div class="flex gap-6 mt-4">
        <button
          class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          onclick=${async function() {
            this.disabled = true;
            const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
            await db.query(`CREATE TABLE ${tmpTable} AS ${code}`);
            await db.query(`COPY ${tmpTable} TO '${tmpTable}.csv' WITH (FORMAT CSV, HEADER)`);
            const buffer = await db._db.copyFileToBuffer(`${tmpTable}.csv`);
            const file = new File([buffer], `result_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}.csv`, { type: "text/csv" });
            download(file);
            await db.query(`DROP TABLE ${tmpTable}`);
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
            await db.query(`CREATE TABLE ${tmpTable} AS ${code}`);
            const timestamp = `${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}`;
            const parquetFile = await toParquet(db, {
              table: tmpTable,
              name: `result_${timestamp}.parquet`
            });
            download(parquetFile);
            await db.query(`DROP TABLE ${tmpTable}`);
            this.disabled = false;
          }}
        >
          Download Result as Parquet
        </button>
      </div>
    `}
  </div>
` : null);
```

---

## Profile Schema (SQL)

```js
const schema = view(Inputs.textarea({
  value: 
`SELECT 
    column_name, 
    column_type, 
    count, 
    approx_unique, 
    min, 
    max, 
    avg, 
    std, 
    q25, 
    q50, 
    q75, 
    null_percentage 
FROM (SUMMARIZE (SELECT * FROM ${table} LIMIT 1000000))`,
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
const schemaResult = file && db && db.query(schema);
display(file ? html`
  <div>
    ${Inputs.table(schemaResult)}
    ${schemaResult && html`
      <div class="flex gap-6 mt-4">
        <button
          class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          onclick=${async function() {
            this.disabled = true;
            const tmpTable = "schema_" + (Math.random() * 1e16).toString(16);
            await db.query(`CREATE TABLE ${tmpTable} AS ${schema}`);
            await db.query(`COPY ${tmpTable} TO '${tmpTable}.csv' WITH (FORMAT CSV, HEADER)`);
            const buffer = await db._db.copyFileToBuffer(`${tmpTable}.csv`);
            const file = new File([buffer], `schema_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}.csv`, { type: "text/csv" });
            download(file);
            await db.query(`DROP TABLE ${tmpTable}`);
            this.disabled = false;
          }}
        >
          Download Schema as CSV
        </button>
        <button
          class="px-6 py-2 ml-4 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400"
          onclick=${async function() {
            this.disabled = true;
            const tmpTable = "schema_" + (Math.random() * 1e16).toString(16);
            await db.query(`CREATE TABLE ${tmpTable} AS ${schema}`);
            const timestamp = `${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}`;
            const parquetFile = await toParquet(db, {
              table: tmpTable,
              name: `schema_${timestamp}.parquet`
            });
            download(parquetFile);
            await db.query(`DROP TABLE ${tmpTable}`);
            this.disabled = false;
          }}
        >
          Download Schema as Parquet
        </button>
      </div>
    `}
  </div>
` : null);
```