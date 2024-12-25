---
theme: dashboard
index: true
title: Bond Valuation
toc: false
source: https://developer.finra.org/docs/api-explorer/query_api-fixed_income-agency_debt_market_breadth
keywords: 
sql:
  finra: ./data/finra.csv
---

# Bond Valuation

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Treasury Monthly Aggregates

```sql id=finra display=false
SELECT 
  strftime(beginningOfTheMonthDate, '%Y-%m-%d') AS 'Start the Month',
  productCategory AS 'Product Category',
  benchmark AS Benchmark,
  dealerCustomerVolume AS 'Dealer Customer Volume',
  dealerCustomerCount AS 'Dealer Customer Count',
  atsInterdealerVolume AS 'Inter Dealer Volumne',
  atsInterdealerCount AS 'Inter Dealer Count',
  yearsToMaturity AS 'YTM',
FROM finra
```

```js
Inputs.table(finra, { rows: 30 })
```