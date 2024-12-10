---
theme: dashboard
index: true
title: Apple Financial Model
toc: false
---

# Apple Financial Model

```js
// Helper function to determine if URL is SharePoint and format iframe URL if needed
function processUrl(url) {
  if (url.includes('sharepoint.com')) {
    // Add the necessary SharePoint embed parameters
    return `${url}&action=embedview&wdAllowInteractivity=False&wdHideGridlines=True&wdDownloadButton=True&wdInConfigurator=True`;
  } else if (url.includes('docs.google.com')) {
    const sheetId = url.match(/[-\w]{25,}/);
    return sheetId 
      ? `https://docs.google.com/spreadsheets/export?format=csv&id=${sheetId[0]}`
      : url;
  }
  return url;
}

const spreadsheetUrl = view(Inputs.textarea({
  value: "https://hultstudents-my.sharepoint.com/personal/rperes_student_hult_edu/_layouts/15/Doc.aspx?sourcedoc={568c1a42-daea-4ec9-b77c-becc5830e601}",
  width: "800px",
  rows: 2,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

---

```js
// Display content based on URL type
const url = processUrl(spreadsheetUrl);

if (spreadsheetUrl.includes('sharepoint.com')) {
  // Display SharePoint Excel file in iframe
  const iframe = html`<iframe 
    width="100%" 
    height="1000" 
    frameborder="0" 
    scrolling="yes" 
    src="${url}">
  </iframe>`;
  
  display(iframe);
} else {
  // Handle Google Sheets as before
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
