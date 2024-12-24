---
theme: dashboard
index: true
toc: false
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

## Latest Market News

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
    displayNews(data, category); // Display the news once fetched
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
  }
}

// This function will display the fetched news on the webpage
function displayNews(newsData, category) {
  const newsContainer = document.getElementById('news-container');
  const categoryContainer = document.createElement('div');
  categoryContainer.classList.add('category-container');
  categoryContainer.innerHTML = `<h2>${category.toUpperCase()} News</h2>`; // Title for category

  // Check if the response contains news articles
  if (Array.isArray(newsData) && newsData.length > 0) {
    newsData.forEach(article => {
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

  // Append the category container to the main news container
  newsContainer.appendChild(categoryContainer);
}

// Initial function to load news for each category
function loadNews() {
  NEWS_CATEGORIES.forEach(category => {
    fetchNews(category); // Fetch and display news for each category
  });
}

// Call the function to load news when the page loads
loadNews();


```

```html
<!DOCTYPE html>
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


```

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
