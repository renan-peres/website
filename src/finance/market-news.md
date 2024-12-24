---
theme: dashboard
index: true
toc: true
source: https://finnhub.io/docs/api/news
keywords: market news stocks crypto forex mergers real-time updates
---

# Market News
```js
import {datetime} from "../components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

```js
// Set your API Key and categories
const API_KEY = 'ctl0tnpr01qn6d7jqpj0ctl0tnpr01qn6d7jqpjg';
const NEWS_CATEGORIES = ['general', 'forex', 'crypto', 'merger'];

// This function will fetch news data for each category
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

// This function will display the fetched news on the webpage
function displayNews(newsData) {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = ''; // Clear the container

  newsData.forEach(({ category, data }) => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');
    categoryContainer.innerHTML = `<h2>${category.toUpperCase()} News</h2>`;

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((article) => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('article');
        articleElement.innerHTML = `
          <h3><a href="${article.url}" target="_blank">${article.headline}</a></h3>
          <p>${article.summary}</p>
          <p><em>Date: ${new Date(article.datetime * 1000).toLocaleString()}</em></p>
        `;
        categoryContainer.appendChild(articleElement);
      });
    } else {
      categoryContainer.innerHTML += '<p>No news available.</p>';
    }

    newsContainer.appendChild(categoryContainer);
  });
}

// Initial function to load news for each category
async function loadNews() {
  const newsData = await Promise.all(
    NEWS_CATEGORIES.map(fetchNews)
  );
  displayNews(newsData);
}

// Call the function to load news when the page loads
loadNews();
```

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Market News</title>
</head>
<body>
  <div id="news-container"></div> <!-- The container where news will be displayed -->
  
  <script src="news.js"></script> <!-- Include your JavaScript file here -->
</body>
</html>

<div class="wrapper">
  <div class="toc-container" id="toc-container"></div>
  <div id="news-container"></div>
</div>

```css echo=false
/* Add basic styling for the news display */
#news-container {
  margin: 20px;
}

.category-container {
  margin-bottom: 20px;
}

.category-container h2 {
  font-size: 1.5rem;
  font-weight: bold;
}

.article {
  margin-bottom: 15px;
}

.article h3 {
  font-size: 1.2rem;
}

.article p {
  font-size: 1rem;
  color: #555;
}

.article a {
  color: #007bff;
  text-decoration: none;
}

.article a:hover {
  text-decoration: underline;
}

.article em {
  font-size: 0.9rem;
  color: #888;
}

```