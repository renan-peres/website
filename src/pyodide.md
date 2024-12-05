---
index: true
keywords: Python, wasm
---

# Pyodide Playground

```js
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.mjs";

// Initialize Pyodide and load micropip
let pyodide = await loadPyodide();
await pyodide.loadPackage("micropip");
const micropip = pyodide.pyimport("micropip");

// Function to convert DataFrame to HTML table
async function displayDataFrame(df) {
  const html = await pyodide.runPython(`
    df = ${df}
    df.to_html(classes='dataframe-table', index=True)
  `);
  return html;
}

// Function to check and install required packages
async function ensurePackages(code) {
  // Regular expression to find import statements
  const importRegex = /^(?:from|import)\s+([a-zA-Z0-9_]+)/gm;
  const matches = [...code.matchAll(importRegex)];
  const packages = new Set();
  
  for (const match of matches) {
    const packageName = match[1].toLowerCase();
    // Skip built-in modules
    if (!['sys', 'os', 'math', 'random', 'datetime', 'collections'].includes(packageName)) {
      packages.add(packageName);
    }
  }

  for (const pkg of packages) {
    try {
      // Check if package is already imported
      await pyodide.runPython(`import ${pkg}`);
    } catch (e) {
      try {
        // Try to install package using micropip
        await micropip.install(pkg);
      } catch (installError) {
        throw new Error(`Failed to install package: ${pkg}`);
      }
    }
  }
}
```

```js
html`
<style>
  .dataframe-table {
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 14px;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }
  .dataframe-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
  }
  .dataframe-table th,
  .dataframe-table td {
    padding: 12px 15px;
    border: 1px solid #ddd;
  }
  .dataframe-table tbody tr {
    border-bottom: 1px solid #dddddd;
  }
  .dataframe-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }
  .dataframe-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }
  #output-container {
    overflow: auto;
    max-height: 500px;
  }
</style>
<div style="font-family: system-ui; padding: 20px;">
  <p>You can execute any Python code with package support. Enter your code below and click Run.</p>
  <textarea 
    id="code" 
    style="width: 100%; min-height: 100px; margin-right: 10px; padding: 10px; font-family: monospace;"
  >import pandas as pd
import numpy as np

# Create sample data
df = pd.DataFrame({
    'Name': ['John', 'Anna', 'Peter', 'Linda'],
    'Age': [28, 22, 35, 32],
    'Score': np.random.rand(4)*100
})

# Display the DataFrame
df</textarea>
  <br />
  <br />
  <button id="runButton" style="padding: 5px 10px;">Run</button>
  <button id="clearButton" style="padding: 5px 10px; margin-left: 10px;">Clear</button>
  <div id="packageStatus" style="margin-top: 10px; color: blue;"></div>
  <div id="error-container" style="color: red; margin-top: 10px; display: none;"></div>
  <br />
  <div>Output:</div>
  <div id="output-container"></div>
  <textarea id="output" style="width: 100%; min-height: 150px; margin-top: 10px; margin-right: 10px; font-family: monospace;" readonly></textarea>
</div>
`
```

```js
// Initialize the UI and event handlers
{
  const output = document.getElementById("output");
  const outputContainer = document.getElementById("output-container");
  const code = document.getElementById("code");
  const runButton = document.getElementById("runButton");
  const clearButton = document.getElementById("clearButton");
  const errorContainer = document.getElementById("error-container");
  const packageStatus = document.getElementById("packageStatus");

  async function addToOutput(expression, result) {
    try {
      // Check if result contains a DataFrame
      const isDataFrame = await pyodide.runPython(`
        import pandas as pd
        isinstance(${result}, pd.DataFrame)
      `);

      if (isDataFrame) {
        const htmlTable = await displayDataFrame(result);
        outputContainer.innerHTML = htmlTable;
        output.value += `${expression}\n[DataFrame displayed above]\n\n`;
      } else {
        output.value += `${expression}\n${result}\n\n`;
      }
      output.scrollTop = output.scrollHeight;
    } catch (err) {
      output.value += `${expression}\n${result}\n\n`;
      output.scrollTop = output.scrollHeight;
    }
  }

  function showError(message) {
    errorContainer.textContent = "Error: " + message;
    errorContainer.style.display = "block";
  }

  function hideError() {
    errorContainer.style.display = "none";
  }

  function updatePackageStatus(message) {
    packageStatus.textContent = message;
  }

  output.value = "Initializing...\n";

  // Initialize Pyodide and set up handlers
  (async () => {
    try {
      output.value = "Ready!\n\n";

      // Enhanced run code function with package support
      async function runCode() {
        hideError();
        runButton.disabled = true;
        runButton.textContent = "Running...";
        outputContainer.innerHTML = '';
        
        try {
          // Check and install required packages
          updatePackageStatus("Checking required packages...");
          await ensurePackages(code.value);
          updatePackageStatus("Packages ready");

          // Get the last line before executing
          const lines = code.value.trim().split('\n');
          const lastLine = lines[lines.length - 1].trim();

          // Execute the main code
          await pyodide.runPython(code.value);
          
          // Only show result if the last line is not an assignment
          if (!lastLine.includes('=')) {
            try {
              const result = await pyodide.runPython(lastLine);
              await addToOutput(lastLine, result);
            } catch (evalError) {
              const result = await pyodide.runPython(`str(${lastLine})`);
              await addToOutput(lastLine, result);
            }
          }
        } catch (err) {
          showError(err.message);
          addToOutput(code.value.split('\n').pop().trim(), "Error: " + err.message);
        } finally {
          runButton.disabled = false;
          runButton.textContent = "Run";
        }
      }

      // Add event listeners
      runButton.addEventListener("click", runCode);
      
      clearButton.addEventListener("click", () => {
        output.value = "";
        outputContainer.innerHTML = "";
        hideError();
        updatePackageStatus("");
      });

      code.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
          e.preventDefault();
          runCode();
        }
        if (e.key === "Tab") {
          e.preventDefault();
          const start = code.selectionStart;
          const end = code.selectionEnd;
          code.value = code.value.substring(0, start) + "    " + code.value.substring(end);
          code.selectionStart = code.selectionEnd = start + 4;
        }
      });

    } catch (err) {
      showError("Failed to initialize Pyodide. Please refresh the page.");
      console.error(err);
    }
  })();
}
```