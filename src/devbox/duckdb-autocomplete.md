---
theme: dashboard
index: true
keywords: duckdb, wasm
---

# DuckDB (WASM)

```js
import {datetime} from "../components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Upload Dataset

```js
const file = view(Inputs.file({
  accept: ".arrow,.csv,.parquet",
  description: "Upload a data file"
}));
```

```js
const table = file?.name.replace(/\.(arrow|csv|parquet)$/, "");
```

```js
const db = file && DuckDBClient.of({[table]: file});
```

```js
async function toParquet(duckDbClient, {table = "data", name = `${table}.parquet`} = {}) {
  const tmp = (Math.random() * 1e16).toString(16);
  const db = duckDbClient._db;
  await duckDbClient.query(`COPY ${duckDbClient.escape(table)} TO '${tmp}' (FORMAT PARQUET, COMPRESSION GZIP)`);
  const buffer = await db.copyFileToBuffer(tmp);
  return new File([buffer], name, {
    type: "application/vnd.apache.parquet"
  });
}

function download(file) {
  const a = document.createElement("a");
  a.download = file.name;
  a.href = URL.createObjectURL(file);
  a.click();
  URL.revokeObjectURL(a.href);
}
```

---

## SQL Query

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
      <button
        class="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
    `}
  </div>
` : null);
```

---

## Schema Profile

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
      <button
        class="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
    `}
  </div>
` : null);
```