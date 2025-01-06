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
.observablehq textarea,
.observablehq-input textarea,
.sql-editor {
  min-height: 500px !important;
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

```js
import {datetime} from "../../../../assets/components/datetime.js";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../../../../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";

const predefinedDb = await getDefaultClient();
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

<!-- ```js
// Create the dropdown for pre-built queries
const returnInput = view(Inputs.range([0, 750], {
  step: 25, 
  value: 0, // Set initial value
  placeholder: "1-750"
}));
``` -->

# Portfolio Analysis - Data Extraction & Visualization (Fall 2024)

<div class="datetime-container">
  <div id="datetime"></div>
</div>

This project presents a comprehensive portfolio analysis tool combining SQL-based data extraction with Tableau visualization capabilities. The system analyzes financial portfolio data for customer #128 (Bojana Popovic), providing insights into investment performance, risk assessment, and potential portfolio optimization opportunities. By leveraging both SQL for complex calculations and Tableau for visualization, the project delivers a complete view of the client's investment portfolio.

### Key Features
- DuckDB integration for efficient data processing
- Sequential query execution for streamlined analysis
- Responsive full-width layout design
- Interactive data visualization
- Export functionality in CSV and Parquet formats
- Automated data processing and handling
- Real-time data extraction capabilities

### [Part 1: Data Extraction (SQL)](#part-1-data-extraction-sql-1)
The SQL component integrates multiple data sources including account dimensions, customer details, holdings, and pricing information. It processes this data through a series of analytical queries:

- **SQL View**: Creates a comprehensive view consolidating all client portfolio data with relevant dimensions and metrics
- **Query 1**: Analyzes portfolio performance through 12, 24, and 36-month return calculations for individual securities and the overall portfolio
- **Query 2**: Evaluates investment risk through sigma (volatility) calculations and average daily returns
- **Query 3**: Identifies potential investment opportunities by analyzing securities not currently in the portfolio
- **Query 4**: Calculates risk-adjusted returns (Sharpe-like ratio) to determine optimal investment efficiency

### [Part 2: Interactive Dashboard (Tableau)](#part-2-interactive-dashboard-tableau-1)
The Tableau dashboard provides an interactive visualization layer that transforms the SQL analysis into actionable insights:

- Asset allocation breakdown and portfolio composition
- Historical performance trends and comparisons
- Risk-return relationship visualization
- Dynamic filtering and drill-down capabilities
- Fullscreen viewing mode for detailed analysis
- Real-time metric updates and portfolio monitoring

This dual-approach methodology combines the computational power of SQL with the visual analytics of Tableau, providing a robust platform for comprehensive portfolio analysis and decision-making support.

---

# Part 2: Interactive Dashboard (Tableau) 

```js
const fullscreenBtn = htl.html`
<button style="margin-bottom: 10px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
 onclick=${(e) => {
   const vizContainer = document.getElementById('viz1734447659946');
   if (vizContainer.requestFullscreen) {
     vizContainer.requestFullscreen();
   } else if (vizContainer.webkitRequestFullscreen) {
     vizContainer.webkitRequestFullscreen();
   } else if (vizContainer.msRequestFullscreen) {
     vizContainer.msRequestFullscreen();
   }
 }}>
 Fullscreen
</button>`
```

<div>
  ${fullscreenBtn}
  <div style="width: 100%; position: relative;">
    <div class='tableauPlaceholder' id='viz1734447659946' style='position: relative'>
      <noscript>
        <a href='#'>
          <img alt='Dashboard 1' src='https://public.tableau.com/static/images/Po/PortfolioAnalysis_17342958726450/Dashboard1/1_rss.png' style='border: none' />
        </a>
      </noscript>
      <object class='tableauViz' style='display:none;'>
        <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
        <param name='embed_code_version' value='3' />
        <param name='site_root' value='' />
        <param name='name' value='PortfolioAnalysis_17342958726450/Dashboard1' />
        <param name='tabs' value='no' />
        <param name='toolbar' value='yes' />
        <param name='static_image' value='https://public.tableau.com/static/images/Po/PortfolioAnalysis_17342958726450/Dashboard1/1.png' />
        <param name='animate_transition' value='yes' />
        <param name='display_static_image' value='yes' />
        <param name='display_spinner' value='yes' />
        <param name='display_overlay' value='yes' />
        <param name='display_count' value='yes' />
        <param name='language' value='en-US' />
      </object>
    </div>
    <script type='text/javascript'>
      var divElement = document.getElementById('viz1734447659946');
      var vizElement = divElement.getElementsByTagName('object')[0];
      if (divElement.offsetWidth > 800) {
        vizElement.style.width = '100%';
        vizElement.style.height = (divElement.offsetWidth * 0.30) + 'px';
      } else if (divElement.offsetWidth > 500) {
        vizElement.style.width = '100%';
        vizElement.style.height = (divElement.offsetWidth * 0.30) + 'px';
      } else {
        vizElement.style.width = '100%';
        vizElement.style.height = '1327px';
      }
      var scriptElement = document.createElement('script');
      scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
      vizElement.parentNode.insertBefore(scriptElement, vizElement);
    </script>
  </div>
</div>

---

# Part 1: Data Extraction (SQL)

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

## SQL View: Customer Portfolio
- Step1: Identify your client (listed above) in your database - learn about your client and what they have. Create all required relationships between tables (joins) to better understand what assets your client has, asset classifications, asset types and prices.  

- Step 2: Once you get that large joined table with all your client's assets and their prices (from Step1) - use that data to create a VIEW in the invest schema with data for your client.  This view should have the following information: asset classification (major and minor), asset names, asset types, prices with pricing information and dates and have ONLY the data related to your client. Make sure to add all necessary filters for your VIEW.

```js
// Create the textarea that updates based on the selected query
const prebuiltCode = view(Inputs.textarea({
  value: `CREATE VIEW RenanPeres AS (

/* 
SQL VIEW: This VIEW below contains the daily pricing (adjusted) details for the securities that customer #128 (Bojana Popovic) posses in his portfolio (as of the last day holdings_current table '2022-09-09'). 
			The data contains information for the periods BETWEEN '2019-09-08' AND '2022-09-09'.
			The VIEW also contains the filters and dimensions that will be useful to answerd the questions for the PART #1 (Q. 1-4) of the Assignment as well as for PART #2 in Tableau for the visualization part.
*/

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
    pd.value AS adj_closing_price
FROM customer_details cd 
JOIN account_dim ad ON ad.client_id = cd.customer_id
JOIN holdings_current hc ON hc.account_id = ad.account_id
JOIN security_masterlist sm ON hc.ticker = sm.ticker
JOIN pricing_daily_new pd ON pd.ticker = sm.ticker 
WHERE 
    cd.customer_id = '128'
    AND pd.price_type = 'Adjusted'
    AND pd.date BETWEEN '2019-09-08' AND '2022-09-09'
);

SELECT *
FROM RenanPeres`,
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

## Q1: What is the most recent 12 months, 24 months, 36 months return for each of the securities? And for the Whole Portfolio?

```js
// Create the textarea that updates based on the selected query
const rorCode = view(Inputs.textarea({
  value: `WITH price_history AS (
    SELECT DISTINCT
        rp.date,  
        rp.ticker,
        rp.quantity,
        rp.adj_closing_price,  
        NULLIF(LAG(rp.adj_closing_price, 250) OVER (
                PARTITION BY rp.ticker 
                ORDER BY rp.date
                ), 0) AS prev_12m,
        NULLIF(LAG(rp.adj_closing_price, 500) OVER (
                PARTITION BY rp.ticker 
                ORDER BY rp.date
                ), 0) AS prev_24m,    
        NULLIF(LAG(rp.adj_closing_price, 750) OVER (
                PARTITION BY rp.ticker 
                ORDER BY rp.date
                ), 0)  AS prev_36m 
    FROM RenanPeres rp
    WHERE CAST(rp.adj_closing_price AS DECIMAL) != 0
),
ror AS (
    SELECT 
        date,
        ticker, 
        quantity,
        adj_closing_price,
        (adj_closing_price-prev_12m)/prev_12m as ror_12m,
        (adj_closing_price-prev_24m)/prev_24m as ror_24m,
        (adj_closing_price-prev_36m)/prev_36m as ror_36m
    FROM price_history
),

-- Part 1: Most Recent Return for each of the Securities
sec_ror AS (
    SELECT DISTINCT *
    FROM ror
    WHERE date = '2022-09-09'
)

-- Part 2: Return for the whole Portfolio
SELECT  
    'Portfolio Return' as ticker,
    SUM(quantity * ror_12m) / NULLIF(SUM(CASE WHEN ror_12m IS NOT NULL THEN quantity END), 0) as ror_12m,
    SUM(quantity * ror_24m) / NULLIF(SUM(CASE WHEN ror_24m IS NOT NULL THEN quantity END), 0) as ror_24m,
    SUM(quantity * ror_36m) / NULLIF(SUM(CASE WHEN ror_36m IS NOT NULL THEN quantity END), 0) as ror_36m
FROM sec_ror;`,
  width: "1000px",
  rows: 10,
  resize: "both",
  className: "sql-editor",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));

// Execute query and trigger next one
const rorQueryResult = predefinedDb.query(rorCode);
display(Inputs.table(rorQueryResult));
setTimeout(() => {
  const riskCode1Element = document.querySelector('#risk-code-1');
  if (riskCode1Element) {
    riskCode1Element.dispatchEvent(new Event('input'));
  }
}, 1000);
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

## Q2: What is the most recent 12months sigma (risk) for each of the securities? What is the average daily return for each of the securities? 

```js
// Create the textarea that updates based on the selected query
const riskCode1 = view(Inputs.textarea({
  value: `WITH prev_1d AS (
    SELECT 
        date,  
        ticker,
        adj_closing_price,   
        NULLIF(LAG(adj_closing_price, 1) OVER ( 
                PARTITION BY ticker   
                ORDER BY date
            ), 0) AS prev_1d
    FROM RenanPeres rp 
    WHERE CAST(adj_closing_price AS DECIMAL) != 0
),

ror AS (
    SELECT *,
        (adj_closing_price-prev_1d)/prev_1d as ror_1d
    FROM prev_1d
),

-- Part 1: What is the daily average return for each of the Securities?
avg AS (
    SELECT 
        ticker,
        AVG(ror_1d) as avg_daily_ror_12m
    FROM ror 
    WHERE ror_1d IS NOT NULL AND date BETWEEN '2021-09-08' AND '2022-09-09'
    GROUP BY ticker
),

-- Part 2: What is the Most Recent 12months signma(risk)?
std AS (
    SELECT 
        ticker,
        STDDEV(ror_1d) as std_12m
    FROM ror 
    WHERE ror_1d IS NOT NULL AND date BETWEEN '2021-09-08' AND '2022-09-09'
    GROUP BY ticker
)

SELECT DISTINCT
    ror.ticker,
    avg.avg_daily_ror_12m,
    std.std_12m
FROM ror 
JOIN avg ON avg.ticker = ror.ticker
JOIN std ON std.ticker = ror.ticker;`,
  width: "1000px",
  rows: 10,
  resize: "both",
  className: "sql-editor",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));

// Execute query and trigger next one
const riskQueryResult1 = predefinedDb.query(riskCode1);
display(Inputs.table(riskQueryResult1));
setTimeout(() => {
  const question3Element = document.querySelector('#question-3');
  if (question3Element) {
    question3Element.dispatchEvent(new Event('input'));
  }
}, 1000);
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

```js
// Create the textarea that updates based on the selected query
const question3 = view(Inputs.textarea({
  value: `-- Part 1: Extract Historical data for the Securities (NOT Included in the Client's Portfolio)
WITH price_history AS (
    SELECT 
        pd.date,
        pd.ticker,
        sm.security_name,
        sm.sec_type,
        sm.major_asset_class,
        sm.minor_asset_class,
        pd.value AS adj_closing_price,
        NULLIF(LAG(pd.value, 1) OVER (
                PARTITION BY pd.ticker 
                ORDER BY pd.date
                ), 0) AS prev_1d,
        NULLIF(LAG(pd.value, 250) OVER (
                PARTITION BY pd.ticker 
                ORDER BY pd.date
                ), 0) AS prev_12m
    FROM pricing_daily_new pd 
    JOIN security_masterlist sm ON pd.ticker = sm.ticker
    WHERE pd.price_type = 'Adjusted'
        AND pd.date BETWEEN '2021-09-08' AND '2022-09-09'
        AND pd.ticker NOT IN (Select DISTINCT ticker from RenanPeres)
),

-- Part 2: Returns
ror AS (
    SELECT 
        date,
        ticker, 
        security_name,
        sec_type,
        major_asset_class,
        minor_asset_class,
        adj_closing_price,
        (adj_closing_price-prev_1d)/prev_1d as ror_1d,
        (adj_closing_price-prev_12m)/prev_12m as ror_12m
    FROM price_history
),

-- Part 3: Sigma
sigma AS (
    SELECT 
        ticker,
        AVG(ror_1d) as avg_daily_ror_12m,
        STDDEV(ror_1d) as std_12m
    FROM ror
    WHERE ror_1d IS NOT NULL
    GROUP BY ticker
),

-- Part 4: Ranking Securities by Return and Risk
ranked_securities AS (
    SELECT 
		r.date,
        r.ticker, 
        r.security_name,
        r.sec_type,
        r.major_asset_class,
        r.minor_asset_class,
        s.avg_daily_ror_12m,
        s.std_12m,
        ROW_NUMBER() OVER (
            PARTITION BY r.major_asset_class
            ORDER BY s.avg_daily_ror_12m DESC, s.std_12m ASC
        ) as rank_within_type
    FROM ror r 
    JOIN sigma s ON r.ticker = s.ticker
    WHERE r.date = '2022-09-09' AND r.ror_12m > 0
)

-- Part 5: Selecting Best Performing Security in for each major_asset_class
SELECT *
FROM ranked_securities
WHERE rank_within_type = 1
ORDER BY 
    sec_type,
    rank_within_type;`,
  width: "1000px",
  rows: 10,
  resize: "both",
  className: "sql-editor",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));

// Execute query and trigger next one
const question3Result = predefinedDb.query(question3);
display(Inputs.table(question3Result));
setTimeout(() => {
  const riskCode2Element = document.querySelector('#risk-code-2');
  if (riskCode2Element) {
    riskCode2Element.dispatchEvent(new Event('input'));
  }
}, 1000);
```

```js
// Execute and display pre-built query results
const question3Result = predefinedDb.query(question3);
display(Inputs.table(question3Result));

// Display download buttons if we have results
if (question3Result) {
  display(html`
    <div class="flex gap-6 mt-4">
      <button
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${question3}`);
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
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${question3}`);
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

## Q4: Risk adjusted returns for each Security by following this formula: AVG(returns for ticker)/STD(returns for ticker). Which of the securities is best from the rest (with highest risk adjusted returns), why?

```js
// Create the textarea that updates based on the selected query
const riskCode2 = view(Inputs.textarea({
  value: `WITH price_history AS (
    SELECT DISTINCT
        rp.date,  
        rp.ticker,
        rp.quantity,
        rp.adj_closing_price,  
        NULLIF(LAG(rp.adj_closing_price, 1) OVER ( 
                PARTITION BY rp.ticker 
                ORDER BY rp.date
                ), 0) AS prev_1d
    FROM RenanPeres rp
    WHERE CAST(rp.adj_closing_price AS DECIMAL) != 0
),
ror AS (
    SELECT 
        date,
        ticker,
        quantity,
        adj_closing_price,
        (adj_closing_price-prev_1d)/prev_1d as ror_1d
    FROM price_history
),
stats AS (
    SELECT 
        ticker,
        AVG(ror_1d) as avg_ror_1d,
        STDDEV(ror_1d) as std_ror_1d
    FROM ror
    WHERE ror_1d IS NOT NULL 
    GROUP BY ticker
)
SELECT 
    ticker,
    (avg_ror_1d / std_ror_1d) as adj_ror_1d
FROM stats
ORDER BY 
	adj_ror_1d DESC;`,
  width: "1000px",
  rows: 10,
  resize: "both",
  className: "sql-editor",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));

// Execute final query
const riskQueryResult2 = predefinedDb.query(riskCode2);
display(Inputs.table(riskQueryResult2));
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