---
index: true
---

# Google Sheets Data Connector

---
<!-- To load data from Google sheets, the easiest way is to allow it to be exported to csv: -->

```js
const spreadsheetUrl = view(Inputs.textarea({
  value: "https://docs.google.com/spreadsheets/export?format=csv&id=1GuEPkwjdICgJ31Ji3iUoarirZNDbPxQj_kf7fd4h4Ro",
  width: "800px",
  rows: 2,
  resize: "both",
  style: { fontSize: "16px" },
  onKeyDown: e => {
    if (e.ctrlKey && e.key === "Enter") e.target.dispatchEvent(new Event("input"));
  }
}));
```

```sql id=data 
FROM read_csv_auto(${spreadsheetUrl});
```

```js
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
}))
```

<!-- When that is not possible (say, for confidentiality), you can use a [data loader](/loaders/google-sheets) instead. -->
