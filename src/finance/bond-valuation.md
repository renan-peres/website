---
theme: dashboard
index: true
title: Bond Valuation
toc: false
source: https://developer.finra.org/docs/api-explorer/query_api-fixed_income-agency_debt_market_breadth
keywords: 
---

# Bond Valuation

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Treasury Monthly Aggregates

```js 
// const hands = FileAttachment("./data/poker.json").json();
const finra = FileAttachment("./data/finra.csv").csv({typed: true});
```

```js
Inputs.table(finra, { rows: 30 })
```