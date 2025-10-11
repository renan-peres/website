---
theme: dashboard
index: true
toc: true
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

// Custom collapsible section function for insights
function createCollapsibleInsight(title, content, defaultOpen = true) {
  return htl.html`
    <div style="border: 1px solid var(--theme-foreground-faint, #e5e7eb); border-radius: 8px; margin-bottom: 16px; overflow: hidden; background: var(--theme-background, #ffffff);">
      <button 
        style="width: 100%; padding: 16px; background: var(--theme-background-alt, #f9fafb); border: none; cursor: pointer; text-align: left; font-size: 18px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; color: var(--theme-foreground, #000000);"
        onmouseover="this.style.background='var(--theme-foreground-faintest, #f3f4f6)'"
        onmouseout="this.style.background='var(--theme-background-alt, #f9fafb)'"
        onclick=${(e) => {
          const contentDiv = e.target.nextElementSibling;
          const arrow = e.target.querySelector('.arrow');
          const isHidden = contentDiv.style.display === 'none';
          
          contentDiv.style.display = isHidden ? 'block' : 'none';
          arrow.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
        }}
      >
        <span>${title}</span>
        <span class="arrow" style="transition: transform 0.3s; transform: rotate(${defaultOpen ? '90deg' : '0deg'}); color: var(--theme-foreground-muted, #6b7280);">▶</span>
      </button>
      
      <div style="display: ${defaultOpen ? 'block' : 'none'}; padding: 20px; background: var(--theme-background, #ffffff); color: var(--theme-foreground, #000000);">
        ${content}
      </div>
    </div>
  `;
}
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

# H1-B Visa 2024 Lottery: Finance & Banking Analysis
## Dual Degree Skills Immersion (Fall 2025)
The H-1B visa program allows U.S. employers to temporarily employ foreign workers in specialty occupations. Due to high demand exceeding the annual cap of 85,000 visas (65,000 regular cap + 20,000 advanced degree exemption), USCIS conducts a lottery system to select beneficiaries.

---

## Reflection/Insights

```js
// ...existing code...

const insight1 = createCollapsibleInsight(
  "1. 📊 Demand & Certification Outcomes",
  htl.html`
    <p>Over 461,000 H1-B applications were submitted, with approximately 427,000 certified (~93% certification rate), yet only ~85,000 visa slots are available annually.</p>
    
    <p><strong>Business Insight:</strong> The massive demand creates significant lottery risk. Firms must compete aggressively for scarce visa hires and develop contingency strategies for talent acquisition.</p>
  `,
  true
);

const insight2 = createCollapsibleInsight(
  "2. 💰 Top Job Roles: Technology/IT vs. Finance",
  htl.html`
    <p><strong>Technology/IT Dominance:</strong> ~65% of petitions</p>
    <ul>
      <li>Software Engineers & Developers</li>
      <li>Data Scientists & Analysts</li>
      <li>Systems Engineers</li>
      <li>Technical Architects</li>
    </ul>

    <p><strong>Finance Sector:</strong> ~6% of petitions</p>
    <ul>
      <li>Accountants & Auditors</li>
      <li>Financial Analysts</li>
      <li>Quantitative Analysts</li>
      <li>Risk Specialists</li>
      <li>Financial Managers</li>
    </ul>

    <p><strong>Business Insight:</strong> While IT dominates the H1-B landscape, finance professionals provide crucial analytical and regulatory support essential for business operations, compliance, and risk management.</p>
  `
);

const insight3 = createCollapsibleInsight(
  "3. 🌍 Finance Centers & Salaries",
  htl.html`
    <p><strong>Compensation Benchmarks:</strong></p>
    <ul>
      <li><strong>Technology/IT Median:</strong> ~$104,000</li>
      <li><strong>Finance Median:</strong> ~$91,000</li>
    </ul>

    <p><strong>Demographic Profile:</strong></p>
    <ul>
      <li>Both sectors attract prime talent aged <strong>25–34 years</strong></li>
      <li>Salaries significantly exceed U.S. average wages</li>
      <li>Candidates positioned for long-term career growth and leadership</li>
    </ul>

    <p><strong>Business Insight:</strong> H1-B hires demonstrate salary outperformance and align perfectly with firms' growth trajectories and compliance pipelines, offering high ROI on talent investment.</p>

    <p><strong>Finance Centers:</strong></p>
    <ul>
      <li>1. New York City</li>
      <li>2. Bay Area (FinTech)</li>
      <li>3. Texas (Dallas, Houston)</li>
      <li>4. Chicago</li>
      <li>5. New Jersey</li>
    </ul>

    <p><strong>Business Insight:</strong> Roles concentrate in cities where global competition for expertise is highest, requiring location-specific recruitment strategies and compensation packages.</p>
  `
);

const insight4 = createCollapsibleInsight(
  "4. 🎯 Strategic Takeaway: New $100K fee as Business Enabler",
  htl.html`
    <p>The <strong>new $100K visa fee</strong> is fundamentally changing hiring strategies:</p>
    <ul>
      <li>Increased prioritization of <strong>domestic talent</strong> and <strong>OPT candidates</strong></li>
      <li>H1-B reserved for <strong>specialized, high-impact roles</strong> only</li>
      <li>Greater selectivity in petition submissions</li>
    </ul>

    <p><strong>Business Insight:</strong> Critical positions in IT, finance analytics, compliance, and risk management become even more competitive. Organizations must invest in:</p>
    <ul>
      <li>Internal upskilling programs</li>
      <li>Diverse talent pipeline development</li>
      <li>Strategic workforce planning</li>
      <li>Alternative visa pathways (O-1, L-1, etc.)</li>
    </ul>
    
    <p><strong>Bottom Line:</strong> Increasing costs and lottery uncertainty push business leaders to evolve their talent acquisition models while maintaining access to specialized global expertise critical for competitive advantage.</p>
  `
);

// Add toggle all button
const toggleAllButton = htl.html`
  <div style="margin-bottom: 16px; text-align: left;">
    <button 
      id="toggleAllInsights"
      style="padding: 10px 20px; background: var(--theme-foreground-focus, #2563eb); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.2s;"
      onmouseover="this.style.background='var(--theme-foreground-faint, #1d4ed8)'"
      onmouseout="this.style.background='var(--theme-foreground-focus, #2563eb)'"
      onclick=${function() {
        // Check if any are expanded
        const anyExpanded = Array.from(document.querySelectorAll('.arrow'))
          .some(arrow => arrow.parentElement.nextElementSibling.style.display !== 'none');
        
        // Toggle all to opposite state
        document.querySelectorAll('.arrow').forEach(arrow => {
          const contentDiv = arrow.parentElement.nextElementSibling;
          if (anyExpanded) {
            contentDiv.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
          } else {
            contentDiv.style.display = 'block';
            arrow.style.transform = 'rotate(90deg)';
          }
        });
        
        // Update button text
        this.textContent = anyExpanded ? '📂 Expand All' : '📁 Collapse All';
      }}
    >
      📁 Collapse All
    </button>
  </div>
`;

display(toggleAllButton);
display(insight1);
display(insight2);
display(insight3);
display(insight4);
```

---

## Power BI Dashboard

This interactive dashboard provides a comprehensive analysis of the **H1-B 2024 lottery results**, offering insights into:

- **Industry breakdown** of H1-B sponsoring employers
- **Selection rates** across different registration types and categories
- **Geographic distribution** of selected applicants by country and employer location
- **Employer trends** showing which companies received the most selections
- **Salary ranges** and compensation patterns for selected positions

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
- [H1-B Data Hub](https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub)

---

<div style="margin-top: 40px; padding: 20px; background-color: #f0f7ff; border-left: 4px solid #2563eb; border-radius: 4px;">
  <p style="margin: 0; font-size: 14px; color: #1e40af;">
    <strong>Note:</strong> This analysis is for informational and educational purposes only. It does not constitute legal advice. For specific immigration matters, please consult with a qualified immigration attorney.
  </p>
</div>
