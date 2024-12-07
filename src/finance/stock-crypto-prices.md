---
theme: dashboard
index: true
toc: false
source: https://observablehq.com/@mbostock/bitcoin-transaction-size
keywords: live real time data wss streaming stream socket
---

# Stock & Crypto Prices
```js
import {datetime} from "../components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

- Crypto: [Bitcoin Ticker](https://codepen.io/HebleV/pen/JygRjL) & [BitFinex](https://docs.bitfinex.com/docs/ws-websocket-checksum) | [CoinAPI](https://docs.coinapi.io/market-data/how-to-guides/real-time-trades-stream-using-websocket-with-different-languages) | [Blockchain](https://blockchain.info/api/api_websocket) | [Polygon](https://polygon.io/docs/stocks/getting-started)
- Stocks: [TwelveData](https://twelvedata.com/account/api-playground)

---

```js
// First cell - Crypto WebSocket and price observers
// Bitfinex WebSocket for BTC
var bitfinexWs = new WebSocket("wss://api.bitfinex.com/ws/2");

bitfinexWs.onopen = function() {
    bitfinexWs.send(JSON.stringify({
        "event": "subscribe",
        "channel": "ticker",
        "pair": "tBTCUSD",
        "freq": "F0"
    }));
};

// CoinAPI WebSocket for ETH and SOL
var coinApiWs = new WebSocket('wss://ws.coinapi.io/v1/');

coinApiWs.onopen = function() {
    coinApiWs.send(JSON.stringify({
        "type": "hello",
        "apikey": "86D96303-EA63-4B03-9863-B94D6F809010",
        "subscribe_data_type": ["trade"],
        "subscribe_filter_symbol_id": [
            "BINANCE_SPOT_ETH_USDT$",
            "BINANCE_SPOT_SOL_USDT$"
        ]
    }));
};

// Bitcoin price from Bitfinex
const btc = Generators.observe((notify) => {
    const messaged = (msg) => {
        const response = JSON.parse(msg.data);
        if (Array.isArray(response) && response[1] && Array.isArray(response[1])) {
            notify(response[1][6]); // Last price
        }
    };
    bitfinexWs.addEventListener("message", messaged);
    return () => bitfinexWs.removeEventListener("message", messaged);
});

// ETH price from CoinAPI
const eth = Generators.observe((notify) => {
    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.type === "trade" && data.symbol_id.includes("ETH_USDT")) {
                notify(parseFloat(data.price)); // Trade price
            }
        } catch (error) {
            console.error('Error parsing ETH price:', error);
        }
    };
    coinApiWs.addEventListener("message", messaged);
    return () => coinApiWs.removeEventListener("message", messaged);
});

// SOL price from CoinAPI
const sol = Generators.observe((notify) => {
    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.type === "trade" && data.symbol_id.includes("SOL_USDT")) {
                notify(parseFloat(data.price)); // Trade price
            }
        } catch (error) {
            console.error('Error parsing SOL price:', error);
        }
    };
    coinApiWs.addEventListener("message", messaged);
    return () => coinApiWs.removeEventListener("message", messaged);
});

// Error handling for CoinAPI
coinApiWs.onerror = function(error) {
    console.error('CoinAPI WebSocket error:', error);
};

// Clean up WebSocket connections
invalidation.then(() => {
    bitfinexWs.close();
    coinApiWs.close();
});
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

## Stocks

```html
<!-- Fifth cell - Display HTML -->
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

---

## Crypto
<div class="grid grid-cols-3 gap-4 mt-4">
    <div class="card">
        <h2>Bitcoin (BTC/USD)</h2>
        <div class="big">${btc?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    </div>
    <div class="card">
        <h2>Ethereum (ETH/USDT)</h2>
        <div class="big">${eth?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    </div>
    <div class="card">
        <h2>Solana (SOL/USDT)</h2>
        <div class="big">${sol?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    </div>
</div>

This is a realtime histogram of the size of recent unconfirmed bitcoin transactions. Transactions bigger than 1,000KB are included in the rightmost bin.

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

## Trading Chart

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