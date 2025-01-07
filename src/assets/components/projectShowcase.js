import { html } from "htl";

const projects = [
  {
    title: "Economic Calendar",
    description: "Track key economic events and indicators",
    link: "/economy/economic-calendar",
    imageSrc: "https://res.cloudinary.com/dqtnflaeh/image/upload/v1735574068/economic-calendar_xytrad.png"
  },
  {
    title: "Stock & Crypto Prices", 
    description: "Real-time market data and analysis",
    link: "/finance/financial-markets/stock-crypto-prices",
    imageSrc: "https://res.cloudinary.com/dqtnflaeh/image/upload/v1735574068/stock-crypto_yqxzff.png"
  },
  {
    title: "DCF Analysis",
    description: "Discounted Cash Flow valuation tool",  
    link: "/finance/coporate-finance/company-dcf",
    imageSrc: "https://res.cloudinary.com/dqtnflaeh/image/upload/v1735574068/dcf_haitsh.png"
  },
  {
    title: "Portfolio Builder",
    description: "Build and optimize investment portfolios",
    link: "/finance/quantitative-finance/portfolio-builder",
    imageSrc: "https://res.cloudinary.com/dqtnflaeh/image/upload/v1735574068/portfolio_lwj4ab.png"
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
      
      .project-card {
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .project-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .project-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      
      .project-content {
        padding: 1rem;
      }
      
      .project-title {
        margin: 0;
        font-size: 1.25rem;
        color: #333;
      }
      
      .project-description {
        margin: 0.5rem 0 0;
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