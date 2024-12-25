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
import {datetime} from "../components/datetime.js";
const finra = FileAttachment("./data/finra.csv").csv({typed: true});

// Initialize DuckDB with your finra table
const predefinedDb = DuckDBClient.of({
  finra
});
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Treasury Monthly Aggregates

<!-- ```js
Inputs.table(finra)
``` -->

```js
// Create the SQL query string based on selected table
const code = `
SELECT 
  beginningOfTheMonthDate AS 'Start the Month',
  productCategory AS 'Product Category',
  benchmark AS Benchmark,
  dealerCustomerVolume AS 'Dealer Customer Volume',
  dealerCustomerCount AS 'Dealer Customer Count',
  atsInterdealerVolume AS 'Inter Dealer Volumne',
  atsInterdealerCount AS 'Inter Dealer Count',
  yearsToMaturity AS 'YTM',
FROM finra

`;

const queryResult = predefinedDb.query(code);
display(Inputs.table(queryResult));
```
