---
theme: dashboard
index: true
title: Bond Prices
toc: false
source: https://developer.finra.org/docs/api-explorer/query_api-fixed_income-agency_debt_market_breadth
keywords: 
sql:
  finra_treasury_bond_prices: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/treasury_bond_prices.parquet
---

# Bond Prices

```js
import { datetime } from "../../assets/components/datetime.js";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";

const db = await getDefaultClient();
const datasetname = "finra_data";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Treasury Monthly Aggregates

```sql id=finra display=false
FROM finra_treasury_bond_prices
```

```js

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