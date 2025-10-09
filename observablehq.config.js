// See https://observablehq.com/framework/config for documentation.

const EMOJI_FAVICON = "👋";
const FOOTER = `<style>#observablehq-footer { margin-top: 1rem; }</style><a href='https://github.com/renan-peres' target='_blank'>Copyright 2025, Renan Peres</a>.`;
const SOURCE_REPO = "https://github.com/renan-peres/website/blob/main/src";

const navigationPages = [
  {
    name: "Dev",
    open: false,
    pages: [
      {name: "CodeSanbox", path: "/dev/wasm/code-sandbox"},
      {name: "WebR", path: "/dev/wasm/webr/webr"},
      {name: "WebR: Shell", path: "/dev/wasm/webr/webr-shell"},
      {name: "Pyodide: Read Data", path: "/dev/wasm/pyodide/pyodide-read"},
      {name: "Pyodide: Analytics", path: "/dev/wasm/pyodide/pyodide-analytics"},
      {name: "Pyodide: Shell", path: "/dev/wasm/pyodide/pyodide-shell"},
      {name: "Pyodide: Jupyter Lite", path: "/dev/wasm/pyodide/pyodide-jupyterlite"},
      {name: "DuckDB: SQL Playground", path: "/dev/wasm/duckdb/duckdb-sql-playground"},
      {name: "DuckDB: Shell", path: "/dev/wasm/duckdb/duckdb-shell"},
      {name: "DuckDB: Parquet Converter", path: "/dev/wasm/duckdb/duckdb-parquet-converter"},
      {name: "DuckDB: Attach Databases", path: "/dev/wasm/duckdb/duckdb-attach-databases"},
      {name: "DuckDB: Attach S3", path: "/dev/wasm/duckdb/duckdb-attach-s3"},
      {name: "DuckDB: Line Chart", path: "/dev/utils/duckdb-line"},
      {name: "DuckDB: Choropleth", path: "/dev/utils/duckdb-choropleth"},
      {name: "DuckDB: Mosaic Cross-Filter", path: "/dev/utils/duckdb-mosaic-flights"},
      {name: "Tabulator", path: "/dev/utils/tabulator"},
      {name: "HuggingFace: Serverless API Inference", path: "/dev/utils/huggingface-serverless-api"},
    ]
  }
  ,{
    name: "MFIN",
    open: true,
    pages: [
      {name: "Equity Research (GRMN)", path: "/mfin/investments/equity-research"},
      {name: "Financial Modeling (AAPL) ", path: "/mfin/cost-managerial-analysis/financial-model-apple"},
      {name: "Stock & Crypto Prices", path: "/mfin/financial-markets/stock-crypto-prices"},
      {name: "Market News", path: "/mfin/financial-markets/market-news"},
      {name: "Economic Calendar", path: "/mfin/economy/economic-calendar"},
      {name: "Financial Statements", path: "/mfin/coporate-finance/financial-statements"},
      {name: "DCF Analysis", path: "/mfin/coporate-finance/company-dcf"},
      {name: "M&A Transactions", path: "/mfin/coporate-finance/ma-transactions"},
      {name: "Foreign Exchange Rates", path: "/mfin/financial-markets/fx-rates"},
      {name: "Commodity Prices", path: "/mfin/financial-markets/commodity-prices"},
      {name: "Bond Prices", path: "/mfin/financial-markets/bond-prices"},
      {name: "IPO Calendar", path: "/mfin/financial-markets/ipo-calendar"},
      {name: "U.S. Macro Indicators", path: "/mfin/economy/macro-indicators"},
      {name: "U.S. Monetary Base", path: "/mfin/economy/monetary-base"},
      {name: "U.S. Mortgage Rates", path: "/mfin/economy/mortgage-rates"},
      // {name: "Data Extraction (Open Server)", path: "/mfin/Data-Extraction/Individual/data-extraction-sql"},
      // {name: "Fall-24: Covid Analysis (DE&Viz)", path: "/mfin/Data-Extraction/Team/data-extraction-team"}
    ]
  }
  
  // ,{
    //   name: "Quantitative Finance",
    //   open: true,
    //   pages: [
      //     {name: "Option Pricing Model", path: "/mfin/quantitative-mfin/option-pricing-model"},
      //     {name: "Naive Arbitrage for Trading", path: "/mfin/quantitative-mfin/naive-arb-trading"}
      //   ]
      // }
      
      ,{
      name: "MBAN",
      open: true,
      pages: [
        {name: "Power BI: H1-B 2024 Lottery", path: "/mban/h1b-2024-analysis"},
        {name: "Tableau: Portfolio Analysis", path: "/mban/data-extraction-individual"},
        {name: "Quarto: Portfolio Construction/Optimization", path: "/mban/portfolio-construction"},
        {name: "Quarto: CAPM Modern Portfolio Theory (Python)", path: "/dev/quarto/CAPM-modern-portfolio-theory/CAPM_modern_portfolio_theory"},
        {name: "Quarto: Governance Indicators (R)", path: "/dev/quarto/world-gov-indicators/world-gov-indicators"},
        {name: "Quarto: HTML Basics (R)", path: "/dev/quarto/html-basics/quarto_html_basics"},
        {name: "Quarto: Stock Explorer (Python)", path: "/dev/quarto/stock-explorer-dashboard/stock_explorer_dashboard"}
        // // {name: "Data Extraction (Open Server)", path: "/Data-Extraction/Individual/data-extraction-sql"},
      // // {name: "Fall-24: Covid Analysis (DE&Viz)", path: "/Data-Extraction/Team/data-extraction-team"}
      // {name: "Apple Financial Model (Excel)", path: "/Cost-Managerial-Analysis/financial-model-apple"}
    ]
  }

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
      align-items: center;
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
    .social-links {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-left: 1rem;
    }
    .social-links a {
      position: relative;
    }
    .social-links a img {
      height: 24px;
    }
    .resume-preview {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 10px;
      width: 600px;
      height: 800px;
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 1000;
      overflow: hidden;
    }
    .resume-preview iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    .social-links a.resume-link:hover .resume-preview {
      opacity: 1;
      pointer-events: auto;
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
    
    <script>
      // Only show social links on index page
      const isIndexPage = window.location.pathname === '/' || window.location.pathname === '/index';
      if (isIndexPage) {
        document.write(\`

        \`);
      }
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
  // duckdb: {extensions: ["spatial", "h3", "pivot_table"]},
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  
};
