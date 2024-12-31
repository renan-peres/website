---
theme: dashboard
index: true
title: Bond Valuation
toc: false
source: https://developer.finra.org/docs/api-explorer/query_api-fixed_income-agency_debt_market_breadth
keywords: 
---

# Bond Valuation

```js
import { datetime } from "../assets/components/datetime.js";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../assets/components/tableFormatting.js";
import * as htl from "htl";

const datasetname = "finra_data";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Treasury Monthly Aggregates

```js
// Import and prepare data
const finra = await FileAttachment("../assets/loaders/rust/parquet/finra_api.parquet").parquet();

// Create table configuration
const tableConfig = getCustomTableFormat(finra, {
  ...DEFAULT_CONFIG,
  datasetName: datasetname
});

const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

display(createCollapsibleSection(collapsibleContent, "Show Data", "show"));
```