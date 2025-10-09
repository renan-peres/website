---
theme: dashboard
index: true
toc: false
keywords: duckdb, wasm
---

```html
<style>
.observablehq textarea,
.observablehq-input textarea,
.sql-editor {
  min-height: 500px !important;
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
import {datetime} from "../assets/components/datetime.js";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";

const predefinedDb = await getDefaultClient();
// Helper function to download files
function download(file) {
  const a = document.createElement("a");
  a.download = file.name;
  a.href = URL.createObjectURL(file);
  a.click();
  URL.revokeObjectURL(a.href);
}

// Helper function to convert to parquet
async function toParquet(duckDbClient, {table = "data", originalName = table, name = `${originalName}.parquet`} = {}) {
  const tmp = (Math.random() * 1e16).toString(16);
  const db = duckDbClient._db;
  await duckDbClient.query(`COPY ${duckDbClient.escape(table)} TO '${tmp}' (FORMAT PARQUET, COMPRESSION GZIP)`);
  const buffer = await db.copyFileToBuffer(tmp);
  return new File([buffer], name, {
    type: "application/vnd.apache.parquet"
  });
}
```

# Power BI Dashboard

<!-- ```html
<div style="width: 100%; height: 800px; position: relative;">
  <iframe 
    title="H1B 2024" 
    width="100%" 
    height="800" 
    src="https://app.fabric.microsoft.com/view?r=eyJrIjoiNzAxYjUwNjEtMzExNy00NWQ4LTlmMDgtMDA2Y2UwMWFkNTgxIiwidCI6IjdiMDVjYmU0LTI1OWItNGFlZS1hMGRkLWRiM2JlZTVkYTFjYSIsImMiOjJ9" 
    frameborder="0" 
    allowFullScreen="true">
  </iframe>
</div>
``` -->

---

```js
const dashboard = html`
  <div>
    <button 
      style="margin-bottom: 10px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
      onclick=${(e) => {
        const iframe = e.target.parentElement.querySelector('iframe');
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
          iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
          iframe.msRequestFullscreen();
        }
      }}>
      Fullscreen
    </button>
    <div style="width: 100%; height: 800x; position: relative;">
      <iframe 
        title="H1B 2024" 
        width="100%" 
        height="800" 
        src="https://app.fabric.microsoft.com/view?r=eyJrIjoiNzAxYjUwNjEtMzExNy00NWQ4LTlmMDgtMDA2Y2UwMWFkNTgxIiwidCI6IjdiMDVjYmU0LTI1OWItNGFlZS1hMGRkLWRiM2JlZTVkYTFjYSIsImMiOjJ9" 
        frameborder="0" 
        allowFullScreen="true">
      </iframe>
    </div>
  </div>
`;

display(dashboard);
```

---
