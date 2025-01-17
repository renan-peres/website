---
title: Commodity Prices
theme: dashboard
index: true
toc: false
source: https://site.financialmodelingprep.com/developer/docs#forex-intraday | https://fiscaldata.treasury.gov/datasets/treasury-reporting-rates-exchange/treasury-reporting-rates-of-exchange
keywords: 
sql:
  commodity_data: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/commodity_list.parquet
---

```js
import { datetime } from "../../assets/components/datetime.js";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";

const db = await getDefaultClient();
const datasetname = "commodity_data";
```

# Commodity Prices

<div class="datetime-container">
  <div id="datetime"></div>
</div>

```sql id=commodityData display=false
SELECT 
-- * EXCLUDE(market_cap, eps, pe, earnings_announcement, shares_outstanding, timestamp, exchange)
  symbol,
  name,
	price,
  open,
  previous_close,
  change,
  changes_percentage as pct_change,
  day_low,
  day_high,
  year_high,
  year_low,
  price_avg_50,
  price_avg_200,
  volume,
  avg_volume,
FROM commodity_data
ORDER BY symbol
```

---

```js

const tableConfig = getCustomTableFormat(commodityData, {
  rows: 30,
  datasetName: datasetname
});

display(createCollapsibleSection(
  htl.html`
    ${tableConfig.container}
    ${Inputs.table(tableConfig.dataArray, tableConfig)}
  `, 
  "Show Data", 
  "show"
));
```