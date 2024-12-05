---
index: true
source: https://github.com/HebleV/Portfolio-Builder
keywords: 
---

# Portfolio Builder

Let me break this down into separate cells as required by Observable's notebook format:

```js
// First cell - Setup mutable state and data
stocksArray = [];

marketData = ({
  price: {
    "AAPL": 180.50,
    "GOOGL": 140.20,
    "MSFT": 370.30,
    "AMZN": 153.40,
    "NVDA": 495.20
  },
  eps: {
    "AAPL": 6.13,
    "GOOGL": 5.31,
    "MSFT": 11.04,
    "AMZN": 2.90,
    "NVDA": 4.02
  }
})
```

```js
// Second cell - Helper functions
netWorth = d3.sum(stocksArray, d => d.value * d.shares)

portfolioPE = {
  const totalEPS = d3.sum(stocksArray, d => d.eps * d.shares) || 1;
  return netWorth / totalEPS;
}
```

```js
// Third cell - Main display
display = html`
<div class="grid grid-cols-2 gap-4">
  <div class="card p-4">
    <h2>Pick Stocks</h2>
    ${Object.entries(marketData.price).map(([key, value]) => html`
      <div class="flex justify-between items-center py-2">
        <span>${key}</span>
        <span>₹${value}</span>
        <button onclick=${() => {
          stocksArray = [...stocksArray, {
            key,
            value,
            shares: 1,
            eps: marketData.eps[key]
          }];
        }}>Add</button>
      </div>
    `)}
  </div>

  <div class="card p-4">
    <h2>Portfolio</h2>
    <table>
      <thead>
        <tr>
          <th>Stock</th>
          <th>Price</th>
          <th>Shares</th>
          <th>Weight</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${stocksArray.map((stock, i) => html`
          <tr>
            <td>${stock.key}</td>
            <td>₹${stock.value}</td>
            <td>${stock.shares}</td>
            <td>${((stock.value * stock.shares / netWorth) * 100).toFixed(2)}%</td>
            <td>
              <button onclick=${() => {
                stocksArray = stocksArray.filter((_, index) => index !== i);
              }}>Remove</button>
            </td>
          </tr>
        `)}
      </tbody>
    </table>
    
    <div class="mt-4">
      <div>Networth: ₹${netWorth.toFixed(2)}</div>
      <div>P/E Ratio: ${portfolioPE.toFixed(2)}</div>
    </div>
  </div>
</div>
`
```

```js
// Fourth cell - Visualization
chart = Plot.plot({
  height: 300,
  marks: [
    Plot.barY(stocksArray.map(d => ({
      stock: d.key,
      weight: (d.value * d.shares / netWorth) * 100
    })), {
      x: "stock",
      y: "weight",
      fill: "stock"
    })
  ],
  y: {
    label: "Weight (%)"
  }
})
```

Each cell is now properly formatted for Observable, using:
1. Standard cell declarations without external assignments
2. Observable's built-in reactivity
3. D3 for calculations
4. Plot for visualization
5. HTML template literals with proper event handling

Would you like me to add any of these features:
1. Share quantity controls
2. Stock filtering
3. Portfolio analytics
4. Different chart types?