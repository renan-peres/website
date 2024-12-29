---
theme: dashboard
index: true
title: IPO Calendar
toc: false
source: https://finnhub.io/docs/api/ipo-calendar
keywords: 
---

# IPO Calendar

```js
import {datetime} from "../assets/components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

```js 
// Import dependencies and prepare data
const ipo = FileAttachment("../assets/loaders/rust/finnhub_ipo_calendar_api.csv").csv();
import * as XLSX from "npm:xlsx";

const data = ipo;
const datasetname = "ipo_data";
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