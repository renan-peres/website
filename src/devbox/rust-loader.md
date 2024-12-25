---
theme: dashboard
index: true
title: Rust Loader
toc: false
source: https://observablehq.observablehq.cloud/framework-example-loader-rust-to-json/
keywords: 
---

# Rust Loader

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

```js 
// const hands = FileAttachment("./data/poker.json").json();
const hands = FileAttachment("../assets/loaders/rust/poker.csv").csv({typed: true});
```

```js
Inputs.table(hands)
```