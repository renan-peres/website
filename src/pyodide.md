---
index: true
keywords: Python, wasm
---

# Pyodide

```js
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.mjs";
let pyodide = await loadPyodide();
await pyodide.loadPackage("numpy");
```

```js
html`
<div style="font-family: system-ui; padding: 20px;">
  <p>You can execute any Python code. Just enter something in the box below and click the button.</p>
  <textarea 
    id="code" 
    style="width: 100%; min-height: 50px; margin-right: 10px; padding: 10px; font-family: monospace;"
  >df = sum([1, 2, 3, 4, 5])
df + df + df</textarea>
  <br />
  <br />
  <button id="runButton" style="padding: 5px 10px;">Run</button>
  <button id="clearButton" style="padding: 5px 10px; margin-left: 10px;">Clear</button>
  <div id="error-container" style="color: red; margin-top: 10px; display: none;"></div>
  <br />
  <div>Output:</div>
  <textarea id="output" style="width: 100%; min-height: 150px; margin-top: 10px; font-family: monospace;" readonly></textarea>
</div>
`
```

```js
// Initialize Pyodide and set up event handlers
{
  const output = document.getElementById("output");
  const code = document.getElementById("code");
  const runButton = document.getElementById("runButton");
  const clearButton = document.getElementById("clearButton");
  const errorContainer = document.getElementById("error-container");

  function addToOutput(expression, result) {
    output.value += `${expression}\n${result}\n\n`;
    output.scrollTop = output.scrollHeight;
  }

  function showError(message) {
    if (errorContainer) {
      errorContainer.textContent = "Error: " + message;
      errorContainer.style.display = "block";
    }
  }

  function hideError() {
    if (errorContainer) {
      errorContainer.style.display = "none";
    }
  }

  output.value = "Initializing...\n";

  // Initialize Pyodide
  (async () => {
    try {
      const pyodide = await loadPyodide();
      output.value = "Ready!\n\n";

      // Run code function
      async function runCode() {
        hideError();
        runButton.disabled = true;
        runButton.textContent = "Running...";
        
        try {
          // Get the last line before executing
          const lines = code.value.trim().split('\n');
          const lastLine = lines[lines.length - 1].trim();

          // Execute the main code
          await pyodide.runPython(code.value);
          
          // Only show result if the last line is not an assignment
          if (!lastLine.includes('=')) {
            const result = await pyodide.runPython(`str(${lastLine})`);
            addToOutput(lastLine, result);
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
        hideError();
      });

      code.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
          e.preventDefault();
          runCode();
        }
        // Enable tab indentation
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
