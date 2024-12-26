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
import {datetime} from "../assets/components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Treasury Monthly Aggregates

```js 
// Import dependencies and prepare data
import { cleanColumnNames } from "../components/cleanColumnNames.js";
import {datetime} from "../assets/components/datetime.js";
import * as XLSX from "npm:xlsx";

// Load FINRA data
const finra = FileAttachment("../assets/loaders/rust/finra_api.csv").csv();

// Clean column names
const cleanedData = cleanColumnNames(finra, {
  case: 'lower',
  separator: '_',
  insertUnderscores: true,
  stripAccents: true
});

const datasetname = "finra_data";
```

```js
// Display buttons and table
display(html`
  ${Inputs.button(`Download ${datasetname}.xlsx`, {
    reduce() {
      const worksheet = XLSX.utils.json_to_sheet(cleanedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet);
      XLSX.writeFile(workbook, `${datasetname}.xlsx`);
    }
  })}
  
  ${Inputs.button(`Download ${datasetname}.csv`, {
    reduce() {
      const worksheet = XLSX.utils.json_to_sheet(cleanedData);
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${datasetname}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  })}
  
  ${Inputs.table(cleanedData, { rows: 30 })}
`);
```