---
theme: dashboard
index: true
title: IPO Calendar
toc: false
source: https://finnhub.io/docs/api/ipo-calendar
keywords: 
sql:
  ipo_calendar: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/ipo_calendar.parquet
---

# IPO Calendar

```js
import { datetime } from "../assets/components/datetime.js";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";

const db = await getDefaultClient();
const datasetname = "ipo_data";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## IPO Listings

```sql id=ipo display=false
FROM ipo_calendar
```

```js

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