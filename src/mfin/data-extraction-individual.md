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

```html
<style>
.observablehq textarea {
  min-height: 500px !important;
}
</style>
```

<!-- ```js
// Create the dropdown for pre-built queries
const returnInput = view(Inputs.range([0, 750], {
  step: 25, 
  value: 0, // Set initial value
  placeholder: "1-750"
}));
``` -->

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
// Create the SQL query string based on selected table
const code = `SELECT *
FROM ${selectedTable.table_name}
LIMIT 10`;
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

## SQL View: (Customer# 128, Bojana Popovic) 

```js
// Create the textarea that updates based on the selected query
const prebuiltCode = view(Inputs.textarea({
  value: `CREATE OR REPLACE VIEW Renan_Peres_1 AS (
SELECT 
    pd.date,
    cd.customer_id,
    cd.full_name,
    ad.account_id,
    ad.main_account AS main_account_id,
	hc.ticker,
    sm.security_name,
    sm.sec_type,
    sm.major_asset_class,
    sm.minor_asset_class,
    hc.quantity,
    pd.value AS adj_closing_price,
    ROUND((hc.quantity * pd.value), 2) AS amount
FROM customer_details cd 
JOIN account_dim ad ON ad.client_id = cd.customer_id
JOIN holdings_current hc ON hc.account_id = ad.account_id
JOIN security_masterlist sm ON hc.ticker = sm.ticker
JOIN pricing_daily_new pd ON pd.ticker = sm.ticker AND hc.date = pd.date
WHERE 
    cd.customer_id = '128'
    AND pd.price_type = 'Adjusted'
);

SELECT *
FROM Renan_Peres_1 
 `,
  width: "1000px",
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

---

## Q1 (Part #1): What is the most recent 12 months, 24 months, 36 months return for each of the securities? 

```js
// Create the textarea that updates based on the selected query
const rorCode = view(Inputs.textarea({
  value: `CREATE OR REPLACE VIEW Renan_Peres_ror AS (
WITH price_history AS (
SELECT 
	pd.date,  
	pd.ticker,
	pd.value,  
	NULLIF(LAG(pd.value, 250) OVER (
			PARTITION BY pd.ticker 
			ORDER BY pd.date
			), 0) AS prev_12m,
	NULLIF(LAG(pd.value, 500) OVER (
			PARTITION BY pd.ticker 
			ORDER BY pd.date 
			), 0) AS prev_24m,	
	NULLIF(LAG(pd.value, 750) OVER (
			PARTITION BY pd.ticker 
			ORDER BY pd.date
			), 0) AS prev_36m 
FROM pricing_daily_new pd
JOIN Renan_Peres_1 rp ON rp.ticker = pd.ticker
WHERE 
	pd.price_type = 'Adjusted'
	AND CAST(pd.value AS DECIMAL) != 0
)

SELECT 
     date
    , ticker 
    , value as adj_closing_price
    , (value-prev_12m)/prev_12m as ror_12m
    , (value-prev_24m)/prev_24m as ror_24m
    , (value-prev_36m)/prev_36m as ror_36m
FROM price_history
WHERE date = '2022-09-09'

);

SELECT DISTINCT *
FROM Renan_Peres_ror
ORDER BY
	date, 
  ticker`,
  width: "1000px",
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
const rorQueryResult = predefinedDb.query(rorCode);
display(Inputs.table(rorQueryResult));

// Display download buttons if we have results
if (rorQueryResult) {
  display(html`
    <div class="flex gap-6 mt-4">
      <button
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${rorCode}`);
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
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${rorCode}`);
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

## Q1 (Part #2): What is the Average return for for the entire portfolio?

```js
// Create the textarea that updates based on the selected query
const rorQueryResult2 = view(Inputs.textarea({
  value: `WITH port AS (
    SELECT 
        ticker,
        SUM(quantity) AS quantity
    FROM Renan_Peres_1 
    GROUP BY ticker
), 
avg_12m AS (
    SELECT   
        ticker,
        AVG(ror_12m) as avg_ror_12m
    FROM Renan_Peres_ror 
    GROUP BY ticker    
HAVING  AVG(ror_12m) IS NOT NULL              
),
avg_24m AS (
    SELECT  
        ticker,
        AVG(ror_24m) as avg_ror_24m
    FROM Renan_Peres_ror
    GROUP BY ticker                  
HAVING  AVG(ror_24m) IS NOT NULL       
),
avg_36m AS (
    SELECT  
        ticker,
        AVG(ror_36m) as avg_ror_36m
    FROM Renan_Peres_ror
    GROUP BY ticker      
HAVING  AVG(ror_36m) IS NOT NULL                 
),
portfolio_total AS (
    SELECT 
        port.*,                    
        avg_12m.avg_ror_12m,
        avg_24m.avg_ror_24m,
        avg_36m.avg_ror_36m
    FROM port 
    LEFT JOIN avg_12m ON avg_12m.ticker = port.ticker
    LEFT JOIN avg_24m ON avg_24m.ticker = port.ticker
    LEFT JOIN avg_36m ON avg_36m.ticker = port.ticker
),
final_result AS (
    SELECT * FROM portfolio_total
    UNION ALL
    SELECT 
        'Portfolio Average Return' as ticker,
        SUM(quantity) as quantity,
        (SELECT SUM(quantity * avg_ror_12m) / SUM(quantity) as avg_ror_12m FROM portfolio_total WHERE avg_ror_12m IS NOT NULL),
        (SELECT SUM(quantity * avg_ror_24m) / SUM(quantity) as avg_ror_24m FROM portfolio_total WHERE avg_ror_24m IS NOT NULL),
        (SELECT SUM(quantity * avg_ror_36m) / SUM(quantity) as avg_ror_36m FROM portfolio_total WHERE avg_ror_36m IS NOT NULL)
    FROM portfolio_total
)
SELECT * FROM final_result
ORDER BY CASE 
    WHEN ticker =  'Portfolio Average Return' THEN 1 
    ELSE 2 
END;`,
  width: "1000px",
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
const rorResult2 = predefinedDb.query(rorQueryResult2);
display(Inputs.table(rorResult2));

// Display download buttons if we have results
if (rorResult2) {
  display(html`
    <div class="flex gap-6 mt-4">
      <button
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${rorQueryResult2}`);
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
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${rorQueryResult2}`);
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

## Q2: What is the most recent 12months sigma (risk) for each of the securities? What is the average daily return for each of the securities? 

```js
// Create the textarea that updates based on the selected query
const riskCode1 = view(Inputs.textarea({
  value: `WITH prev_1d AS (
    SELECT 
        pd.date,  
        pd.ticker,
        pd.value,   
        NULLIF(LAG(pd.value, 1) OVER ( 
                PARTITION BY pd.ticker  
                ORDER BY pd.date
            ), 0) AS prev_1d,
        NULLIF(LAG(pd.value, 250) OVER ( 
                PARTITION BY pd.ticker 
                ORDER BY pd.date
            ), 0) AS prev_12m 
    FROM pricing_daily_new pd
    JOIN Renan_Peres_1 rp ON rp.ticker = pd.ticker
    WHERE 
        pd.price_type = 'Adjusted'
        AND CAST(pd.value AS DECIMAL) != 0
        AND pd.date BETWEEN '2021-09-08' AND '2022-09-09'
),
ror AS (
    SELECT *,
        (value-prev_1d)/prev_1d as ror_1d
    FROM prev_1d
),
avg AS (
    SELECT 
        ticker,
        AVG(ror_1d) as avg_ror_12m
    FROM ror 
    WHERE ror_1d IS NOT NULL
    GROUP BY ticker
),
std AS (
    SELECT 
        ticker,
        STDDEV(prev_12m) as std_12m
    FROM ror 
    WHERE prev_12m IS NOT NULL
    GROUP BY ticker
)
SELECT DISTINCT
    ror.ticker,
    avg.avg_ror_12m,
    std.std_12m
FROM ror 
JOIN avg ON avg.ticker = ror.ticker
JOIN std ON std.ticker = ror.ticker`,
  width: "1000px",
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
const riskQueryResult1 = predefinedDb.query(riskCode1);
display(Inputs.table(riskQueryResult1));

// Display download buttons if we have results
if (riskQueryResult1) {
  display(html`
    <div class="flex gap-6 mt-4">
      <button
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${riskCode1}`);
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
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${riskCode1}`);
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

## Q3: Suggest adding a new investment to your portfolio - what would it be and how much risk (sigma) would it add to your client?  

---

## Q4: Risk adjusted returns for each Security by following this formula: AVG(returns for ticker)/STD(returns for ticker). Which of the securities is best from the rest (with highest risk adjusted returns), why?

```js
// Create the textarea that updates based on the selected query
const riskCode2 = view(Inputs.textarea({
  value: `SELECT 
    ticker,
	(AVG(ror_1d)  / STDDEV(ror_1d)) as adj_daly_ror_12m 
FROM Renan_Peres_ror 
WHERE 
	date BETWEEN '2021-09-09' AND '2022-09-09'
	-- date >= (SELECT MAX(date) FROM Renan_Peres_ror) - INTERVAL '12 months'
GROUP BY ticker
ORDER BY ticker;`,
  width: "1000px",
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
const riskQueryResult2 = predefinedDb.query(riskCode2);
display(Inputs.table(riskQueryResult2));

// Display download buttons if we have results
if (riskQueryResult2) {
  display(html`
    <div class="flex gap-6 mt-4">
      <button
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${riskCode2}`);
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
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${riskCode2}`);
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