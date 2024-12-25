---
theme: dashboard
index: true
title: Foreing Exchange Rates
toc: false
source: https://fiscaldata.treasury.gov/datasets/treasury-reporting-rates-exchange/treasury-reporting-rates-of-exchange
keywords: 
---

# Foreign Exhchange Rates

```js
import {datetime} from "../assets/components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Quartely Reports

```js 
// Import dependencies and prepare data
import * as XLSX from "npm:xlsx";
const datasetname = "forex_data";

// Load the CSV file and process it
const forex = await FileAttachment("../assets/loaders/rust/fiscaldata_forex_api.csv").csv();

// Define the columns you want to extract
const desiredColumns = [
  "country",
  "country_currency_desc",
  "currency",
  "effective_date",
  "record_date",
  "exchange_rate",
];

// Filter the data to include only the desired columns
const data = forex.map(row => {
  const filteredRow = {};
  desiredColumns.forEach(column => {
    filteredRow[column] = row[column];
  });
  return filteredRow;
});
```

```js
// Display buttons and table
display(html`
  <div style="display: flex; margin-bottom: 10px;">
    ${Inputs.button(`Download ${datasetname}.xlsx`, {
      reduce() {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet);
        XLSX.writeFile(workbook, `${datasetname}.xlsx`);
      }
    })}
    ${Inputs.button(`Download ${datasetname}.csv`, {
      reduce() {
        const worksheet = XLSX.utils.json_to_sheet(data);
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
  </div>
  ${Inputs.table(data, { rows: 30 })}
`);
```

