---
toc: true
---

```html
<style>

/* Header and container fixes */
.observablehq article {
  max-width: none !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.observablehq-markdown {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
}

h1, h2, h3, h4, h5, h6, p, li, ul, ol {
  width: 100% !important;
  max-width: none !important;
  margin-right: 0 !important;
  padding-right: 0 !important;
}

/* Fixed header container */
.fixed-header {
  position: relative;
  padding-bottom: 0rem;
}

/* Hero section styling */
.hero-banner {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.hero-banner img {
  width: 100%;
  height: auto;
  display: block;
}

/* Enhanced social links */
.social-links-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 0rem 0;
  padding: 1rem 0;
  flex-wrap: wrap;
}

.social-links-container a {
  position: relative;
  transition: transform 0.2s ease;
}

.social-links-container a:hover {
  transform: translateY(-2px);
}

.social-links-container a img {
  height: 32px;
  transition: all 0.2s ease;
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
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
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

.social-links-container a.resume-link:hover .resume-preview {
  opacity: 1;
  pointer-events: auto;
}

@media (max-width: 768px) {
  .social-links-container a img {
    height: 28px;
  }
  .resume-preview {
    width: 90vw;
    height: 80vh;
    max-width: 500px;
  }
}

</style>
```

<div class="">
  <div class="hero-banner">
    <img src="https://res.cloudinary.com/dqtnflaeh/image/upload/v1759764982/11_LinkedIn_Banner_Animated_yo066k.gif" alt="Renan Peres - Finance & Analytics Professional" loading="eager" />
  </div>

  <div class="social-links-container">
    <a href="https://www.linkedin.com/in/renanperes/" aria-label="LinkedIn Profile">
      <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
    </a>
    <a href="mailto:contact@renanperes.com" aria-label="Email Contact">
      <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=mail.ru&logoColor=white" alt="Email"/>
    </a>
    <a href="https://github.com/renan-peres" aria-label="GitHub Profile">
      <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
    </a>
    <a href="https://1drv.ms/b/c/bde1a904e346bc6a/IQRjYbpk7HNYQ4RkHl99dcFzAYhHMkomxaJvva0IOKn0P-4" target="_blank" class="resume-link" aria-label="View Resume">
      <img src="https://img.shields.io/badge/Resume-4285F4?style=for-the-badge&logo=googledocs&logoColor=white" alt="Resume"/>
      <div class="resume-preview">
        <iframe src="https://1drv.ms/b/c/bde1a904e346bc6a/IQRjYbpk7HNYQ4RkHl99dcFzAYhHMkomxaJvva0IOKn0P-4?embed=true" title="Resume Preview"></iframe>
      </div>
    </a>
  </div>
</div>

## About Me

---

Hi, I'm **Renan Peres** — a multilingual **Finance & Analytics** professional with expertise in transforming complex financial data into actionable insights and strategic investment decisions.

Experience includes architecting enterprise-scale analytics environments, developing ETL pipelines, building sophisticated financial models, and constructing optimized multi-asset portfolios tailored to client objectives and market dynamics.

<!-- **What I Bring:**
- 🚀 **Data-Driven Solutions**: Cloud analytics platforms, ETL pipelines, and automated workflows
- 📊 **Financial Expertise**: Portfolio optimization, risk management, and investment strategy evaluation
- 🌍 **Global Perspective**: Fluent in English, Portuguese, and Spanish
- 💡 **Innovation Focus**: Leveraging cutting-edge technology to solve complex financial challenges

## Welcome to My Portfolio!

Hi, I'm **Renan** - Multilingual (English/Portuguese/Spanish) **finance** and **analytics** professional with a deep passion for financial markets and the investment management process. 

Experience includes developing cloud analytics environments, ETL pipelines, automating processes, building financial models, evaluating investment strategies and protecting against risks, and constructing multi-asset portfolios based on a client’s risk tolerance level and market conditions. -->

<style>
.profile-image {
  width: clamp(180px, 35vw, 280px);
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
}

.profile-images-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 2rem 0;
}

.profile-flex {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  margin: 2rem 0;
}

.profile-details {
  flex: 1;
  min-width: 300px;
}

.profile-details h3 {
  color: #1a73e8;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.profile-details ul {
  list-style: none;
  padding-left: 0;
}

.profile-details li {
  padding: 0.4rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.profile-details li:before {
  content: "▹";
  position: absolute;
  left: 0;
  color: #1a73e8;
  font-weight: bold;
}

@media (max-width: 900px) {
  .profile-flex {
    flex-direction: column;
    gap: 2rem;
  }
  .profile-flex > div:last-child {
    flex-direction: column;
    width: 100%;
    max-width: 440px;
  }
  .profile-images-container {
    flex-direction: column;
  }
}

@media (max-width: 700px) {
  .profile-flex {
    flex-direction: column;
    align-items: center;
  }
}

/* Skills Section Styling */
.skills-section {
  margin: 3rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.skill-category {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.skill-category:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.skill-category h3 {
  color: #1a73e8;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: #e8f0fe;
  color: #1967d2;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.2s ease;
}

.skill-tag:hover {
  background: #d2e3fc;
}

/* CTA Section */
.cta-section {
  margin: 3rem 0;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.cta-section h2 {
  color: white;
  margin-top: 0;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.cta-section p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

.cta-button.secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.cta-button.secondary:hover {
  background: rgba(255,255,255,0.1);
}

@media (max-width: 600px) {
  .cta-section h2 {
    font-size: 1.5rem;
  }
  .cta-section p {
    font-size: 1rem;
  }
  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

<div class="profile-flex">
  <div class="profile-details">
  
### 🎓 Education
- Master's in Business Analytics 
- Master's in Finance 
- Bachelor's in Business Management

### 💼 Core Expertise
- Data Engineering & Cloud Analytics
- Portfolio Construction & Optimization
- Financial Analytics & Reporting
- Financial Modeling & Valuation
- Process Automation

### 🌐 Languages
- English (Fluent)
- Portuguese (Native)
- Spanish (Fluent)

</div>
  <div class="profile-images-container">
    <img class="profile-image" src="https://res.cloudinary.com/dqtnflaeh/image/upload/v1760019498/50413116_00201_0296_XLarge_dhikcc.jpg" alt="Professional Headshot" loading="lazy" />
    <img class="profile-image" src="https://res.cloudinary.com/dqtnflaeh/image/upload/v1760020115/IMG_4437_1_mqkd2t.jpg" alt="Renan Peres" loading="lazy" />
    <img class="profile-image" src="https://res.cloudinary.com/dqtnflaeh/image/upload/v1760095581/IMG_5228_bull85.jpg" alt="Microsoft Event" loading="lazy" />
    <img class="profile-image" src="https://res.cloudinary.com/dqtnflaeh/image/upload/v1760024106/IMG_8992_svfopo.jpg" alt="Personal Photo" loading="lazy" />
  </div>
</div>

<!-- ## 🛠️ Technical Skills & Technologies

<div class="skills-section">

<div class="skills-grid">

<div class="skill-category">

### 📊 Data & Analytics
<div class="skill-tags">
  <span class="skill-tag">Python</span>
  <span class="skill-tag">R</span>
  <span class="skill-tag">SQL</span>
  <span class="skill-tag">DuckDB</span>
  <span class="skill-tag">Power BI</span>
  <span class="skill-tag">Tableau</span>
  <span class="skill-tag">Excel</span>
</div>

</div>

<div class="skill-category">

### ☁️ Cloud & DevOps
<div class="skill-tags">
  <span class="skill-tag">AWS</span>
  <span class="skill-tag">Azure</span>
  <span class="skill-tag">Git</span>
  <span class="skill-tag">Docker</span>
  <span class="skill-tag">CI/CD</span>
</div>

</div>

<div class="skill-category">

### 💹 Finance & Markets
<div class="skill-tags">
  <span class="skill-tag">Portfolio Theory</span>
  <span class="skill-tag">Risk Management</span>
  <span class="skill-tag">Financial Modeling</span>
  <span class="skill-tag">DCF Valuation</span>
  <span class="skill-tag">Options Pricing</span>
  <span class="skill-tag">Asset Allocation</span>
</div>

</div>

<div class="skill-category">

### 🌐 Web Development
<div class="skill-tags">
  <span class="skill-tag">JavaScript</span>
  <span class="skill-tag">HTML/CSS</span>
  <span class="skill-tag">Observable</span>
  <span class="skill-tag">D3.js</span>
  <span class="skill-tag">Quarto</span>
</div>

</div>

</div>

</div>

--- -->

## Featured Projects

---

```js
import { ProjectShowcase } from "./assets/components/projectShowcase.js";
display(ProjectShowcase());
```

---
