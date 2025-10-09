---
theme: dashboard
index: true
title: Foreign Exchange Rates
toc: false
source: https://site.financialmodelingprep.com/developer/docs#forex-intraday | https://fiscaldata.treasury.gov/datasets/treasury-reporting-rates-exchange/treasury-reporting-rates-of-exchange
keywords: 
sql:
  forex_data: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/historical_fx_quotes.parquet
---

# Foreign Exchange Rates

```js
import { datetime } from "../../assets/components/datetime.js";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";

const db = await getDefaultClient();
const datasetname = "forex_data";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

```sql id=forexData display=false
SELECT * EXCLUDE(volume) FROM forex_data;
```

```js
// Get forex data and transform to array
const data = Array.from(await forexData);

// Create pairs array with "All" option
const pairs = ["All", ...new Set(data.map(d => d.pair))].sort();

// Create select input
const selectedPair = view(Inputs.select(pairs, {
  label: "Filter by Pair:",
  value: "All"
}));
```

---

```js
// Filter and display data
const filteredData = selectedPair === "All" 
  ? data 
  : data.filter(d => d.pair === selectedPair);

const tableConfig = getCustomTableFormat(filteredData, {
  ...DEFAULT_CONFIG,
  datasetName: datasetname
});

display(createCollapsibleSection(
  htl.html`
    ${tableConfig.container}
    ${Inputs.table(tableConfig.dataArray, tableConfig)}
  `, 
  "Show Data", 
  "show"
));
```