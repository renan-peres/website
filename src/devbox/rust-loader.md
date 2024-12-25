---
theme: dashboard
index: true
title: Rust Loader
toc: false
source: https://observablehq.observablehq.cloud/framework-example-loader-rust-to-json/
keywords: 
sql:
    hands: ./data/poker.csv
---

# Rust Loader

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

```js 
const hands = FileAttachment("./data/poker.json").json();
```

```js
Inputs.table(hands.summary)
```

```sql
SELECT *
FROM hands
```