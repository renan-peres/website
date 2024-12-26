---
theme: dashboard
index: true
title: Stock Quotes
toc: false
source: https://finnhub.io/docs/api/quote
keywords: 
---

# Stock Quotes

```js
import {datetime} from "../assets/components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

```js 
// Import dependencies and prepare data
import * as XLSX from "npm:xlsx";
const datasetname = "stock_data";

// Function to format market cap
function formatMarketCap(value) {
  const num = Number(value);
  if (isNaN(num)) return value;
  
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)} T`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)} B`;
  } else {
    return num > 0 ? `${num}` : "";
  }
}

// Load the CSV file
const stock = await FileAttachment("../assets/loaders/rust/finnhub_stock_quotes_api.csv").csv();

// Define the columns you want to extract
const desiredColumns = [
  'company_name',
  'symbol',
  'current_price',
  'previous_close',
  'change',
  'percent_change',
  'market_cap',
  'industry',
  'website',
  'ipo_date',
  'exchange',
  // 'country',
  // 'currency',
  // 'high_price', 
  // 'low_price',
  // 'open_price',
];

// Filter and format the data
const data = stock
  .map(row => {
    const filteredRow = {};
    desiredColumns.forEach(column => {
      if (column === 'percent_change') {
        // Store original value for sorting but display formatted value
        filteredRow[column] = `${Number(row[column]).toFixed(2)}%`;
        filteredRow['_percent_change_sort'] = Number(row[column]); // Hidden field for sorting
      } else if (column === 'market_cap') {
        // Extract the numeric part of the market cap
        const numericPart = parseFloat(row[column].replace(/[$\s]/g, ''));
        filteredRow[column] = row[column];
        filteredRow['_market_cap_sort'] = isNaN(numericPart) ? 0 : numericPart;
      } else {
        filteredRow[column] = row[column];
      }
    });
    return filteredRow;
  })
  // Sort by percent_change (highest to lowest)
  .sort((a, b) => b._percent_change_sort - a._percent_change_sort)
  // Remove the sorting fields from final output
  .map(({ _percent_change_sort, _market_cap_sort, ...rest }) => rest);
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
  ${Inputs.table(data, {
    rows: 30,
    format: {
      website: (x) => x ? htl.html`<a href="${/^https?:\/\//.test(x) ? x : 'https://' + x}" target="_blank">${x}</a>` : '',
      market_cap: formatMarketCap
    }
  })}
`);
```