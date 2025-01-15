---
theme: dashboard
index: false
source: https://pyodide.org/en/stable/usage/quickstart.html
keywords: Python, wasm
---


```html
<style>
.observablehq textarea,
.observablehq-input textarea,
.sql-editor {
  min-height: 50px !important;
  max-height: 1000px !important;
  width: 100% !important;
  max-width: none !important;
  margin-right: 0 !important;
  padding-right: 0 !important;
}

/* Header and container fixes */
.observablehq article {
  max-width: none !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.observablehq-markdown {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
}

h1, h2, h3, h4, h5, h6, p, li, ul, ol {
  width: 100% !important;
  max-width: none !important;
  margin-right: 0 !important;
  padding-right: 0 !important;
}

</style>
```

```js
import {datetime} from "../../../assets/components/datetime.js";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../../../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";
import { py, loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.mjs";

async function initializePyodide() {
  const countdownElement = document.getElementById('countdown');
  
  try {
    countdownElement.textContent = 'Initializing Pyodide...';
    
    let pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/"
    });
    
    countdownElement.textContent = 'Loading packages...';
    
    // Load core packages
    await pyodide.loadPackage(["micropip", "pyodide.http", "pyarrow", "requests", "numpy", "polars", "matplotlib"]);
    
    countdownElement.textContent = 'Ready!';
    return pyodide;
    
  } catch (err) {
    countdownElement.textContent = 'Initialization failed';
    console.error('Pyodide initialization error:', err);
    throw err;
  }
}

const pyodide = await initializePyodide();
```

# Pyodide (Python WASM)

<div class="datetime-container">
  <div id="datetime"></div>
</div>

<div id="countdown"></div>

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
  width: "100%",
  rows: 16,
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

---

## Read Data (CSV)

```js
const pythonCode2 = view(Inputs.textarea({
  value: `import requests
import json
import polars as pl

# Fetch CSV data
r = requests.get("https://raw.githubusercontent.com/pola-rs/polars/main/examples/datasets/foods1.csv")
df = pl.read_csv(r.content)
# str(df.head(10))

# Convert to list of dictionaries and serialize
json.dumps(df.head(10).to_dicts())`,
  width: "100%",
  rows: 11,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
// Run the Python code in Pyodide
const result = await pyodide.runPython(pythonCode2);
const tableData2 = JSON.parse(result);

const tableConfig = getCustomTableFormat(tableData2, {
  ...DEFAULT_CONFIG,
  datasetName: 'results'
});

const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

display(createCollapsibleSection(collapsibleContent, "Show Data", "show"));
```

---

## Read Data (Parquet)

```js
const pythonCode4 = view(Inputs.textarea({
  value: `import io
import requests
import json

import polars as pl
import pyarrow.parquet as pq

def read_parquet(url):
    try:
        response = requests.get(url)
        buffer = io.BytesIO(response.content)
        table = pq.read_table(buffer)
        return pl.from_arrow(table)
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

# Execute
url = "https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/historical_ma_transactions.parquet"
df = read_parquet(url)
# str(df.head(10))

# Convert to list of dictionaries and serialize
json.dumps(df.to_dicts())`,
  width: "100%",
  rows: 24,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
// Run the Python code in Pyodide
const result2 = await pyodide.runPython(pythonCode4);
const tableData2 = JSON.parse(result2);

const tableConfig = getCustomTableFormat(tableData2, {
  ...DEFAULT_CONFIG,
  datasetName: 'results'
});

const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

display(createCollapsibleSection(collapsibleContent, "Show Data", "show"));
```

---

## Linear Model

```js
const pythonCode = view(Inputs.textarea({
  value: `import polars as pl
import pandas as pd
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
  width: "100%",
  rows: 25,
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

---

## Time Series Analysis

```js
const pythonCode3 = view(Inputs.textarea({
  value: `import polars as pl
import numpy as np
from datetime import datetime, timedelta

# Create sample time series data
def create_sample_data(n_periods=100):
    dates = [datetime.now() - timedelta(days=x) for x in range(n_periods)]
    np.random.seed(42)
    values = np.random.normal(100, 10, n_periods) + np.sin(np.arange(n_periods) * 0.1) * 20
    
    df = pl.DataFrame({
        'date': dates,
        'value': values
    }).sort('date')
    
    return df

# Time series analysis functions
def analyze_time_series(df, value_col='value', date_col='date'):
    """Comprehensive time series analysis using Polars"""
    
    # 1. Basic statistics over time
    stats = df.select([
        pl.col(value_col).mean().alias('mean'),
        pl.col(value_col).std().alias('std'),
        pl.col(value_col).min().alias('min'),
        pl.col(value_col).max().alias('max'),
    ])
    
    # 2. Rolling statistics
    df_with_rolling = df.with_columns([
        pl.col(value_col).rolling_mean(window_size=7).alias('rolling_mean_7d'),
        pl.col(value_col).rolling_std(window_size=7).alias('rolling_std_7d'),
    ])
    
    # 3. Year-over-year growth
    df_with_yoy = df.with_columns([
        pl.col(value_col).shift(365).alias('value_year_ago'),
        ((pl.col(value_col) - pl.col(value_col).shift(365)) / pl.col(value_col).shift(365) * 100).alias('yoy_growth')
    ])
    
    # 4. Seasonality detection (using month)
    seasonal = df.with_columns([
        pl.col(date_col).dt.month().alias('month')
    ]).group_by('month').agg([
        pl.col(value_col).mean().alias('monthly_avg'),
        pl.col(value_col).std().alias('monthly_std')
    ])
    
    # 5. Simple exponential smoothing
    alpha = 0.1
    df_with_ema = df.with_columns([
        pl.col(value_col).ewm_mean(alpha=alpha).alias('exp_smoothing')
    ])
    
    return {
        'basic_stats': stats,
        'rolling_stats': df_with_rolling,
        'yoy_growth': df_with_yoy,
        'seasonality': seasonal,
        'smoothed': df_with_ema
    }

# Function to detect anomalies using Z-score method
def detect_anomalies(df, value_col='value', threshold=3):
    """Detect anomalies using Z-score method"""
    mean = df[value_col].mean()
    std = df[value_col].std()
    
    return df.with_columns(
        is_anomaly=((pl.col(value_col) - mean) / std).abs() > threshold
    )

# Function to create forecasts using simple methods
def simple_forecast(df, value_col='value', periods=7):
    """Create simple forecasts using various methods"""
    # Last value + trend
    last_n = 30
    recent_trend = (df[value_col][-1] - df[value_col][-last_n]) / last_n
    
    forecast_dates = [
        df['date'][-1] + timedelta(days=x+1) 
        for x in range(periods)
    ]
    
    naive_forecast = df[value_col][-1] + recent_trend * np.arange(1, periods + 1)
    
    forecast_df = pl.DataFrame({
        'date': forecast_dates,
        'forecast_value': naive_forecast
    })
    
    return forecast_df


# Create sample data
df = create_sample_data(365)

# Perform analysis
analysis = analyze_time_series(df)

# Detect anomalies
df_with_anomalies = detect_anomalies(df)

# Create forecast
forecast = simple_forecast(df)

# Print some results
output = ""
output += str("Data:\\n")
output += str(df)

output += str("\\nBasic Statistics:\\n")
output += str(analysis['basic_stats'])

output += str("\\nSeasonality Analysis:\\n")
output += str(analysis['seasonality'])
 
output += str("\\nForecast for next 7 days:\\n")
output += str(forecast)

str(output)`,
  width: "100%",
  rows: 40,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
// Run the Python code in Pyodide
const displayPythonCode3 = await pyodide.runPython(pythonCode3);
display(displayPythonCode3);
```