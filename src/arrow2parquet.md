---
index: true
---

# Convert Arrow files to parquet

A simple app that converts your arrow files to the parquet format, using DuckDB-wasm under the hood.

```js
// File input setup
const file = view(Inputs.file({
  accept: ".arrow,.csv",
  description: "Upload an Arrow or CSV file"
}));
```

```js
// Get table name from file, removing extension
const table = file?.name.replace(/\.(arrow|csv)$/, "");
```

```js
const db = file && DuckDBClient.of({[table]: file});
```

```js
display(
  file
    ? html`<button
        onclick=${async function () {
          this.disabled = true;
          download(await toParquet(db, {table}));
          this.disabled = false;
        }}
      >
        Download ${table}.parquet
      </button>`
    : html`<button disabled>…</button>`
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
const SQL_QUERY = `SELECT * FROM ${table} LIMIT 100`;
```

```js
// UI Component
display(
  html`<div style="max-width: 1200px; margin: 20px auto;">
    ${file ? html`
      ${db && html`
        <div style="margin-top: 20px;">
          <h3>Preview (top 100 rows):</h3>
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