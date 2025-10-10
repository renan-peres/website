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

# H1-B Visa 2024 Lottery Analysis

## Overview

The H-1B visa program allows U.S. employers to temporarily employ foreign workers in specialty occupations. Due to high demand exceeding the annual cap of 85,000 visas (65,000 regular cap + 20,000 advanced degree exemption), USCIS conducts a lottery system to select beneficiaries.

This interactive dashboard provides a comprehensive analysis of the **H1-B 2024 lottery results**, offering insights into:

- **Selection rates** across different registration types and categories
- **Geographic distribution** of selected applicants by country and employer location
- **Employer trends** showing which companies received the most selections
- **Degree-level analysis** comparing regular cap vs. advanced degree selections
- **Salary ranges** and compensation patterns for selected positions
- **Industry breakdown** of H1-B sponsoring employers

### Key Statistics (2024)

- **Total Registrations:** ~780,000+ submissions
- **Available Visas:** 85,000 (including advanced degree cap)
- **Overall Selection Rate:** ~10-15% (varies by category)
- **Peak Filing Period:** March 2024
- **Results Announced:** March-April 2024

### How to Use This Dashboard

The Power BI dashboard below is fully interactive. You can:
- **Filter by country, employer, job title, or salary range** using the slicers
- **Click on visualizations** to cross-filter and drill down into specific segments
- **Use the fullscreen button** below for a better viewing experience
- **Explore trends** by hovering over charts to see detailed tooltips

---

## Interactive Power BI Dashboard

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

## Understanding the H1-B Lottery Process

### Registration Phase
1. **Employers submit electronic registrations** during the designated filing period (typically in March)
2. **Each registration** includes basic information about the beneficiary and the position
3. **Registration fee:** $10 per beneficiary

### Selection Process
USCIS uses a **computer-generated random selection process**:
1. **First round:** Selections from the advanced degree pool for the 20,000 cap
2. **Second round:** Remaining advanced degree registrations are added to the regular pool
3. **Final selection:** Random selection for the 65,000 regular cap from the combined pool

### Post-Selection
- Selected registrations have **90 days** to file a complete H1-B petition
- Multiple registrations for the same beneficiary by related entities may be **denied**
- Approval is not guaranteed; petitions must meet all eligibility requirements

---

## Data Sources & Methodology

This analysis is based on publicly available data from:
- **USCIS Official Statistics** - H1-B lottery results and selection notices
- **DOL Disclosure Data** - Labor Condition Applications (LCA) containing salary and job information
- **USCIS Case Status Data** - Petition approval and processing information

**Data Processing:**
- Data cleaned and normalized using DuckDB and Python
- Visualizations created in Power BI with DAX measures
- Updated as of: **April 2024**

---

## Key Insights

### 📊 **Selection Rate Challenges**
The H1-B lottery has become increasingly competitive over the years, with selection rates dropping from ~40% in 2014 to ~10-15% in 2024 due to surging demand.

### 🏢 **Top Sponsoring Industries**
- Technology & IT Services
- Consulting & Business Services  
- Healthcare & Life Sciences
- Finance & Banking
- Higher Education

### 🌍 **Geographic Patterns**
The majority of beneficiaries come from India and China, while sponsoring employers are concentrated in tech hubs like California, Texas, New York, and Washington.

### 💰 **Salary Trends**
Advanced degree cap positions typically command higher salaries, with median wages ranging from $90,000 to $150,000+ depending on role and location.

---

## Resources

- [USCIS H1-B Program](https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations)
- [DOL Foreign Labor Certification](https://www.dol.gov/agencies/eta/foreign-labor)
- [H1-B Data Hub](https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub)

---

<div style="margin-top: 40px; padding: 20px; background-color: #f0f7ff; border-left: 4px solid #2563eb; border-radius: 4px;">
  <p style="margin: 0; font-size: 14px; color: #1e40af;">
    <strong>Note:</strong> This analysis is for informational and educational purposes only. It does not constitute legal advice. For specific immigration matters, please consult with a qualified immigration attorney.
  </p>
</div>
