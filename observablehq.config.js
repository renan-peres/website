// See https://observablehq.com/framework/config for documentation.

const EMOJI_FAVICON = "👋";
const FOOTER = "<a href='https://github.com/renan-peres' target='_blank'>Copyright 2024, Renan Peres</a>.";
const SOURCE_REPO = "https://github.com/renan-peres/website/blob/main/src";

const navigationPages = [
  {
    name: "WASM",
    open: false,
    pages: [
      {name: "CodeSanbox", path: "/dev/wasm/code-sandbox"},
      {name: "DuckDB: SQL Playground", path: "/dev/wasm/duckdb/duckdb-sql-playground"},
      {name: "DuckDB: Shell", path: "/dev/wasm/duckdb/duckdb-shell"},
      {name: "DuckDB: Parquet Converter", path: "/dev/wasm/duckdb/duckdb-parquet-converter"},
      {name: "DuckDB: Attach Databases", path: "/dev/wasm/duckdb/duckdb-attach-databases"},
      {name: "DuckDB: Attach S3", path: "/dev/wasm/duckdb/duckdb-attach-s3"},
      {name: "Pyodide: Read Data", path: "/dev/wasm/pyodide/pyodide-read"},
      {name: "Pyodide: Analytics", path: "/dev/wasm/pyodide/pyodide-analytics"},
      {name: "Pyodide: Shell", path: "/dev/wasm/pyodide/pyodide-shell"},
      {name: "Pyodide: Jupyter Lite", path: "/dev/wasm/pyodide/pyodide-jupyterlite"},
      {name: "WebR", path: "/dev/wasm/webr/webr"},
      {name: "WebR: Shell", path: "/dev/wasm/webr/webr-shell"},
    ]
  }
  
  ,{
    name: "Utils",
    open: false,
    pages: [
      {name: "DuckDB: Line Chart", path: "/dev/utils/duckdb-line"},
      {name: "DuckDB: Choropleth", path: "/dev/utils/duckdb-choropleth"},
      {name: "DuckDB: Mosaic Cross-Filter", path: "/dev/utils/duckdb-mosaic-flights"},
      {name: "Tabulator", path: "/dev/utils/tabulator"},
      {name: "HuggingFace: Serverless API Inference", path: "/dev/utils/huggingface-serverless-api"},
      // {name: "AG-Grid", path: "/dev/utils/ag-grid"},
    ]
   }  

  ,{
    name: "Quarto",
    open: false,
    pages: [
      {name: "Governance Indicators", path: "/dev/quarto/world-gov-indicators/world-gov-indicators"},
      {name: "HTML Basics (Report)", path: "/dev/quarto/html-basics/quarto_html_basics"},
      {name: "Stock Explorer (Dashboard)", path: "/dev/quarto/stock-explorer-dashboard/stock_explorer_dashboard"}
    ]
  }

  ,{
    name: "Economy",
    open: true,
    pages: [
      {name: "Economic Calendar", path: "/finance/economy/economic-calendar"},
      {name: "U.S. Macro Indicators", path: "/finance/economy/macro-indicators"},
      {name: "U.S. Monetary Base", path: "/finance/economy/monetary-base"},
      {name: "U.S. Mortgage Rates", path: "/finance/economy/mortgage-rates"}
    ]
  }
  
  ,{
    name: "Financial Markets",
    open: true,
    pages: [
      {name: "Market News", path: "/finance/financial-markets/market-news"},
      {name: "Stock & Crypto Prices", path: "/finance/financial-markets/stock-crypto-prices"},
      {name: "Foreign Exchange Rates", path: "/finance/financial-markets/fx-rates"},
      {name: "Commodity Prices", path: "/finance/financial-markets/commodity-prices"},
      {name: "Bond Prices", path: "/finance/financial-markets/bond-prices"},
      {name: "IPO Calendar", path: "/finance/financial-markets/ipo-calendar"}
    ]
  }

  ,{
    name: "Coporate Finance",
    open: true,
    pages: [
      {name: "Financial Statements", path: "/finance/coporate-finance/financial-statements"},
      {name: "DCF Analysis", path: "/finance/coporate-finance/company-dcf"},
      {name: "M&A Transactions", path: "/finance/coporate-finance/ma-transactions"}
    ]
  }

  ,{
    name: "Quantitative Finance",
    open: true,
    pages: [
      {name: "Portfolio Builder & Optimization", path: "/finance/quantitative-finance/portfolio-builder"},
      {name: "Option Pricing Model", path: "/finance/quantitative-finance/option-pricing-model"},
      {name: "Naive Arbitrage for Trading", path: "/finance/quantitative-finance/naive-arb-trading"}
    ]
  }

  ,{
    name: "MFIN",
    open: true,
    pages: [
      {name: "Portfolio Analysis (SQL & Tableau)", path: "/finance/mfin/fall-24/data-extraction-visualization/individual/data-extraction-individual"},
      // {name: "Data Extraction (Open Server)", path: "/finance/mfin/Fall-24/Data-Extraction/Individual/data-extraction-sql"},
      // {name: "Fall-24: Covid Analysis (DE&Viz)", path: "/finance/mfin/Fall-24/Data-Extraction/Team/data-extraction-team"}
      {name: "Apple Financial Model (Excel)", path: "/finance/mfin/fall-24/cost-managerial-analysis/financial-model-apple"}
    ]
  }
  
  // ,{
  //   name: "MBAN",
  //   open: false,
  //   pages: [
  //     // {name: "Portfolio Analysis (SQL & Tableau)", path: "/mfin/Fall-24/Data-Extraction-Visualization/Individual/data-extraction-individual"},
  //     // // {name: "Data Extraction (Open Server)", path: "/mfin/Fall-24/Data-Extraction/Individual/data-extraction-sql"},
  //     // // {name: "Fall-24: Covid Analysis (DE&Viz)", path: "/mfin/Fall-24/Data-Extraction/Team/data-extraction-team"}
  //     // {name: "Apple Financial Model (Excel)", path: "/mfin/Fall-24/Cost-Managerial-Analysis/financial-model-apple"}
  //   ]
  // }

];

const VIEW_SOURCE = !SOURCE_REPO
  ? ""
  : `
<a class="view-source" target="_blank" aria-label="Edit this page" title="Edit this page" href="${SOURCE_REPO}" style="display: flex; align-items: center; gap: 4px; text-decoration: none; color: #666;">
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
  </svg>
  <span>Edit this page</span>
</a>
<script type="module">
const a = document.querySelector(".view-source");
a.setAttribute("href", a.getAttribute("href") + (
  document.location.pathname
    .replace(/[/]$/, "/index")
    .replace(/^[/]pangea(-proxima)?/, "")
  ) + ".md?plain=1"
);
</script>
`;

const HEADER =  `
<div class="header-container">
  <style>
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .navigation-links {
      display: flex;
      gap: 1rem;
      margin: 0.5rem 0;
    }
    .nav-link {
      text-decoration: none;
      color: #666;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }
    .nav-link:hover {
      background-color: #161616;
      color: #666;
    }
  </style>
  
  <div class="navigation-links">
    <script>
      function findNavPages() {
        const currentPath = window.location.pathname;
        let prevPath = null;
        let nextPath = null;
        let isFirstPage = false;
        
        // Flatten navigation structure
        const allPages = ${JSON.stringify(navigationPages)}.flatMap(section => 
          section.pages
        );
        
        // Find current page index
        const currentIndex = allPages.findIndex(page => page.path === currentPath);
        
        // Check if this is the first page
        isFirstPage = currentIndex === 0;
        
        // Get previous and next paths if they exist
        if (currentIndex > 0) {
          prevPath = allPages[currentIndex - 1].path;
        }
        if (currentIndex < allPages.length - 1) {
          nextPath = allPages[currentIndex + 1].path;
        }
        
        return { prevPath, nextPath, isFirstPage };
      }
      
      const { prevPath, nextPath, isFirstPage } = findNavPages();
      document.write(
        (isFirstPage ? '<a href="/" class="nav-link home-link">← Home</a>' : 
         prevPath ? '<a href="' + prevPath + '" class="nav-link prev-link">← Previous</a>' : '') +
        (nextPath ? '<a href="' + nextPath + '" class="nav-link next-link">Next →</a>' : '')
      );
    </script>
  </div>
  
  <div class="view-source-container">
    ${VIEW_SOURCE}
  </div>
</div>
`;

export default {
  title: "Home",
  pages: navigationPages,
  head: `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${EMOJI_FAVICON}</text></svg>">`,
  header: HEADER,
  footer: FOOTER,
  root: "src",
  // Some additional configuration options and their defaults:
  // theme: "default", // try 'dashboard', "light", "dark", "slate", etc.
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  pager: false, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
  duckdb: {extensions: ["spatial", "h3", "pivot_table"]},
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  build: {
    base: '/',
    duckdbConfig: {
      loadPath: 'https://app.motherduck.com'
    }
  },
  
};
