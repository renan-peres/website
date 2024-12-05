---
theme: dashboard
index: true
keywords: R, wasm
---

# WebR

```js
const webR = new (await import("https://webr.r-wasm.org/latest/webr.mjs")).WebR();
await webR.init();
```

```js
const n = view(Inputs.range([1, 1e3], {step: 5, label: "Number of samples"}));
```

```js
const Rcode = view(Inputs.textarea({value: "hist(rnorm(n))", label: "R code", onKeyDown: e => {
  if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
}}));
```

```js
const res = await webR.globalShelter.captureR(Rcode, {env: {n}});
const image = res.images[0];
const canvas = d3.create("canvas").attr("width", 400).attr("height", 300).node();
const context = canvas.getContext("2d");
context.drawImage(image, 0, 0, 400, 300);
display(canvas);
```

# Linear Regression Analysis

```js
const lmCode = view(Inputs.textarea({
  value: `model <- lm(mpg ~ wt, data = mtcars)
print(summary(model))`,
  label: "R code",
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

<!-- ```js
const runButton = view(Inputs.button("Run Code"));
``` -->

```js
const lmResult = await webR.globalShelter.captureR(lmCode);
display(lmResult.output.map(o => o.data).join('\n'));
```