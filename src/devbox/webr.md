---
theme: dashboard
index: false
keywords: R, wasm
---

# WebR (R WASM)
```js
import {datetime} from "../components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

<div id="countdown"></div>

```js
async function initializeWebR() {
  const countdownElement = document.getElementById('countdown');
  let secondsLeft = 5;
  
  const timer = setInterval(() => {
    if (secondsLeft > 0) {
      countdownElement.textContent = `Initializing WebR... ${secondsLeft}`;
      secondsLeft--;
    }
  }, 1000);

  try {
    const webR = new (await import("https://webr.r-wasm.org/latest/webr.mjs")).WebR();
    clearInterval(timer);
    countdownElement.textContent = 'Starting WebR...';
    
    await webR.init();
    countdownElement.textContent = 'Ready!';
    return webR;
  } catch (err) {
    clearInterval(timer);
    countdownElement.textContent = 'Initialization failed';
    throw err;
  }
}

const webR = await initializeWebR();
```
---

## Chart with Input

```js
const n = view(Inputs.range([1, 1e3], {step: 5, label: "Number of samples"}));
```

```js
const Rcode = view(Inputs.textarea({
  value: "hist(rnorm(n))", 
  width: "1200px",
  rows: 2,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
const res = await webR.globalShelter.captureR(Rcode, {env: {n}});
const image = res.images[0];
const canvas = d3.create("canvas").attr("width", 400).attr("height", 300).node();
const context = canvas.getContext("2d");
context.drawImage(image, 0, 0, 400, 300);
display(canvas);
```

## Code

```js
const code = view(Inputs.textarea({
  value: `df = mtcars
model <- lm(mpg ~ wt, data = df)

print(df |> head(10))
print(summary(model))
`,
  width: "1200px",
  rows: 8,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
const lmResult = await webR.globalShelter.captureR(code);
display(lmResult.output.map(o => o.data).join('\n'));
```