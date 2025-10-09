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
// Helper function to determine if URL is SharePoint and format iframe URL if needed
function processUrl(url) {
  if (url.includes('sharepoint.com' | '1drv.ms')) {
    // Add the necessary SharePoint embed parameters including download button
    return `${url}&action=embedview&wdAllowInteractivity=True&wdHideGridlines=True&wdDownloadButton=True&wdInConfigurator=True&edesNext=false&resen=false`;
  } else if (url.includes('docs.google.com')) {
    const sheetId = url.match(/[-\w]{25,}/);
    return sheetId 
      ? `https://docs.google.com/spreadsheets/export?format=csv&id=${sheetId[0]}`
      : url;
  }
  return url;
}

const spreadsheetUrl = view(Inputs.textarea({
  // value: "https://hultstudents-my.sharepoint.com/personal/rperes_student_hult_edu/_layouts/15/Doc.aspx?sourcedoc={29ffabe6-324a-4303-aeba-c924a5aca801}",
  value: "https://1drv.ms/x/c/bde1a904e346bc6a/IQTKZtR9HeT2QLyimcyVE3o0ASeRkL1v1AUyejtCeJUeqOE?em=2",
  width: "100%",
  rows: 1,
  resize: "both",
  style: { fontSize: "16px" },
  display: false, // Key to Display the Model Corectly
  disabled: true,
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```js
// Display content based on URL type
const url = processUrl(spreadsheetUrl);

if (spreadsheetUrl.includes('sharepoint.com' | '1drv.ms')) {
  // Create buttons container with flexbox
  const buttonsContainer = html`
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <button style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
        onclick=${(e) => {
          const iframe = document.querySelector('iframe');
          if (!document.fullscreenElement) {
            iframe.style.width = '100vw';
            iframe.style.height = '100vh';
            if (iframe.requestFullscreen) {
              iframe.requestFullscreen();
            } else if (iframe.webkitRequestFullscreen) {
              iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) {
              iframe.msRequestFullscreen();
            }
            e.target.textContent = 'Exit Fullscreen';
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
            iframe.style.width = '100%';
            iframe.style.height = '1000px';
            e.target.textContent = 'Fullscreen';
          }
        }}>
        Fullscreen
      </button>

      <button style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;"
        onclick=${() => {
          const iframe = document.querySelector('iframe');
          try {
            // Target the download button by its class or role
            const downloadButton = iframe.contentWindow.document.querySelector('button[title="Download a copy"]') ||
                                 iframe.contentWindow.document.querySelector('.DownloadButtonWrapper') ||
                                 iframe.contentWindow.document.querySelector('[data-automation-id="download-button"]');
            if (downloadButton) {
              downloadButton.click();
            } else {
              // If we can't find the button directly, try simulating the keyboard shortcut
              iframe.contentWindow.postMessage({ type: 'download' }, '*');
            }
          } catch (error) {
            console.log('Could not access iframe content:', error);
            // Fallback: Open the file in a new tab where user can download
            window.open(url, '_blank');
          }
        }}>
        View in Excel Web
      </button>
    </div>`;
  
  // Display buttons and iframe in a container
  const container = html`
    <div>
      ${buttonsContainer}
      <iframe 
        width="100%" 
        height="1000" 
        frameborder="0" 
        scrolling="yes" 
        src="${url}">
      </iframe>
    </div>`;
  
  display(container);
} else {
  // Handle Google Sheets
  const data = await d3.csv(url);
  
  display(Inputs.table(data, {
    rows: 50,
    layout: "fixed",
    width: "100%",
    maxHeight: 600,
    style: {
      table: { background: "#1a1a1a" },
      thead: { position: "sticky", top: 0, background: "#1a1a1a", zIndex: 1 },
      "tr:hover": { background: "#2a2a2a" }
    }
  }));
  
  // Add export functionality for CSV download
  display(
    Inputs.button(`Download data.csv`, {
      reduce() {
        const csvContent = "data:text/csv;charset=utf-8," 
          + data.map(row => Object.values(row).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "spreadsheet_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    })
  );
}
```
---

# Report

```js
const reportHtml = await FileAttachment("report-base64.txt").text();
display(html`
  <embed 
    src="data:application/pdf;base64,${reportHtml}" 
    width="100%" 
    height="1200px"
/>
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
    height="1000px"
/>
`);
```