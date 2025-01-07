import { html } from "htl";

const projects = [
  {
    title: "Market News",
    description: "Track the lastest news reltated to Financial Markets",
    link: "/finance/financial-markets/market-news",
    imageSrc: "https://res.cloudinary.com/dqtnflaeh/image/upload/v1736278373/thumbnails/market-news_ghounz.png"
  },
  {
    title: "Stock & Crypto Prices", 
    description: "Real-time market data and analysis",
    link: "/finance/financial-markets/stock-crypto-prices",
    imageSrc: "https://res.cloudinary.com/dqtnflaeh/image/upload/v1736277448/thumbnails/stocks-crypto_lc2esm.png"
  },
  {
    title: "DCF Analysis",
    description: "Discounted Cash Flow valuation tool",  
    link: "/finance/coporate-finance/company-dcf",
    imageSrc: "../thumbnails/dcf.png"
  },
  {
    title: "Portfolio Builder",
    description: "Build and optimize investment portfolios",
    link: "/finance/quantitative-finance/portfolio-builder",
    imageSrc: "../thumbnails/portfolio.png"
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
      
      
      .project-image {
        width: 100%;
        height: 300px;
        object-fit: cover;
      }
      
      .project-content {
        padding: 1rem;
      }
      
      .project-title {
        margin: -1rem;
        font-size: 1.25rem;
      }
      
      .project-description {
        margin: 1rem 0 0;
        color: #666;
        font-size: 0.9rem;
      }
    </style>
    
    <div class="project-grid">
      ${projects.map(project => html`
        <a href="${project.link}" class="project-card" style="text-decoration: none;">
          <img src="${project.imageSrc}" alt="${project.title}" class="project-image">
          <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
          </div>
        </a>
      `)}
    </div>
  `;
}