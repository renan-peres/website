---
theme: dashboard
index: false
source: https://pyodide.org/en/stable/usage/quickstart.html
keywords: Python, wasm
---

# Pyodide (Python WASM)

```js
import {datetime} from "../components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

<div id="countdown"></div>

```js
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs";

async function initializePyodide() {
  const countdownElement = document.getElementById('countdown');
  let secondsLeft = 5;
  
  const timer = setInterval(() => {
    if (secondsLeft > 0) {
      countdownElement.textContent = `Initializing Pyodide... ${secondsLeft}`;
      secondsLeft--;
    }
  }, 1000);

  try {
    let pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
    });
    clearInterval(timer);
    countdownElement.textContent = 'Loading packages...';
    
    // Load core packages
    await pyodide.loadPackage(["numpy", "pandas", "matplotlib", "scikit-learn"]);
    
    // Load micropip
    await pyodide.loadPackage("micropip");
    
    try {
      countdownElement.textContent = 'Installing polars...';
      
      // First load micropip
      await pyodide.loadPackage("micropip");
      const micropip = pyodide.pyimport("micropip");
      
      // Install polars
      console.log("Attempting to install polars...");
      await micropip.install('polars');
      
      // Test the installation
      const result = pyodide.runPython(`
        import polars as pl
        print(f"Successfully imported polars {pl.__version__}")
        
        # Create a test dataframe
        df = pl.DataFrame({
            "a": [1, 2, 3],
            "b": ["x", "y", "z"]
        })
        print(df)
      `);
      
      console.log('Polars installation completed');
      countdownElement.textContent = 'Ready!';
      
    } catch (error) {
      console.error('Installation error:', error);
      countdownElement.textContent = 'Ready (without polars)';
    }
    
    return pyodide;
  } catch (err) {
    clearInterval(timer);
    countdownElement.textContent = 'Initialization failed';
    console.error('Pyodide initialization error:', err);
    throw err;
  }
}

const pyodide = await initializePyodide();
```

---

## Chart with Input

```js
const n = view(Inputs.range([1, 1e3], {step: 5, label: "Number of samples", value: 500}));
```

```js
const plotCode = view(Inputs.textarea({
  value: `import numpy as np
import matplotlib.pyplot as plt

# Create figure with specific dimensions
plt.figure(figsize=(5, 3.75))  # 400px/300px at 80dpi
plt.hist(np.random.normal(size=${n}))
plt.title('Histogram of Normal Distribution')

# Save to base64 string
from io import BytesIO
import base64
buf = BytesIO()
plt.savefig(buf, format='png', dpi=80)
buf.seek(0)
img_str = base64.b64encode(buf.read()).decode('utf-8')
img_str`,
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
let plotResult = await pyodide.runPython(plotCode);
const canvas = d3.create("canvas").attr("width", 400).attr("height", 300).node();
const context = canvas.getContext("2d");
const image = new Image();
image.onload = () => context.drawImage(image, 0, 0, 400, 300);
image.src = `data:image/png;base64,${plotResult}`;
display(canvas);
```

## Code

```js
const pythonCode = view(Inputs.textarea({
  value: `import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# Create sample data
data = {
    'weight': np.random.uniform(2000, 4000, 50),
    'mpg': np.random.uniform(15, 30, 50)
}
df = pd.DataFrame(data)

# Fit linear model
X = df[['weight']]
y = df['mpg']
model = LinearRegression().fit(X, y)

result_str = f"""First 10 rows of data:
{df.head(10)}

Model Summary:
R² Score: {model.score(X, y):.4f}
Coefficient: {model.coef_[0]:.4f}
Intercept: {model.intercept_:.4f}"""

result_str`,
  width: "1200px",
  rows: 10,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
const result = await pyodide.runPython(pythonCode);
display(result);
```