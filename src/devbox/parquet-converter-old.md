---
index: true
---

# Parquet Converter

A simple app that profile your datasets and converts it to the parquet format, using DuckDB-wasm under the hood.

```js
// File input setup
const file = view(Inputs.file({
  accept: ".arrow,.csv, .parquet",
  description: "Upload an Arrow or CSV file"
}));
```

```js
// Get table name from file, removing extension
const table = file?.name.replace(/\.(arrow|csv|parquet)$/, "");
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
          download(await toParquet(db, {table}));
          this.disabled = false;
        }}
      >
        Download ${table}.parquet
      </button>`
    : html`<button class="download-btn" disabled>…</button>`
);
```

```js
// Exports a DuckDB table to parquet.
async function toParquet(duckDbClient, {table = "data", name = `${table}.parquet`} = {}) {
  const tmp = (Math.random() * 1e16).toString(16);
  const db = duckDbClient._db;
  // https://duckdb.org/docs/sql/statements/copy
  console.log("start COPY", {table, name, tmp});
  await duckDbClient.query(`COPY ${duckDbClient.escape(table)} TO '${tmp}' (FORMAT PARQUET, COMPRESSION GZIP)`);
  console.log("start copyFileToBuffer");
  const buffer = await db.copyFileToBuffer(tmp);
  //db.dropFile(tmp);

  return new File([buffer], name, {
    // https://issues.apache.org/jira/browse/PARQUET-1889
    type: "application/vnd.apache.parquet"
  });
}

// Triggers a download. Needs to be invoked via a user input.
function download(file) {
  const a = document.createElement("a");
  a.download = file.name;
  a.href = URL.createObjectURL(file);
  a.click();
  URL.revokeObjectURL(a.href);
}
```

```js
// Define the SQL query
const SQL_QUERY = `SELECT * FROM ${table} LIMIT 10`;
```

```js
// UI Component
display(
  html`<div style="max-width: 1200px; margin: 20px auto;">
    ${file ? html`
      ${db && html`
        <div style="margin-top: 20px;">
          <h3>Preview (top 10 rows):</h3>
          ${Inputs.table(db.query(`${SQL_QUERY}`))}
        </div>
      `}
    ` : html`
      <div style="text-align: center; color: #666; padding: 20px;">
        Upload a file to begin
      </div>
    `}
  </div>`
);
```


```js
// Schema component
display(
  html`<div style="max-width: 1200px; margin: 20px auto;">
    ${file ? html`
      ${db && html`
        <div style="margin-top: 20px;">
          <h3>Schema Summary:</h3>
          ${Inputs.table(db.query(`SELECT column_name, column_type, count, approx_unique, min,	max, 	avg,	std FROM (SUMMARIZE (SELECT * FROM ${table} LIMIT 1000000))`))}
        </div>
      `}
    ` : null}
  </div>`
);
