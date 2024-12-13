// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "Renan Peres's Portfolio",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {
      name: "DevBox",
      open: true,
      pages: [
        {name: "Playground", path: "/devbox/devbox-playground"},
        {name: "DuckDB: Parquet Converter", path: "/devbox/duckdb-parquet-converter"},
        {name: "WebR", path: "/devbox/webr"},
        {name: "Pyodide", path: "/devbox/pyodide"},
        {name: "Spreadsheet Connector", path: "/devbox/spreadsheet-connector"},
        {name: "Excel Downloader", path: "/devbox/excel-downloader"}
      ]
    }
    
    ,{
      name: "Finance",
      open: true,
      pages: [
        {name: "Stocks & Crypto", path: "/finance/stock-crypto-viewer"},
        {name: "U.S. Mortgage Rates", path: "/finance/mortgage-rates"},
        {name: "Macro Indicators", path: "/finance/macro-indicators"},
        {name: "U.S. Monetary Base", path: "/finance/monetary-base"},
        {name: "Foreign Exchange Market", path: "/finance/fx-market"},
        {name: "Portfolio Builder", path: "/finance/portfolio-builder"}
      ]
    }
    
    ,{
      name: "Analytics",
      open: true,
      pages: [
        {name: "U.S. Electricity Grid", path: "/analytics/eia"},
        // {name: "AG Grid", path: "/analytics/ag-grid"},
        // {name: "Tabulator", path: "/analytics/tabulator"},
        {name: "Highcharter", path: "/analytics/highcharts"}
      ]
    }
    
    ,{
      name: "MFIN",
      open: true,
      pages: [
        {name: "Data Extraction (Individual)", path: "/mfin/data-extraction-individual"},
        {name: "Financial Model (Apple)", path: "/mfin/financial-model-apple"}
      ]
    }
    
  ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  // The path to the source root.
  root: "src",
  theme: 'dashboard',
  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  footer: "", // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  pager: false, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
};
