---
theme: dashboard
index: true
title: Foreign Exchange Rates
toc: false
source: https://fiscaldata.treasury.gov/datasets/treasury-reporting-rates-exchange/treasury-reporting-rates-of-exchange
keywords: 
---

# Foreign Exchange Rates

```js
import { datetime } from "../assets/components/datetime.js";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../assets/components/tableFormatting.js";
import * as htl from "htl";

const datasetname = "forex_data";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Quarterly Report

```js
const forex = await FileAttachment("../assets/loaders/rust/parquet/fiscaldata_forex_api.parquet").parquet();

// Define the columns you want to extract
const desiredColumns = [
  "country",
  "currency",
  "effective_date",
  "record_date",
  "exchange_rate",
];

// Get selected columns table first
const selectedTable = forex.select(desiredColumns);

// Convert to array of objects
const selected_data = Array.from(selectedTable).map((row, index) => {
  const obj = {};
  desiredColumns.forEach(col => {
    obj[col] = selectedTable.getChild(col).get(index);
  });
  return obj;
});

// Get unique countries, sort them, and add "All" as first option
const countries = ["All", ...[...new Set(selected_data.map(d => d.country))].sort()];

// Create the country select input and store its value
const selectedCountry = view(Inputs.select(countries, {
  label: "Filter by Country:",
  value: "All" // Set default value to "All"
}));
```

```js
// Create filtered data based on country selection
const filteredData = selectedCountry === "All" 
  ? selected_data 
  : selected_data.filter(d => d.country === selectedCountry);

const tableConfig = getCustomTableFormat(filteredData, {
  ...DEFAULT_CONFIG,
  datasetName: datasetname
});

const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

display(createCollapsibleSection(collapsibleContent, "Show Data", "show"));
```