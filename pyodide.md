---
index: true
keywords: Python, wasm
---

# Pyodide

```js
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.mjs";
```

```js
html`
<div style="font-family: system-ui; padding: 20px;">
  <p>You can execute any Python code. Just enter something in the box below and click the button.</p>
  <input id="code" value="sum([1, 2, 3, 4, 5])" style="width: 300px; margin-right: 10px; padding: 5px;" />
  <button id="runButton" style="padding: 5px 10px;">Run</button>
  <br />
  <br />
  <div>Output:</div>
  <textarea id="output" style="width: 100%; min-height: 150px; margin-top: 10px;" disabled></textarea>
</div>
`
```

```js
// Initialize Pyodide and set up event handlers
{
  const output = document.getElementById("output");
  const code = document.getElementById("code");
  const runButton = document.getElementById("runButton");

  function addToOutput(s) {
    output.value += ">>>" + code.value + "\n" + s + "\n";
  }

  output.value = "Initializing...\n";

  // Initialize Pyodide
  const pyodideReadyPromise = (async () => {
    const pyodide = await loadPyodide();
    output.value += "Ready!\n";
    return pyodide;
  })();

  // Add click handler
  runButton.addEventListener("click", async () => {
    const pyodide = await pyodideReadyPromise;
    try {
      const result = pyodide.runPython(code.value);
      addToOutput(result);
    } catch (err) {
      addToOutput(err);
    }
  });
}
```
