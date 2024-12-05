---
theme: dashboard
index: true
source: https://observablehq.com/@mbostock/bitcoin-transaction-size
keywords: live real time data wss streaming stream socket
---

# WebSocket: Bitcoin transactions

This is a realtime histogram of the size of recent unconfirmed bitcoin transactions. Transactions bigger than 1,000KB are included in the rightmost bin.

Data: [Blockchain](https://blockchain.info/api/api_websocket)
and: [Bitcoin Ticker](https://codepen.io/HebleV/pen/JygRjL)
and: [Polygon](https://polygon.io/docs/stocks/getting-started)
and: [TwelveData](https://twelvedata.com/account/api-playground)

```js
// First cell - Bitcoin WebSocket and price observers
var ws = new WebSocket("wss://api.bitfinex.com/ws/2");

ws.onopen = function() {
    ws.send(JSON.stringify({
        "event": "subscribe",
        "channel": "ticker",
        "pair": "tBTCUSD",
        "freq": "F0"
    }));
};

const btc = Generators.observe((notify) => {
    const messaged = (msg) => {
        const response = JSON.parse(msg.data);
        if (Array.isArray(response) && response[1] && Array.isArray(response[1])) {
            notify(response[1][6]);
        }
    };
    ws.addEventListener("message", messaged);
    return () => ws.removeEventListener("message", messaged);
});

const bid = Generators.observe((notify) => {
    const messaged = (msg) => {
        const response = JSON.parse(msg.data);
        if (Array.isArray(response) && response[1] && Array.isArray(response[1])) {
            notify(response[1][0]);
        }
    };
    ws.addEventListener("message", messaged);
    return () => ws.removeEventListener("message", messaged);
});

const ask = Generators.observe((notify) => {
    const messaged = (msg) => {
        const response = JSON.parse(msg.data);
        if (Array.isArray(response) && response[1] && Array.isArray(response[1])) {
            notify(response[1][2]);
        }
    };
    ws.addEventListener("message", messaged);
    return () => ws.removeEventListener("message", messaged);
});

invalidation.then(() => ws.close());
```

```js
// Second cell - Stock data setup and observers
const API_KEY = 'cffcf251cc0243f198823fa3e34ddf65';
const FOUR_HOURS = 4 * 60 * 60 * 1000;

function getStockPrice(symbol) {
    return fetch(`https://api.twelvedata.com/time_series?apikey=${API_KEY}&interval=4h&symbol=${symbol}&type=stock&previous_close=true`)
        .then(response => response.json())
        .then(data => {
            if (data.values && data.values.length > 0) {
                return parseFloat(data.values[0].close);
            }
            throw new Error('No data available');
        });
}

const meta = Generators.observe((notify) => {
    function updatePrice() {
        getStockPrice('META').then(price => notify(price));
    }
    updatePrice();
    const interval = setInterval(updatePrice, FOUR_HOURS);
    return () => clearInterval(interval);
});

const apple = Generators.observe((notify) => {
    function updatePrice() {
        getStockPrice('AAPL').then(price => notify(price));
    }
    updatePrice();
    const interval = setInterval(updatePrice, FOUR_HOURS);
    return () => clearInterval(interval);
});

const netflix = Generators.observe((notify) => {
    function updatePrice() {
        getStockPrice('NFLX').then(price => notify(price));
    }
    updatePrice();
    const interval = setInterval(updatePrice, FOUR_HOURS);
    return () => clearInterval(interval);
});

const google = Generators.observe((notify) => {
    function updatePrice() {
        getStockPrice('GOOGL').then(price => notify(price));
    }
    updatePrice();
    const interval = setInterval(updatePrice, FOUR_HOURS);
    return () => clearInterval(interval);
});
```

```js
// Third cell - Bitcoin transaction sizes
const sizes = Generators.observe((notify) => {
  const data = [];
  notify(data);
  const socket = new WebSocket("wss://ws.blockchain.info/inv");
  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({op: "unconfirmed_sub"}));
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.op === "utx") {
      data.push(Math.min(999, message.x.size));
      notify(data);
    }
  });
  return () => socket.close();
});
```

```html
<!-- Fifth cell - Display HTML -->
<div class="grid grid-cols-3 gap-4">
  <div class="card">
    <h2>Bitcoin Last Price</h2>
    <div class="big">${btc?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Bid Price</h2>
    <div class="big">${bid?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Ask Price</h2>
    <div class="big">${ask?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
  </div>
</div>

<div class="grid grid-cols-4 gap-4 mt-4">
  <div class="card">
    <h2>Meta (META)</h2>
    <div class="big">${meta?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Apple (AAPL)</h2>
    <div class="big">${apple?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Netflix (NFLX)</h2>
    <div class="big">${netflix?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Google (GOOGL)</h2>
    <div class="big">${google?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
  </div>
</div>
```

```js
// Fourth cell - Chart
const chart = Plot.plot({
  x: {label: "Size (KB)", domain: [0, 1000]},
  marks: [
    Plot.rectY(
      sizes,
      Plot.binX(
        {y: "count"},
        {
          x: Plot.identity,
          domain: [0, 1000],
          thresholds: 50,
          fill: "var(--theme-foreground-focus)"
        }
      )
    ),
    Plot.ruleY([0, 10], {stroke: ["currentColor"]})
  ]
});

display(chart);
```


  <!-- Polygon API -->
  
  <!-- ```js
  // Bitcoin WebSocket (keep your existing working code)
  var ws = new WebSocket("wss://api.bitfinex.com/ws/2");
  
  ws.onopen = function() {
      ws.send(JSON.stringify({
          "event": "subscribe",
          "channel": "ticker",
          "pair": "tBTCUSD",
          "freq": "F0"
      }));
  };
  
  // Bitcoin observers (keep your existing working code)
  const btc = Generators.observe((notify) => {
      const messaged = (msg) => {
          const response = JSON.parse(msg.data);
          if (Array.isArray(response) && response[1] && Array.isArray(response[1])) {
              notify(response[1][6]);
          }
      };
      ws.addEventListener("message", messaged);
      return () => ws.removeEventListener("message", messaged);
  });
  
  const bid = Generators.observe((notify) => {
      const messaged = (msg) => {
          const response = JSON.parse(msg.data);
          if (Array.isArray(response) && response[1] && Array.isArray(response[1])) {
              notify(response[1][0]);
          }
      };
      ws.addEventListener("message", messaged);
      return () => ws.removeEventListener("message", messaged);
  });
  
  const ask = Generators.observe((notify) => {
      const messaged = (msg) => {
          const response = JSON.parse(msg.data);
          if (Array.isArray(response) && response[1] && Array.isArray(response[1])) {
              notify(response[1][2]);
          }
      };
      ws.addEventListener("message", messaged);
      return () => ws.removeEventListener("message", messaged);
  });
  
  // Stock data polling setup
  const API_KEY = 'c0KFyIQaj_jV9vq_dpS5NcmiJEep2XRI';
  
  function getStockPrice(symbol) {
      return fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${API_KEY}`)
          .then(response => response.json())
          .then(data => data.results[0].c);
  }
  
  // Stock observers
  const meta = Generators.observe((notify) => {
      function updatePrice() {
          getStockPrice('META').then(price => notify(price));
      }
      updatePrice(); // Initial fetch
      const interval = setInterval(updatePrice, 12000);
      return () => clearInterval(interval);
  });
  
  const apple = Generators.observe((notify) => {
      function updatePrice() {
          getStockPrice('AAPL').then(price => notify(price));
      }
      updatePrice(); // Initial fetch
      const interval = setInterval(updatePrice, 12000);
      return () => clearInterval(interval);
  });
  
  const netflix = Generators.observe((notify) => {
      function updatePrice() {
          getStockPrice('NFLX').then(price => notify(price));
      }
      updatePrice(); // Initial fetch
      const interval = setInterval(updatePrice, 12000);
      return () => clearInterval(interval);
  });
  
  const google = Generators.observe((notify) => {
      function updatePrice() {
          getStockPrice('GOOGL').then(price => notify(price));
      }
      updatePrice(); // Initial fetch
      const interval = setInterval(updatePrice, 12000);
      return () => clearInterval(interval);
  });
  
  invalidation.then(() => {
      ws.close();
      // Intervals will be cleared by the generator cleanup
  });
  
  // Display both Bitcoin and Stocks HTML
  ``` -->