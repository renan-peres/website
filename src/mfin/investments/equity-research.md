---
theme: dashboard
index: true
title: "Equity Research (Garmin: GRMN)"
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

# Equity Research (Garmin: GRMN)
## Investments (Spring 2024)

This project presents a comprehensive equity research analysis of Garmin Ltd. (NASDAQ: GRMN), a global leader in GPS navigation and wearable technology. The analysis includes a detailed discounted cash flow (DCF) model built using financial data from Garmin's annual reports for fiscal years 2020-2024. This equity research report provides insights into Garmin's business operations, competitive positioning, financial performance, and intrinsic valuation.

---

## Source Data
The analysis is based on official SEC filings from Garmin Ltd.:
- [2024 Annual Report (10-K)](https://www8.garmin.com/aboutGarmin/invRelations/reports/2024_10-K.pdf)
- [2023 Annual Report (10-K)](https://www8.garmin.com/aboutGarmin/invRelations/reports/2023_10-K.pdf)
- [2022 Annual Report (10-K)](https://www8.garmin.com/aboutGarmin/invRelations/reports/2022_10-K.pdf)
- [2021 Annual Report (10-K)](https://www8.garmin.com/aboutGarmin/invRelations/reports/2021_10-K.pdf)
- [2020 Annual Report (10-K)](https://www8.garmin.com/aboutGarmin/invRelations/reports/2020_10-K.pdf)

---

# DCF Model

```js
const iframeSrc = "https://1drv.ms/x/c/bde1a904e346bc6a/IQQuTns2LF_MQ6ZohtFYPhXGAQRKvMCl8r7gU-DlrvNVhrw?em=2&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True";

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

# Equity Research Report

```js
const pdfUrl = await FileAttachment("dcf-model-garmin.pdf").url();
display(html`
  <embed 
    src="${pdfUrl}" 
    type="application/pdf"
    width="100%" 
    height="1000px"
  />
`);
```