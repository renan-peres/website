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
        {name: "Playground", path: "/devbox/devbox-payground"},
        {name: "DuckDB", path: "/devbox/duckdb-autocomplete"},
        {name: "WebR", path: "/devbox/webr-autocomplete"},
        {name: "Pyodide", path: "/devbox/pyodide-autocomplete"}
      ]
    }
    
        ,{
          name: "Data Tools",
          open: true,
          pages: [
            {name: "Parquet Converter", path: "/data-tools/duckdb-parquet-converter"},
            {name: "Google Sheets", path: "/data-tools/google-sheets"},
            {name: "XLSX Downloader", path: "/data-tools/xlsx-downloads"}
          ]
        }

    ,{
      name: "Finance",
      open: true,
      pages: [
        {name: "Stock Prices", path: "/finance/stock-prices"},
        {name: "Mortgage Rates", path: "/finance/mortgage-rates"},
        {name: "Portfolio Builder", path: "/finance/portfolio-builder"}
      ]
    }

    ,{
      name: "Data Analysis",
      open: true,
      pages: [
        {name: "Highcharter", path: "/data-analysis/highcharts"},
        {name: "AG Grid", path: "/data-analysis/ag-grid"},
        {name: "Tabulator", path: "/data-analysis/tabulator"}
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
