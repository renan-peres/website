---
title: Financial Statements
theme: dashboard
index: true
toc: false
source: 
keywords: 
sql:
  income_statement: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/company_income_statement.parquet
  balance_sheet: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/company_balance_sheet.parquet
  cashflow_statement: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/company_cash_flow_statement.parquet
---

```html
<style>
h1, h2, h3, h4, h5, h6, p, li, ul, ol {
  width: 100% !important;
  max-width: none !important;
  margin-right: 0 !important;
  padding-right: 0 !important;
}
</style>
```

# Financial Statements

```js
import {datetime} from "../../assets/components/datetime.js";
import * as vgplot from "npm:@uwdata/vgplot";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import { DEFAULT_CONFIG, getCustomTableFormat, createCollapsibleSection } from "../../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";
const db = await getDefaultClient();
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## <u>Reports Available</u>

```js
// Get tables
const tables = await db.sql`
  SELECT name AS table_name
  FROM (SHOW ALL TABLES)
  WHERE schema = 'main'
  ORDER BY
    CASE 
      WHEN name = 'income_statement' THEN 1
      WHEN name = 'balance_sheet' THEN 2
      WHEN name = 'cashflow_statement' THEN 3
    END
  ASC;
`;

// Extract table names from the SQL result
const tableNames = Array.from(tables, row => row.table_name);

// Create the select input and store its value
const selectedTable = view(Inputs.select(tables, {
  label: "Select Report:",
  format: d => d.table_name
}));
```

```js
// For your query display block
const result = await db.query(`SELECT * FROM ${selectedTable.table_name}`);

// Get the configuration and buttons
const tableConfig = getCustomTableFormat(result, {
  ...DEFAULT_CONFIG,
  datasetName: `${selectedTable.table_name}`
});

// Create collapsible content
const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

// Display the collapsible section
// display(createCollapsibleSection(collapsibleContent, "Show Data", "collapsed"));
display(createCollapsibleSection(collapsibleContent, "Show Data", "show"));
```

---

## <u>Full Report</u>

```js

// Get Symbol
const company = await db.query(`SELECT * FROM ${selectedTable.table_name} ORDER BY symbol ASC;`);

// Create the select input and store its value
const companyNames = view(Inputs.select(company, {
  label: "Select Company:",
  format: d => d.symbol
}));
```

```js
// Get Report Link
const report = await db.query(`SELECT final_link FROM ${selectedTable.table_name} WHERE symbol = '${companyNames.symbol}';`);
const link = report.toArray()[0].final_link;  // Access final_link column from first row

const anchor = document.createElement('a');
anchor.href = link;
// anchor.textContent = 'View Report';
anchor.textContent = link;  // Set text content to the link
anchor.target = '_blank';  // Open link in a new tab

display(anchor);
```

<!-- Embed Report as Iframe -->

```js
// const financial_report = html`
//   <div>
//     <button 
//       style="margin-bottom: 10px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
//       onclick=${(e) => {
//         const iframe = e.target.parentElement.querySelector('iframe');
//         if (iframe.requestFullscreen) {
//           iframe.requestFullscreen();
//         } else if (iframe.webkitRequestFullscreen) {
//           iframe.webkitRequestFullscreen();
//         } else if (iframe.msRequestFullscreen) {
//           iframe.msRequestFullscreen();
//         }
//       }}>
//       Fullscreen
//     </button>
//     <div style="width: 100%; height: 800px; position: relative;">
//     <iframe height="100%" width="100%" 
//         id="financial_report-embed" 
//         title="financial_report Embed"
//         src=${link}
//         frameborder="0" allow="clipboard-write" allowfullscreen></iframe>
//     </div>
//   </div>
// `;

// display(financial_report);
```
