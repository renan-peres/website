---
theme: dashboard
index: true
toc: false
keywords: duckdb, wasm
sql:
  confirmed_country: ./data/Country/confirmed_country.csv
  deaths_country: ./data/Country/deaths_country.csv
  recovered_country: ./data/Country/recovered_country.csv
  vaccination_country: ./data/Country/vaccination_country.csv

  confirmed_province: ./data/Province/confirmed_province.csv
  deaths_province: ./data/Province/deaths_province.csv
  recovered_province: ./data/Province/recovered_province.csv
  vaccination_province: ./data/Province/vaccination_province.csv

  vaccination_total: ./data/vaccination_total.csv
  vaccine_global: ./data/vaccine_global.csv
---

<!-- ```html
<style>
.observablehq textarea {
  min-height: 500px !important;
}
</style>
``` -->

<!-- ```js
// Create the dropdown for pre-built queries
const returnInput = view(Inputs.range([0, 750], {
  step: 25, 
  value: 0, // Set initial value
  placeholder: "1-750"
}));
``` -->

# Covid Data Analysis (Team Assigment)

```js
import {datetime} from "../../../components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

```js
// Load predefined tables
const confirmed_country = FileAttachment("./data/Country/confirmed_country.csv").csv({typed: true});
const deaths_country = FileAttachment("./data/Country/deaths_country.csv").csv({typed: true});
const recovered_country = FileAttachment("./data/Country/recovered_country.csv").csv({typed: true});
const vaccination_country = FileAttachment("./data/Country/vaccination_country.csv").csv({typed: true});

const confirmed_province = FileAttachment("./data/Province/confirmed_province.csv").csv({typed: true});
const deaths_province = FileAttachment("./data/Province/deaths_province.csv").csv({typed: true});
const recovered_province = FileAttachment("./data/Province/recovered_province.csv").csv({typed: true});
const vaccination_province = FileAttachment("./data/Province/vaccination_province.csv").csv({typed: true});

const vaccination_total = FileAttachment("./data/vaccination_total.csv").csv({typed: true});
const vaccine_global = FileAttachment("./data/vaccine_global.csv").csv({typed: true});

// Initialize DuckDB with predefined tables
const predefinedDb = DuckDBClient.of({
  confirmed_country,
  deaths_country,
  recovered_country,
  vaccination_country,

  confirmed_province,
  deaths_province,
  recovered_province,
  vaccination_province,

  vaccination_total,
  vaccine_global
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
-- LIMIT 10`
;
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

## Covid Data

### Country Data
- confirmed_country
- deaths_country
- recovered_country

```js
// Create the textarea that updates based on the selected query
const countryCode = view(Inputs.textarea({
  value: `WITH 
-- Confirmed cases transformation
base_confirmed AS (
    SELECT 
        Country_Region,
        Lat,
        Long,
        STRPTIME(Date, '%m/%d/%Y') AS Date,
        COALESCE(Confirmed, 0) as Confirmed
    FROM confirmed_country
),
confirmed_final AS (
    SELECT
        Country_Region,
        Lat,
        Long,
        Date,
        CASE 
            WHEN Confirmed < Prev_1d THEN Confirmed 
            WHEN MAX(Confirmed - Prev_1d) < 0 THEN 0
            ELSE MAX(Confirmed - Prev_1d)
        END AS Confirmed
    FROM (
        SELECT *, 
            COALESCE(
                LAG(Confirmed) OVER (
                    PARTITION BY Country_Region 
                    ORDER BY Date
                ), 0
            ) AS Prev_1d
        FROM base_confirmed
        WHERE Confirmed != 0
        AND Confirmed = (
            SELECT MAX(Confirmed)
            FROM base_confirmed b
            WHERE b.Country_Region = base_confirmed.Country_Region 
            AND b.Date = base_confirmed.Date
            AND b.Confirmed != 0
        )
    ) conf_country
    GROUP BY Country_Region, Lat, Long, Date, Confirmed, Prev_1d
),

-- Deaths transformation
base_deaths AS (
    SELECT 
        Country_Region,
        Lat,
        Long,
        STRPTIME(Date, '%m/%d/%Y') AS Date,
        COALESCE(Deaths, 0) as Deaths
    FROM deaths_country
),
deaths_final AS (
    SELECT
        Country_Region,
        Lat,
        Long,
        Date,
        CASE 
            WHEN Deaths < Prev_1d THEN Deaths 
            WHEN MAX(Deaths - Prev_1d) < 0 THEN 0
            ELSE MAX(Deaths - Prev_1d)
        END AS Deaths
    FROM (
        SELECT *, 
            COALESCE(
                LAG(Deaths) OVER (
                    PARTITION BY Country_Region 
                    ORDER BY Date
                ), 0
            ) AS Prev_1d
        FROM base_deaths
        WHERE Deaths != 0
        AND Deaths = (
            SELECT MAX(Deaths)
            FROM base_deaths b
            WHERE b.Country_Region = base_deaths.Country_Region 
            AND b.Date = base_deaths.Date
            AND b.Deaths != 0
        )
    ) deaths_country
    GROUP BY Country_Region, Lat, Long, Date, Deaths, Prev_1d
),

-- Recovered transformation
base_recovered AS (
    SELECT 
        Country_Region,
        Lat,
        Long,
        STRPTIME(Date, '%m/%d/%Y') AS Date,
        COALESCE(Recovered, 0) as Recovered
    FROM recovered_country
),
recovered_final AS (
    SELECT
        Country_Region,
        Lat,
        Long,
        Date,
        Recovered - Prev_1d AS Recovered  -- Simple difference between current and previous day
    FROM (
        SELECT *, 
            COALESCE(
                LAG(Recovered, 1) OVER (  -- Explicitly use 1-day lag
                    PARTITION BY Country_Region 
                    ORDER BY Date
                ), 0
            ) AS Prev_1d
        FROM base_recovered
        WHERE Recovered != 0
    ) recovered_country
    GROUP BY Country_Region, Lat, Long, Date, Recovered, Prev_1d
)

SELECT 
    c.Country_Region,
    c.Lat,
    c.Long,
    c.Date,
CAST(EXTRACT(YEAR FROM c.Date) AS INT) as Year,
    MONTHNAME(c.Date) as Month,
    c.Confirmed,
    COALESCE(d.Deaths, 0) as Deaths,
    COALESCE(r.Recovered, 0) as Recovered
FROM confirmed_final c
LEFT JOIN deaths_final d 
    ON c.Country_Region = d.Country_Region 
    AND c.Date = d.Date
LEFT JOIN recovered_final r 
    ON c.Country_Region = r.Country_Region 
    AND c.Date = r.Date
ORDER BY c.Country_Region, c.Date;`,
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
const countryResult = predefinedDb.query(countryCode);
display(Inputs.table(countryResult));

// Display download buttons if we have results
if (countryResult) {
  display(html`
    <div class="flex gap-6 mt-4">
      <button
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${countryCode}`);
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
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${countryCode}`);
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

### Province Data
- confirmed_province
- deaths_province
- recovered_province

```js
// Create the textarea that updates based on the selected query
const provinceCode = view(Inputs.textarea({
  value: `WITH 
-- Confirmed cases transformation
base_confirmed AS (
    SELECT 
        Province_State,
        Country_Region,
        Lat,
        Long,
        STRPTIME(Date, '%m/%d/%Y') AS Date,
        COALESCE(Confirmed, 0) as Confirmed
    FROM confirmed_province
),
confirmed_final AS (
    SELECT
        Province_State,
        Country_Region,
        Lat,
        Long,
        Date,
        CASE 
            WHEN Confirmed < Prev_1d THEN Confirmed 
            WHEN MAX(Confirmed - Prev_1d) < 0 THEN 0
            ELSE MAX(Confirmed - Prev_1d)
        END AS Confirmed
    FROM (
        SELECT *, 
            COALESCE(
                LAG(Confirmed) OVER (
                    PARTITION BY Country_Region, Province_State 
                    ORDER BY Date
                ), 0
            ) AS Prev_1d
        FROM base_confirmed
        WHERE Confirmed != 0
        AND Confirmed = (
            SELECT MAX(Confirmed)
            FROM base_confirmed b
            WHERE b.Country_Region = base_confirmed.Country_Region 
            AND b.Province_State = base_confirmed.Province_State
            AND b.Date = base_confirmed.Date
            AND b.Confirmed != 0
        )
    ) conf_province
    GROUP BY Province_State, Country_Region, Lat, Long, Date, Confirmed, Prev_1d
),

-- Deaths transformation
base_deaths AS (
    SELECT 
        Province_State,
        Country_Region,
        Lat,
        Long,
        STRPTIME(Date, '%m/%d/%Y') AS Date,
        COALESCE(Deaths, 0) as Deaths
    FROM deaths_province
),
deaths_final AS (
    SELECT
        Province_State,
        Country_Region,
        Lat,
        Long,
        Date,
        CASE 
            WHEN Deaths < Prev_1d THEN Deaths 
            WHEN MAX(Deaths - Prev_1d) < 0 THEN 0
            ELSE MAX(Deaths - Prev_1d)
        END AS Deaths
    FROM (
        SELECT *, 
            COALESCE(
                LAG(Deaths) OVER (
                    PARTITION BY Country_Region, Province_State
                    ORDER BY Date
                ), 0
            ) AS Prev_1d
        FROM base_deaths
        WHERE Deaths != 0
        AND Deaths = (
            SELECT MAX(Deaths)
            FROM base_deaths b
            WHERE b.Country_Region = base_deaths.Country_Region 
            AND b.Province_State = base_deaths.Province_State
            AND b.Date = base_deaths.Date
            AND b.Deaths != 0
        )
    ) deaths_province
    GROUP BY Province_State, Country_Region, Lat, Long, Date, Deaths, Prev_1d
),

base_recovered AS (
    SELECT 
        Province_State,
        Country_Region,
        Lat,
        Long,
        STRPTIME(Date, '%m/%d/%Y') AS Date,
        COALESCE(Recovered, 0) as Recovered
    FROM recovered_province
),
recovered_final AS (
    SELECT
        Province_State,
        Country_Region,
        Lat,
        Long,
        Date,
        CASE 
            WHEN (Recovered - Prev_1d) < 0 THEN 0  -- Handle negative differences
            ELSE (Recovered - Prev_1d)             -- Use positive differences
        END AS Recovered
    FROM (
        SELECT *, 
            COALESCE(
                LAG(Recovered, 1) OVER (
                    PARTITION BY Country_Region, Province_State
                    ORDER BY Date
                ), 0
            ) AS Prev_1d
        FROM base_recovered
        WHERE Recovered != 0
    ) recovered_province
    GROUP BY Province_State, Country_Region, Lat, Long, Date, Recovered, Prev_1d
)

-- Final merge of all tables
SELECT 
    c.Province_State,
    c.Country_Region,
    c.Lat,
    c.Long,
    c.Date,
CAST(EXTRACT(YEAR FROM c.Date) AS INT) as Year,
    MONTHNAME(c.Date) as Month,
    c.Confirmed,
    COALESCE(d.Deaths, 0) as Deaths,
    COALESCE(r.Recovered, 0) as Recovered
FROM confirmed_final c
LEFT JOIN deaths_final d 
    ON c.Country_Region = d.Country_Region 
    AND c.Province_State = d.Province_State
    AND c.Date = d.Date
LEFT JOIN recovered_final r 
    ON c.Country_Region = r.Country_Region 
    AND c.Province_State = r.Province_State
    AND c.Date = r.Date
ORDER BY c.Country_Region, c.Province_State, c.Date;`,
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
const provinceResult = predefinedDb.query(provinceCode);
display(Inputs.table(provinceResult));

// Display download buttons if we have results
if (provinceResult) {
  display(html`
    <div class="flex gap-6 mt-4">
      <button
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${provinceCode}`);
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
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${provinceCode}`);
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


## Vaccination Data
- vaccination_country
- vaccination_province

```js
// Create the textarea that updates based on the selected query
const vaccinationCountryCode = view(Inputs.textarea({
  value: `WITH 
-- Vaccination transformation
base_vaccination AS (
    SELECT 
        Country_Region,
        Lat,
        Long,
        Population,
        STRPTIME(Date, '%m/%d/%Y') AS Date,
        COALESCE(Vaccinations, 0) as Vaccinations
    FROM vaccination_country
),
vaccination_final AS (
    SELECT
        Country_Region,
        Lat,
        Long,
        Date,
        CASE 
            WHEN (Vaccinations - Prev_1d) < 0 THEN 0  
            ELSE (Vaccinations - Prev_1d)         
        END AS Vaccinations
    FROM ( 
        SELECT *, 
            COALESCE(
                LAG(Vaccinations, 1) OVER (  -- Explicitly use 1-day lag
                    PARTITION BY Country_Region 
                    ORDER BY Date
                ), 0
            ) AS Prev_1d
        FROM base_vaccination
        WHERE Vaccinations != 0
    ) vaccination_country
    GROUP BY Country_Region, Lat, Long, Population, Date, Vaccinations, Prev_1d
)

SELECT 
    Country_Region,
    Lat,
    Long,
    Date,
    CAST(EXTRACT(YEAR FROM Date) AS INT) as Year,
    MONTHNAME(Date) as Month,
    Vaccinations
FROM vaccination_final
ORDER BY Country_Region, Date;`,
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
const vaccinationCountryResult = predefinedDb.query(vaccinationCountryCode);
display(Inputs.table(vaccinationCountryResult));

// Display download buttons if we have results
if (vaccinationCountryResult) {
  display(html`
    <div class="flex gap-6 mt-4">
      <button
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        onclick=${async function() {
          this.disabled = true;
          const tmpTable = "query_result_" + (Math.random() * 1e16).toString(16);
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${vaccinationCountryCode}`);
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
          await predefinedDb.query(`CREATE TABLE ${tmpTable} AS ${vaccinationCountryCode}`);
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