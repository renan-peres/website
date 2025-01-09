---
theme: dashboard
index: true
toc: false
source: https://fred.stlouisfed.org/
keywords: macro economics indicators unemployment gdp inflation exchange rate
sql:
  fred_data: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/fred_macro_economy.parquet
  unemployment: ../../assets/data/unemployment-by-county.csv
---

```js
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { datetime } from "../../assets/components/datetime.js";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";
const url = import.meta.resolve("npm:us-atlas@3/counties-10m.json");
const db = await getDefaultClient();

const secrets = await FileAttachment("../../assets/loaders/secrets.json").json();
const FINNHUB_API_KEY = secrets.FINNHUB_API_KEY;
```

# Macro Indicators

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Latest Economic Data

```sql id=economicData_mostRecent
WITH ranked_data AS (
    SELECT *,
        ROW_NUMBER() OVER (PARTITION BY series_id ORDER BY date DESC) AS rn
    FROM fred_data
)

SELECT 
    date,
    series_id,
    series_description,
    value
FROM ranked_data
WHERE rn = 1
ORDER BY date DESC;
```

```js
const tableConfig = getCustomTableFormat(economicData_mostRecent, {
  ...DEFAULT_CONFIG,
  datasetName: 'economic_data'
});

const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

display(createCollapsibleSection(collapsibleContent, "Show Data", "hide"));
```

```js
function formatTableData(data) {
  // Create a mapping of series_id to friendly names
  const seriesMapping = {
    'UNRATE': 'unemployment',
    'GDP': 'gdp',
    'FPCPITOTLZGUSA': 'inflation',
    'DFF': 'fedRate',
    'DEXUSEU': 'exchangeRate'
  };

  // Initialize metrics object
  const metrics = {};
  
  // Convert SQL results to metrics object
  const rows = data.toArray();
  rows.forEach(row => {
    const metricName = seriesMapping[row.series_id];
    if (metricName) {
      metrics[metricName] = {
        value: row.value,
        date: new Date(row.date).toLocaleDateString(),
        format: (val) => {
          switch(metricName) {
            case 'gdp':
              return `$${Number(val).toLocaleString()} T`;
            case 'exchangeRate':
              return Number(val).toFixed(2);
            default:
              return `${Number(val).toFixed(1)}%`;
          }
        }
      };
    }
  });
  
  return metrics;
}

const metrics = formatTableData(economicData_mostRecent);
```

<div class="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
    <div class="card bg-gray-800 p-4 rounded-lg">
        <h2 class="text-gray-400">Unemployment Rate</h2>
        <div class="big text-xl font-bold my-2">
            ${metrics.unemployment?.format(metrics.unemployment?.value) || 'N/A'}
        </div>
        <div class="small text-gray-500">${metrics.unemployment?.date || ''}</div>
    </div>
    <div class="card bg-gray-800 p-4 rounded-lg">
        <h2 class="text-gray-400">GDP</h2>
        <div class="big text-xl font-bold my-2">
            ${metrics.gdp?.format(metrics.gdp?.value) || 'N/A'}
        </div>
        <div class="small text-gray-500">${metrics.gdp?.date || ''}</div>
    </div>
    <div class="card bg-gray-800 p-4 rounded-lg">
        <h2 class="text-gray-400">Inflation Rate</h2>
        <div class="big text-xl font-bold my-2">
            ${metrics.inflation?.format(metrics.inflation?.value) || 'N/A'}
        </div>
        <div class="small text-gray-500">${metrics.inflation?.date || ''}</div>
    </div>
    <div class="card bg-gray-800 p-4 rounded-lg">
        <h2 class="text-gray-400">Fed Funds Rate</h2>
        <div class="big text-xl font-bold my-2">
            ${metrics.fedRate?.format(metrics.fedRate?.value) || 'N/A'}
        </div>
        <div class="small text-gray-500">${metrics.fedRate?.date || ''}</div>
    </div>
    <div class="card bg-gray-800 p-4 rounded-lg">
        <h2 class="text-gray-400">USD/EUR Rate</h2>
        <div class="big text-xl font-bold my-2">
            ${metrics.exchangeRate?.format(metrics.exchangeRate?.value) || 'N/A'}
        </div>
        <div class="small text-gray-500">${metrics.exchangeRate?.date || ''}</div>
    </div>
</div>

---

## Historical Data

```sql id=economicData_historical
FROM fred_data
ORDER BY date DESC;
```

```js
const tableConfig = getCustomTableFormat(economicData_historical, {
  ...DEFAULT_CONFIG,
  datasetName: 'historical_economic_data'
});

const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

display(createCollapsibleSection(collapsibleContent, "Show Data", "hide"));
```

```js
const data = Array.from(await economicData_historical);

// const series_id = ["All", ...new Set(data.map(d => d.series_id))].sort();
const series_id = [...new Set(data.map(d => d.series_id))].sort();
const selected = view(Inputs.select(series_id, {
  label: "Filter by Series:",
  value: "GDP"
}));
```

```js
const parse  = d3.timeParse('%Y-%m-%d');
const format = d3.timeFormat("%b '%y");

const chart = 
Plot.plot({
  width: window.innerWidth - 100,
  height: 600,
  marginLeft: 80,
  y: {
    grid: true,
    nice: true,
    filter: (d) => !isNaN(d.value),
    type: "linear",
    tickFormat: d => d3.format(",.0f")(d)
  },
  marks: [
    Plot.axisY({
      label: "Value",
      // label: null
      labelOffset: 40
    }),
    Plot.axisX({
      round: true, 
      label: "Date", 
      tickFormat: ymd => format(parse(ymd))
      // tickFormat: d => d3.timeFormat("%b '%y")(new Date(d))
    }),
    Plot.line(await sql`
      SELECT *
      FROM fred_data
      WHERE series_id = ${selected};
    `, {
      x: "date", 
      y: "value", 
      tip: true,
      stroke: "steelblue",
      sort: {y: "x", reverse: true}
    })
  ]
});

// display(chart);
```
<div class="grid grid-cols-1 gap-4 mt-4 mb-0">
  <div class="card bg-gray-800 p-4 rounded-lg col-span-full">
    <h2 class="text-gray-400">Economic Indicator</h2>
    <div class="mt-4" style="min-height: 400px;">
      ${display(chart)}
    </div>
  </div>
</div>

---

## Unemployement by County

```sql id=[counties]
CREATE OR REPLACE TABLE counties AS FROM ST_Read(${url});
```

```sql id=rates 
WITH dependencies AS (SELECT ${counties, 1})
SELECT ST_AsGeoJSON(geom) AS "geom"
     , counties."id"
     , "rate"
     , "state"
     , "county"
  FROM counties
  LEFT JOIN unemployment
    ON counties.id = unemployment.id
```

```js
const tableConfig = getCustomTableFormat(rates, {
  ...DEFAULT_CONFIG,
  datasetName: 'county_unemployment_data'
});

const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

display(createCollapsibleSection(collapsibleContent, "Show Data", "hide"));
```

```js
const unemployment_chart = Plot.plot({
  projection: "albers-usa",
  color: {type: "quantize", n: 9, domain: [1, 10], scheme: "blues", label: "Unemployment rate (%)", legend: true},
  marks: [
    Plot.geo(rates, {
      geometry: ({geom}) => JSON.parse(geom),
      fill: "rate",
      tip: {channels: {id: "id", state: "state", county: "county"}}
    })
  ]
});
```

```js
unemployment_chart
```