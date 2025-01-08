import { html } from "htl";

const projects = [
  {
    title: "Stock & Crypto Prices", 
    description: "Real-time market data and analysis",
    link: "/finance/financial-markets/stock-crypto-prices",
  },
  {
    title: "Portfolio Analysis",
    description: "Portfolio Analysis combining SQL for Anaysis and Tableau for Visualization",
    link: "/finance/mfin/fall-24/data-extraction-visualization/individual/data-extraction-individual",
  },
  {
    title: "Apple Financial Model",
    description: "A comprehensive Financial Model for Apple Inc.",
    link: "/finance/mfin/fall-24/cost-managerial-analysis/financial-model-apple",
  },
  {
    title: "Market News",
    description: "Track the lastest news reltated to Financial Markets",
    link: "/finance/financial-markets/market-news",
  },
  {
    title: "DCF Analysis",
    description: "Discounted Cash Flow valuation tool",  
    link: "/finance/coporate-finance/company-dcf"
  },
  {
    title: "U.S. Mortgage Rates",
    description: "Current and Historical Mortgage Rates in the U.S.",
    link: "/economy/mortgage-rates"
  }
];

export function ProjectShowcase() {
  return html`
    <style>
      .project-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        padding: 2rem 0;
      }
      
      .iframe-wrapper {
        width: 100%;
        height: 300px;
        overflow: hidden;
        pointer-events: none;
        position: relative;
      }
      
      .preview-iframe {
        width: 200%;
        height: 200%;
        border: none;
        transform: scale(0.5);
        transform-origin: 0 0;
      }
      
      .project-title {
        margin: 1rem 0 0;
        font-size: 1.25rem;
      }

      .project-description {
      }
    </style>
    
    <div class="project-grid">
      ${projects.map(project => html`
        <a href="${project.link}" class="project-card" style="text-decoration: none;">
          <div class="iframe-wrapper">
            <iframe 
              src="${project.link}"
              class="preview-iframe"
              title="${project.title} preview"
              loading="lazy"
              sandbox="allow-same-origin"
            ></iframe>
          </div>
          <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
          </div>
        </a>
      `)}
    </div>
  `;
}