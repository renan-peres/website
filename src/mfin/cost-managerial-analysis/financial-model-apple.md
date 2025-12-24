---
theme: dashboard
index: true
title: Apple Financial Model
toc: false
---

```html
<style>

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

# Apple Financial Model
## Cost & Managerial Analysis (Fall 2024)

This project presents a comprehensive financial model for Apple Inc., built using real financial data from their annual reports (10-K) for fiscal years 2022-2024. The model incorporates cost and managerial analysis frameworks to provide in-depth insights into Apple's financial performance and valuation.

---

## Source Data
The analysis is based on official SEC filings from Apple Inc.:
- [2024 Annual Report (10-K)](https://investor.apple.com/sec-filings/sec-filings-details/default.aspx?FilingId=17933082)
- [2023 Annual Report (10-K)](https://investor.apple.com/sec-filings/sec-filings-details/default.aspx?FilingId=17028298)
- [2022 Annual Report (10-K)](https://investor.apple.com/sec-filings/sec-filings-details/default.aspx?FilingId=16157374)

<!-- ## Model Components
The financial model is structured into three main sections:

### 1. Summary
- Key financial metrics and performance indicators
- Historical trend analysis
- Comparative performance evaluation
- Executive summary of findings

### 2. Assumptions
- Revenue growth projections
- Cost structure analysis
- Operating margin forecasts
- Capital expenditure estimates
- Working capital requirements
- Terminal value calculations

### 3. Model
- Detailed financial statements (Income Statement, Balance Sheet, Cash Flow)
- DCF valuation analysis
- Cost allocation and variance analysis
- Sensitivity analysis and scenario modeling
- Key performance indicators (KPIs) -->

---

# Model

```js
const iframeSrc = "https://1drv.ms/x/c/bde1a904e346bc6a/IQTKZtR9HeT2QLyimcyVE3o0ASeRkL1v1AUyejtCeJUeqOE?em=2&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True";

display(html`
  <div>
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <button style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
        onclick=${(e) => {
          const iframe = e.target.closest('div').parentElement.querySelector('iframe');
          if (!document.fullscreenElement) {
            iframe.style.width = '100vw';
            iframe.style.height = '100vh';
            iframe.requestFullscreen?.() || iframe.webkitRequestFullscreen?.() || iframe.msRequestFullscreen?.();
            e.target.textContent = 'Exit Fullscreen';
          } else {
            document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
            iframe.style.width = '100%';
            iframe.style.height = '1000px';
            e.target.textContent = 'Fullscreen';
          }
        }}>Fullscreen</button>
      <button style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;"
        onclick=${() => window.open(iframeSrc, '_blank')}>View in Excel Web</button>
    </div>
    <iframe width="100%" height="800" frameborder="0" scrolling="yes" src="${iframeSrc}"></iframe>
  </div>
`);
```

---

# Presentation

```js
const presentationHtml = await FileAttachment("presentation-base64.txt").text();
display(html`
  <embed 
    src="data:application/pdf;base64,${presentationHtml}" 
    width="100%" 
    height="800px"
/>
`);
```

---

# Report

```js
const reportHtml = await FileAttachment("report-base64.txt").text();
display(html`
  <embed 
    src="data:application/pdf;base64,${reportHtml}" 
    width="100%" 
    height="1000px"
/>
`);
```