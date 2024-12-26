---
title: Market News & Word Count Analysis
index: true
toc: true
source: https://finnhub.io/docs/api/news
keywords: market news stocks crypto forex mergers real-time updates word-analysis
---

# Market News & Word Count Analysis

```js
import {datetime} from "../assets/components/datetime.js";
// Import d3 from Observable
const d3 = await import("https://cdn.jsdelivr.net/npm/d3@7/+esm");
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

<br>

<div class="filter-section">
  <input type="text" id="text-filter" placeholder="Filter articles by keyword..." />
</div>

---

```js
const API_KEY = 'ctl0tnpr01qn6d7jqpj0ctl0tnpr01qn6d7jqpjg';
const NEWS_CATEGORIES = ['general', 'forex', 'crypto', 'merger'];

async function fetchNews(category) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=${category}&token=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    return { category, data };
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    return { category, data: [] };
  }
}

// Keep track of the current news data globally
let currentNewsData = [];
let selectedWord = [];

// Word Bubble Chart Component with interaction
function createWordBubbleChart(container, text) {
  if (!text) return;

  // Define stopwords (filler words to exclude)
  const stopwords = new Set([
    'your', 'here', 'what', 'just', 'have', 'their', 'says', 'said', 'than',
    'first', 'heres','since','into', 'from', 'over', 'will', 'about', 'that', 'this', 'these',
    'those', 'with', 'which', 'would', 'could', 'should', 'there', 'amid', 'newswire', 'like',
    'where', 'when', 'were', 'they', 'them', 'then', 'been', 'being',
    'also', 'after', 'other', 'such', 'some', 'only', 'more', 'most',
    'much', 'many', 'very', 'been', 'before', 'both', 'through'
  ]);

  // Process text and count words, excluding stopwords
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopwords.has(word));

  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  const data = Object.entries(wordCounts)
    .map(([word, count]) => ({
      name: word,
      value: count
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50);

  const width = 928;
  const height = 928;
  const margin = 1;

  container.innerHTML = '';

  const svg = d3.create("svg")
    .attr("viewBox", [-margin, -margin, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; background: white;");

  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const pack = d3.pack()
    .size([width - margin * 2, height - margin * 2])
    .padding(3);

  const root = pack(d3.hierarchy({ children: data }).sum(d => d.value));

  const node = svg.append("g")
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .attr("cursor", "pointer")
    .on("click", (event, d) => {
      const word = d.data.name;

      // Toggle word selection with CTRL
      if (event.ctrlKey) {
        if (selectedWord.includes(word)) {
          selectedWord = selectedWord.filter(w => w !== word);
        } else {
          selectedWord.push(word);
        }
      } else {
        selectedWord = [word]; // Normal click resets selection
      }

      updateNewsDisplay(currentNewsData);

      // Update visual feedback
      svg.selectAll("circle")
        .attr("stroke", d => selectedWord.includes(d.data.name) ? "#000" : "none")
        .attr("stroke-width", d => selectedWord.includes(d.data.name) ? 2 : 0);
    })
    .on("mouseover", function() {
      d3.select(this).attr("opacity", 0.8);
    })
    .on("mouseout", function() {
      d3.select(this).attr("opacity", 1);
    });

  node.append("circle")
    .attr("fill-opacity", 0.7)
    .attr("fill", d => color(d.value))
    .attr("r", d => d.r)
    .attr("stroke", d => selectedWord.includes(d.data.name) ? "#000" : "none")
    .attr("stroke-width", d => selectedWord.includes(d.data.name) ? 2 : 0);

  node.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .attr("font-size", d => Math.min(d.r * 0.4, 16))
    .text(d => d.data.name);

  node.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "1.5em")
    .attr("font-size", d => Math.min(d.r * 0.3, 12))
    .attr("opacity", 0.7)
    .text(d => d.data.value);

  container.appendChild(svg.node());
}

// Update the news filtering logic
function updateNewsDisplay(newsData) {
  const newsContainer = document.getElementById('news-container');
  const textFilterInput = document.getElementById('text-filter').value.toLowerCase();
  newsContainer.innerHTML = '';

  let filteredArticlesCount = 0;

  newsData.forEach(({ category, data }) => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const filteredData = data.filter(article => {
      const searchText = `${article.headline} ${article.summary}`.toLowerCase();

      const matchesWords = selectedWord.length === 0 || selectedWord.some(word => searchText.includes(word));
      const matchesTextFilter = !textFilterInput || searchText.includes(textFilterInput);

      return matchesWords && matchesTextFilter;
    });

    if (filteredData.length > 0) {
      categoryContainer.innerHTML = `
        <h2>${category.toUpperCase()} News ${selectedWord.length > 0 || textFilterInput ? 
          `<span class="filter-info">(Filtered)</span>` : ''}</h2>
      `;

      filteredData.forEach((article) => {
        filteredArticlesCount++;
        const articleElement = document.createElement('div');
        articleElement.classList.add('article');

        let headline = article.headline;
        let summary = article.summary;

        if (selectedWord.length > 0 || textFilterInput) {
          const highlightRegex = new RegExp(`(${[...selectedWord, textFilterInput].join('|')})`, 'gi');
          headline = headline.replace(highlightRegex, match => `<mark>${match}</mark>`);
          summary = summary.replace(highlightRegex, match => `<mark>${match}</mark>`);
        }

        articleElement.innerHTML = `
          <h3><a href="${article.url}" target="_blank">${headline}</a></h3>
          <p>${summary}</p>
          <p><em>Date: ${new Date(article.datetime * 1000).toLocaleString()}</em></p>
        `;
        categoryContainer.appendChild(articleElement);
      });

      newsContainer.appendChild(categoryContainer);
    }
  });

  if ((selectedWord.length > 0 || textFilterInput) && filteredArticlesCount === 0) {
    newsContainer.innerHTML = `
      <div class="no-results">
        <p>No articles found matching your filters</p>
      </div>
    `;
  }
}

document.getElementById('text-filter').addEventListener('input', () => {
  updateNewsDisplay(currentNewsData);
});

async function loadNews() {
  const newsData = await Promise.all(
    NEWS_CATEGORIES.map(fetchNews)
  );
  displayNews(newsData);
}

function displayNews(newsData) {
  currentNewsData = newsData;
  const wordAnalysisContainer = document.getElementById('word-analysis-container');

  let allText = '';
  newsData.forEach(({ data }) => {
    if (Array.isArray(data)) {
      data.forEach((article) => {
        allText += ` ${article.headline} ${article.summary}`;
      });
    }
  });

  createWordBubbleChart(wordAnalysisContainer, allText);
  updateNewsDisplay(newsData);
}

loadNews();
```

<html lang="en">
<div class="analysis-section">
  <h2 class="word-analysis-title">Word Frequency Analysis</h2>
  <p class="word-analysis-description">Click on any word to filter articles containing that word. Press CTRL + multiple words (in case you want to filter for multiple keywords).</p>
  <div id="word-analysis-container" class="bubble-chart-container"></div>
</div>
<br>
<div class="news-section">
  <h2 class="news-title"> </h2>
  <div id="news-container"></div>
</div>
</html>

```html
<style>
  
h1, h2, h3, h4, h5, h6, p, li, ul, ol {
  width: 100% !important;
  max-width: none !important;
  margin-right: 0 !important;
  padding-right: 0 !important;
}

</style>
```

```css echo=false
/* Main layout sections */
.analysis-section {
  margin: 20px auto;
  max-width: 1200px;
  padding: 0 20px;
}

.news-section {
  margin: 40px auto;
  max-width: 1200px;
  padding: 0 20px;
}

.news-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #2c3e50;
}

#word-analysis-container {
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  position: relative;
}

#news-container {
  margin: 20px 0;
}

.category-container {
  margin-bottom: 20px;
}

.category-container h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-info {
  font-size: 1rem;
  color: #666;
  font-weight: normal;
}

.article {
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.article h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.article p {
  font-size: 1rem;
  color: #555;
  line-height: 1.5;
}

.article a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s;
}

.article a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.article em {
  font-size: 0.9rem;
  color: #888;
}

/* Word analysis specific styles */
.word-analysis-title {
  font-size: 1.8rem;
  margin: 40px 20px 10px;
  color: #2c3e50;
}

.word-analysis-description {
  margin: 0 20px 20px;
  color: #666;
  font-size: 1rem;
}

.bubble-chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Highlight style for filtered words */
mark {
  background-color: #fff3cd;
  padding: 0 2px;
  border-radius: 2px;
}

/* No results message */
.no-results {
  text-align: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

/* Clear filter button */
.clear-filter-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-filter-btn:hover {
  background-color: #5a6268;
}
```