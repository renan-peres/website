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
import { datetime } from "../assets/components/datetime.js";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../assets/components/tableFormatting.js";
import * as htl from "htl";

const datasetname = "ipo_data";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## IPO Listings

```js
// Import and prepare data
const ipo = await FileAttachment("../assets/loaders/rust/parquet/finnhub_ipo_calendar_api.parquet").parquet();

// Create table configuration
const tableConfig = getCustomTableFormat(ipo, {
  ...DEFAULT_CONFIG,
  datasetName: datasetname
});

const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

display(createCollapsibleSection(collapsibleContent, "Show Data", "show"));
```