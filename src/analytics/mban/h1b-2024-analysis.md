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
import {datetime} from "../../assets/components/datetime.js";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../../assets/components/tableFormatting.js";
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

<!-- ```js
// Create the dropdown for pre-built queries
const returnInput = view(Inputs.range([0, 750], {
  step: 25, 
  value: 0, // Set initial value
  placeholder: "1-750"
}));
``` -->

# Portfolio Analysis
## Data Extraction & Visualization (Fall 2024)

<div class="datetime-container">
  <div id="datetime"></div>
</div>

This project presents a comprehensive portfolio analysis tool combining SQL-based data extraction with Tableau visualization capabilities. The system analyzes financial portfolio data for customer #128 (Bojana Popovic), providing insights into investment performance, risk assessment, and potential portfolio optimization opportunities. By leveraging both SQL for complex calculations and Tableau for visualization, the project delivers a complete view of the client's investment portfolio.

---

## Key Features
- DuckDB integration for efficient data processing
- Sequential query execution for streamlined analysis
- Responsive full-width layout design
- Interactive data visualization
- Export functionality in CSV and Parquet formats
- Automated data processing and handling
- Real-time data extraction capabilities

### [Part 1: Data Extraction (SQL)](#part-1-data-extraction-sql-1)
The SQL component integrates multiple data sources including account dimensions, customer details, holdings, and pricing information. It processes this data through a series of analytical queries:

- **SQL View**: Creates a comprehensive view consolidating all client portfolio data with relevant dimensions and metrics
- **Query 1**: Analyzes portfolio performance through 12, 24, and 36-month return calculations for individual securities and the overall portfolio
- **Query 2**: Evaluates investment risk through sigma (volatility) calculations and average daily returns
- **Query 3**: Identifies potential investment opportunities by analyzing securities not currently in the portfolio
- **Query 4**: Calculates risk-adjusted returns (Sharpe-like ratio) to determine optimal investment efficiency

### [Part 2: Interactive Dashboard (Tableau)](#part-2-interactive-dashboard-tableau-1)
The Tableau dashboard provides an interactive visualization layer that transforms the SQL analysis into actionable insights:

- Asset allocation breakdown and portfolio composition
- Historical performance trends and comparisons
- Risk-return relationship visualization
- Dynamic filtering and drill-down capabilities
- Fullscreen viewing mode for detailed analysis
- Real-time metric updates and portfolio monitoring

This dual-approach methodology combines the computational power of SQL with the visual analytics of Tableau, providing a robust platform for comprehensive portfolio analysis and decision-making support.

---

# Power BI Dashboard

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
    <div style="width: 100%; height: 800px; position: relative;">
      <iframe 
        height="100%" 
        width="100%" 
        id="dashboard-embed" 
        title="H1B 2024 Dashboard"
        src="https://app.fabric.microsoft.com/view?r=eyJrIjoiZGJlM2YyYmItNmJmMC00N2I5LTgzMzMtNmUxMTI4NDcxYzE5IiwidCI6IjdiMDVjYmU0LTI1OWItNGFlZS1hMGRkLWRiM2JlZTVkYTFjYSIsImMiOjJ9&pageName=ec72ca4620ba8e04d898"
        style="border: none;"
        allow="clipboard-write" 
        allowfullscreen>
      </iframe>
    </div>
  </div>
`;

display(dashboard);
```

---
