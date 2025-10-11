import { html } from "htl";

const projects = [
  {
    title: "H1-B Visa Analysis (Power BI)",
    description: "H1-B 2024 Lottery Data Analysis in Power BI with insights on trends in the Finance & Banking industry",
    link: "/mban/h1b-2024-analysis",
  },
  {
    title: "Portfolio Construction & Optimization",
    description: "Dashboard showcasing the process used for building and optimizing investment portfolios",
    link: "/mban/portfolio-construction",
  },
  {
    title: "Portfolio Analysis (Tableau & SQL)",
    description: "SQL-powered portfolio analytics with Tableau visualizations",
    link: "/mban/data-extraction-individual",
  },
  {
    title: "Stock & Crypto Prices",
    description: "Live market quotes for stocks and cryptocurrencies",
    link: "/mfin/financial-markets/stock-crypto-prices",
  },
  {
    title: "Market News",
    description: "Real-time financial market news aggregator",
    link: "/mfin/financial-markets/market-news",
  },
  {
    title: "Macro Economy Indicators",
    description: "Key U.S. macroeconomic metrics dashboard",
    link: "/mfin/economy/macro-indicators",
  },
  {
    title: "Apple Financial Model",
    description: "Detailed financial modeling analysis of Apple Inc.",
    link: "/mfin/cost-managerial-analysis/financial-model-apple",
  },
  {
    title: "Garmin Equity Research", 
    description: "Comprehensive research of Garmin Ltd.",
    link: "/mfin/investments/equity-research"
  },
  {
    title: "U.S. Mortgage Rates",
    description: "Historical and current U.S. mortgage rate trends",
    link: "/mfin/economy/mortgage-rates"
  }
];

export function ProjectShowcase() {
  return html`
    <style>
      .project-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
        padding: 1rem 0;
      }
      
      .project-card {
        text-decoration: none;
        border-radius: 12px;
        overflow: hidden;
        background: white;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      
      .project-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.15);
      }
      
      .iframe-wrapper {
        width: 100%;
        height: 240px;
        overflow: hidden;
        pointer-events: none;
        position: relative;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      .preview-iframe {
        width: 200%;
        height: 200%;
        border: none;
        transform: scale(0.5);
        transform-origin: 0 0;
        opacity: 0.9;
      }
      
      .project-content {
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .project-title {
        margin: 0 0 0.75rem 0;
        font-size: 1.25rem;
        color: #1a1a1a;
        font-weight: 600;
      }

      .project-description {
        margin: 0;
        color: #666;
        font-size: 0.95rem;
        line-height: 1.6;
        flex: 1;
      }
      
      .project-card:hover .project-title {
        color: #1a73e8;
      }
      
      @media (max-width: 768px) {
        .project-grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
      }
    </style>
    
    <div class="project-grid">
      ${projects.map(project => html`
        <a href="${project.link}" class="project-card">
          <div class="iframe-wrapper">
            <iframe 
              src="${project.link}"
              class="preview-iframe"
              title="${project.title} preview"
              loading="lazy"
              sandbox="allow-same-origin allow-scripts"
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