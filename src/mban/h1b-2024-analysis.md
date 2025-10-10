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
The H-1B visa program allows U.S. employers to temporarily employ foreign workers in specialty occupations. Due to high demand exceeding the annual cap of 85,000 visas (65,000 regular cap + 20,000 advanced degree exemption), USCIS conducts a lottery system to select beneficiaries.

This interactive dashboard provides a comprehensive analysis of the **H1-B 2024 lottery results**, offering insights into:

- **Selection rates** across different registration types and categories
- **Geographic distribution** of selected applicants by country and employer location
- **Employer trends** showing which companies received the most selections
- **Degree-level analysis** comparing regular cap vs. advanced degree selections
- **Salary ranges** and compensation patterns for selected positions
- **Industry breakdown** of H1-B sponsoring employers

---

## Key Insights

### 1. 📊 **Demand & Certification Outcomes**
Over 461,000 H1-B applications were submitted, with approximately 427,000 certified (~93% certification rate), yet only ~85,000 visa slots are available annually.

**Business Insight:** The massive demand creates significant lottery risk. Firms must compete aggressively for scarce visa hires and develop contingency strategies for talent acquisition.

---

### 2. 🎯 **Top Job Roles: IT/STEM vs. Finance**

**IT/STEM Dominance:** ~65% of petitions
- Software Engineers & Developers
- Data Scientists & Analysts
- Systems Engineers
- Technical Architects

**Finance Sector:** ~6% of petitions
- Accountants & Auditors
- Financial Analysts
- Quantitative Analysts
- Risk Specialists
- Financial Managers

**Business Insight:** While IT dominates the H1-B landscape, finance professionals provide crucial analytical and regulatory support essential for business operations, compliance, and risk management.

---

### 3. 💰 **Salaries & Talent Pipeline**

**Compensation Benchmarks:**
- **IT/STEM Median:** ~$118,000
- **Finance Median:** ~$91,000

**Demographic Profile:**
- Both sectors attract prime talent aged **25–34 years**
- Salaries significantly exceed U.S. average wages
- Candidates positioned for long-term career growth and leadership

**Business Insight:** H1-B hires demonstrate salary outperformance and align perfectly with firms' growth trajectories and compliance pipelines, offering high ROI on talent investment.

---

### 4. 🔄 **Employer Strategy Shift: New Visa Economics**

The **new $100K visa fee** is fundamentally changing hiring strategies:
- Increased prioritization of **domestic talent** and **OPT candidates**
- H1-B reserved for **specialized, high-impact roles** only
- Greater selectivity in petition submissions

**Business Insight:** Critical positions in IT, finance analytics, compliance, and risk management become even more competitive. Organizations must invest in:
- Internal upskilling programs
- Diverse talent pipeline development
- Strategic workforce planning
- Alternative visa pathways (O-1, L-1, etc.)

---

### 5. 🌍 **Geographic Focus & Talent Clusters**

**Tech Hubs (IT/STEM):**
- San Francisco Bay Area
- Seattle
- Austin
- Boston

**Finance Centers:**
- New York City
- Chicago
- Bay Area (FinTech)
- Texas (Dallas, Houston)
- New Jersey

**Business Insight:** Roles concentrate in cities where global competition for expertise is highest, requiring location-specific recruitment strategies and compensation packages.

---

### 6. 🎯 **Strategic Takeaway: H1-B as Business Enabler**

**Dual Function:**
- **Workforce Accelerator:** Fueling innovation and technical capabilities (STEM/IT)
- **Regulatory Safeguard:** Strengthening compliance, risk management, and financial controls (Finance)

**Adaptation Strategies:**
- Use dashboard insights to fine-tune talent pipeline strategies
- Maximize salary competitiveness and leverage
- Adapt to new visa economics for sustainable growth
- Strengthen compliance and risk capabilities
- Innovate talent sourcing beyond traditional H1-B reliance

**Bottom Line:** Increasing costs and lottery uncertainty push business leaders to evolve their talent acquisition models while maintaining access to specialized global expertise critical for competitive advantage.

---

## Interactive Power BI Dashboard
The Power BI dashboard below is fully interactive. You can:
- **Filter by country, employer, job title, or salary range** using the slicers
- **Click on visualizations** to cross-filter and drill down into specific segments
- **Use the fullscreen button** below for a better viewing experience
- **Explore trends** by hovering over charts to see detailed tooltips

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
