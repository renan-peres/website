---

theme: dashboard
index: true
keywords: Python, wasm
---

# Pyodide

```js
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.mjs";

const pyodide = await loadPyodide();
await pyodide.loadPackage(["numpy", "pandas"]);
```

```js
const pythonCode = view(Inputs.textarea({
 value: `import pandas as pd
import numpy as np

# Create sample data
df = pd.DataFrame({
   'Name': np.random.choice(['John', 'Anna', 'Peter', 'Linda', 'James'], 10),
   'Age': np.random.randint(20, 60, 10),
   'Score': np.random.rand(10) * 100
})

df`,
 label: "Python code",
 width: 800,
 minHeight: 600,
 onKeyDown: e => {
   if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
 }
}));
```

```js
const result = await pyodide.runPython(pythonCode);
display(result.toString());
```
