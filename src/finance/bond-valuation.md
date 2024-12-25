---
theme: dashboard
index: true
title: Bond Valuation
toc: false
source: https://developer.finra.org/docs/api-explorer/query_api-fixed_income-agency_debt_market_breadth
keywords: 
---

# Bond Valuation

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Treasury Monthly Aggregates

```js 
// Import dependencies and prepare data
const finra = FileAttachment("./data/finra.csv").csv({typed: true});
import * as XLSX from "npm:xlsx";

const data = finra;
const datasetname = "treasury_aggregates";
```

```js
// Display table with download button
display(
  html`<div style="margin-bottom: 10px;">
    ${Inputs.button(`Download ${datasetname}.xlsx`, {
      reduce() {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet);
        XLSX.writeFile(workbook, `${datasetname}.xlsx`);
      }
    })}
  </div>
  ${Inputs.table(finra, { rows: 30 })}`
);
```