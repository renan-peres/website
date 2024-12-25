---
theme: dashboard
index: true
toc: false
source: https://observablehq.com/@mbostock/bitcoin-transaction-size
keywords: live real time data wss streaming stream socket
---

# Stocks and Crypto
```js
import {datetime} from "../assets/components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

<!-- - Crypto: [CoinAPI](https://docs.coinapi.io/market-data/how-to-guides/real-time-trades-stream-using-websocket-with-different-languages) | [Bitcoin Ticker](https://codepen.io/HebleV/pen/JygRjL) & [BitFinex](https://docs.bitfinex.com/docs/ws-websocket-checksum) | [Blockchain](https://blockchain.info/api/api_websocket) | [Polygon](https://polygon.io/docs/stocks/getting-started)
- Stocks: [TwelveData](https://twelvedata.com/account/api-playground) -->

---

```js
// First cell - Crypto WebSocket and price observers
// CoinAPI WebSocket for BTC, ETH, SOL and XRP
var coinApiWs = new WebSocket('wss://ws.coinapi.io/v1/');

coinApiWs.onopen = function() {
    coinApiWs.send(JSON.stringify({
        "type": "hello",
        "apikey": "86D96303-EA63-4B03-9863-B94D6F809010",
        "subscribe_data_type": ["trade"],
        "subscribe_filter_symbol_id": [
            "BINANCE_SPOT_BTC_USDT$",
            "BINANCE_SPOT_ETH_USDT$",
            "BINANCE_SPOT_SOL_USDT$",
            "BINANCE_SPOT_XRP_USDT$"
        ]
    }));
};

// Bitcoin price from CoinAPI
const btc = Generators.observe((notify) => {
    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.type === "trade" && data.symbol_id.includes("BTC_USDT")) {
                notify(parseFloat(data.price)); // Trade price
            }
        } catch (error) {
            console.error('Error parsing BTC price:', error);
        }
    };
    coinApiWs.addEventListener("message", messaged);
    return () => coinApiWs.removeEventListener("message", messaged);
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

// XRP price from CoinAPI
const xrp = Generators.observe((notify) => {
    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.type === "trade" && data.symbol_id.includes("XRP_USDT")) {
                notify(parseFloat(data.price));
            }
        } catch (error) {
            console.error('Error parsing XRP price:', error);
        }
    };
    coinApiWs.addEventListener("message", messaged);
    return () => coinApiWs.removeEventListener("message", messaged);
});

// Error handling for CoinAPI
coinApiWs.onerror = function(error) {
    console.error('CoinAPI WebSocket error:', error);
};

// Clean up WebSocket connection
invalidation.then(() => {
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

## Crypto (Real-Time Prices)

<div class="grid grid-cols-4 gap-4 mt-4">
    <div class="card">
        <h2>Bitcoin (BTC/USDT)</h2>
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
    <div class="card">
        <h2>Ripple (XRP/USDT)</h2>
        <div class="big">${xrp?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    </div>
</div>

```js
// Import Highcharts and modules
import Highcharts from "npm:highcharts";
await import("npm:highcharts/modules/stock");

// Create responsive dashboard container
// Only showing the modified container part - rest of the code remains exactly the same

const dashboard = html`
  <div style="background-color: #ffffff; padding: 20px;">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <div style="
      display: grid;
      gap: 20px;
      grid-template-columns: 1fr 1fr;
      /* Increased breakpoint and using min-width instead of max-width */
      @media screen and (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    ">
      <!-- Real-time chart container -->
      <div style="
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        min-width: 0;
        width: 100%;
        box-sizing: border-box;
      ">
        <select style="
          margin-bottom: 10px;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #cccccc;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        ">
          <option value="BTC">Bitcoin (BTC/USDT)</option>
          <option value="ETH">Ethereum (ETH/USDT)</option>
          <option value="SOL">Solana (SOL/USDT)</option>
          <option value="XRP">Ripple (XRP/USDT)</option>
        </select>
        <div id="realtime-chart" style="
          width: 100%;
          height: 500px;
          box-sizing: border-box;
        "></div>
      </div>
      
      <!-- Historical chart container -->
      <div style="
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        min-width: 0;
        width: 100%;
        box-sizing: border-box;
      ">
        <div id="historical-chart" style="
          width: 100%;
          height: 500px;
          box-sizing: border-box;
        "></div>
      </div>
    </div>
  </div>
`;

// Get container references
const selector = dashboard.querySelector('select');
const realtimeContainer = dashboard.querySelector('#realtime-chart');
const historicalContainer = dashboard.querySelector('#historical-chart');
display(dashboard);

// Add responsive handling to charts
function updateChartSizes() {
  realtimeChart.reflow();
  historicalChart.reflow();
}

// Listen for window resize events
window.addEventListener('resize', updateChartSizes);

// Function to get full crypto name
function getCryptoFullName(symbol) {
  const cryptoNames = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'SOL': 'Solana',
    'XRP': 'Ripple'
  };
  return cryptoNames[symbol] || symbol;
}

// Constants
const TICK_INTERVAL = 15000; // 15 seconds for labels
const DURATION = 60000; // 1 minute
let startTime = null;
let priceData = [];

// Create real-time chart
const initialCrypto = selector.value;
const realtimeChart = Highcharts.chart(realtimeContainer, {
  chart: {
    type: 'line',
    animation: false,
    style: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    reflow: true
  },
  title: {
    text: `${getCryptoFullName(initialCrypto)} (${initialCrypto}/USDT) Real-time Price`
  },
  xAxis: {
    type: 'datetime',
    tickInterval: TICK_INTERVAL,
    labels: {
      format: '{value:%H:%M:%S}'
    },
    gridLineColor: '#f3f3f3'
  },
  yAxis: {
    title: {
      text: 'Price (USD)'
    },
    gridLineColor: '#f3f3f3',
    labels: {
      formatter: function() {
        return '$' + this.value.toLocaleString();
      }
    }
  },
  series: [{
    name: `${initialCrypto}/USDT`,
    data: [],
    color: '#2f7ed8',
    step: 'left'
  }],
  legend: {
    enabled: false
  },
  plotOptions: {
    series: {
      animation: false,
      marker: {
        enabled: false
      }
    }
  },
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        yAxis: {
          labels: {
            align: 'left',
            x: 0,
            y: -5
          }
        }
      }
    }]
  }
});

// Sample flags data
const flags = [
  {
    x: Date.UTC(2024, 0, 1),
    title: 'E1',
    text: 'Bitcoin ETF Approval'
  },
  {
    x: Date.UTC(2024, 2, 15),
    title: 'E2',
    text: 'Ethereum Network Upgrade'
  }
];

// Store original price data globally
let historicalPriceData = {
  btc: [],
  eth: [],
  sol: [],
  xrp: []
};

// Create historical chart
const historicalChart = Highcharts.stockChart(historicalContainer, {
  chart: {
    style: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    reflow: true
  },
  title: {
    text: 'Cryptocurrency Performance Comparison'
  },
  subtitle: {
    text: 'Indexed to 100'
  },
  rangeSelector: {
    buttons: [{
      type: 'month',
      count: 1,
      text: '1m'
    }, {
      type: 'month',
      count: 3,
      text: '3m'
    }, {
      type: 'month',
      count: 6,
      text: '6m'
    }, {
      type: 'ytd',
      text: 'YTD'
    }, {
      type: 'year',
      count: 1,
      text: '1y'
    }, {
      type: 'all',
      text: 'All'
    }],
    selected: 2,
    inputEnabled: true
  },
  yAxis: [{
    labels: {
      format: '{value}%'
    },
    title: {
      text: 'Performance (Indexed to 100)'
    },
    height: '60%',
    lineWidth: 2,
    gridLineColor: '#f3f3f3',
    plotLines: [{
      value: 100,
      color: '#999999',
      dashStyle: 'dash',
      width: 1,
      label: {
        text: 'Base Value'
      }
    }]
  }, {
    top: '65%',
    height: '35%',
    offset: 0,
    gridLineColor: '#f3f3f3'
  }],
  tooltip: {
    shared: true,
    split: false,
    formatter: function() {
      let points = this.points || [];
      points.sort((a, b) => b.y - a.y);
      
      let tooltipText = '<b>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '</b><br/>';
      
      points.forEach(point => {
        const series = point.series;
        const symbolKey = series.options.id;
        const originalPrice = historicalPriceData[symbolKey].find(p => p[0] === point.x);
        const price = originalPrice ? originalPrice[1] : null;
        
        tooltipText += `<span style="color:${series.color}">${series.name}</span>: ` +
          `<b>${point.y.toFixed(2)}%</b> ` +
          `(${price ? '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'})<br/>`;
      });
      
      return tooltipText;
    }
  },
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        rangeSelector: {
          inputEnabled: false
        }
      }
    }]
  },
  series: [{
    type: 'line',
    name: 'BTC/USDT',
    id: 'btc',
    color: '#F7931A',
    data: []
  }, {
    type: 'line',
    name: 'ETH/USDT',
    id: 'eth',
    color: '#627EEA',
    data: []
  }, {
    type: 'line',
    name: 'SOL/USDT',
    id: 'sol',
    color: '#00FFA3',
    data: []
  }, {
    type: 'line',
    name: 'XRP/USDT',
    id: 'xrp',
    color: '#23292F',
    data: []
  }, {
    type: 'flags',
    data: flags,
    onSeries: 'btc',
    shape: 'circlepin',
    width: 16
  }]
});

// Function to update chart
function updateRealtimeChart(price, timestamp) {
  if (!price) return;

  if (!startTime) {
    startTime = timestamp;
  }

  priceData.push([timestamp, price]);
  
  const cutoffTime = timestamp - DURATION;
  priceData = priceData.filter(point => point[0] >= cutoffTime);
  
  realtimeChart.series[0].setData(priceData, true, false, false);
  
  const windowEnd = Math.max(timestamp, startTime + DURATION);
  realtimeChart.xAxis[0].setExtremes(
    windowEnd - DURATION,
    windowEnd
  );
}

// Function to normalize data
function normalizeData(data) {
  if (data.length === 0) return [];
  const baseValue = data[0][1];
  return data.map(point => [
    point[0],
    (point[1] / baseValue) * 100
  ]);
}

// Function to fetch historical data
async function fetchHistoricalData(symbol) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  try {
    const response = await fetch(
      `https://api.twelvedata.com/time_series?apikey=${API_KEY}&interval=1day&symbol=${symbol}/USD&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`
    );
    const data = await response.json();
    
    if (data.values) {
      return data.values.map(item => [
        new Date(item.datetime).getTime(),
        parseFloat(item.close)
      ]).reverse();
    }
    return [];
  } catch (error) {
    console.error(`Error fetching ${symbol} data:`, error);
    return [];
  }
}

// WebSocket setup and handling
const ws = new WebSocket('wss://ws.coinapi.io/v1/');

ws.onopen = () => {
  console.log('WebSocket Connected');
  const selectedCrypto = selector.value;
  ws.send(JSON.stringify({
    "type": "hello",
    "apikey": "86D96303-EA63-4B03-9863-B94D6F809010",
    "subscribe_data_type": ["trade"],
    "subscribe_filter_symbol_id": [
      `BINANCE_SPOT_${selectedCrypto}_USDT$`
    ]
  }));
};

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.type === "trade") {
      const selectedCrypto = selector.value;
      if (data.symbol_id.includes(`${selectedCrypto}_USDT`)) {
        const timestamp = new Date(data.time_exchange).getTime();
        updateRealtimeChart(parseFloat(data.price), timestamp);
      }
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
};

// Handle cryptocurrency selection changes
selector.addEventListener('change', (event) => {
  const selectedCrypto = event.target.value;
  
  startTime = null;
  priceData = [];
  realtimeChart.series[0].setData([], true);
  
  realtimeChart.setTitle({
    text: `${getCryptoFullName(selectedCrypto)} (${selectedCrypto}/USDT) Real-time Price`
  });
  realtimeChart.series[0].update({
    name: `${selectedCrypto}/USDT`
  });
  
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      "type": "hello",
      "apikey": "86D96303-EA63-4B03-9863-B94D6F809010",
      "subscribe_data_type": ["trade"],
      "subscribe_filter_symbol_id": [
        `BINANCE_SPOT_${selectedCrypto}_USDT$`
      ]
    }));
  }
});

// Fetch initial historical data
Promise.all([
  fetchHistoricalData('BTC'),
  fetchHistoricalData('ETH'),
  fetchHistoricalData('SOL'),
  fetchHistoricalData('XRP')
]).then(([btcData, ethData, solData, xrpData]) => {
  historicalPriceData.btc = btcData;
  historicalPriceData.eth = ethData;
  historicalPriceData.sol = solData;
  historicalPriceData.xrp = xrpData;
  
  historicalChart.series[0].setData(normalizeData(btcData));
  historicalChart.series[1].setData(normalizeData(ethData));
  historicalChart.series[2].setData(normalizeData(solData));
  historicalChart.series[3].setData(normalizeData(xrpData));
});

// Cleanup
invalidation.then(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  window.removeEventListener('resize', updateChartSizes);
});
```

<!-- This is a realtime histogram of the size of recent unconfirmed bitcoin transactions. Transactions bigger than 1,000KB are included in the rightmost bin.

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
``` -->

---

## TradingView

```js
// Trading Chart Section with Fullscreen Button
const tradingChartSection = html`
  <div>
    <button 
      style="margin-bottom: 10px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
      onclick=${(e) => {
        const iframe = e.target.parentElement.querySelector('iframe');
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
          iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
          iframe.msRequestFullscreen();
        }
      }}>
      Fullscreen
    </button>
    <div style="width: 100%; height: 600px; position: relative;">
      <iframe
        src="https://trading-api-javascript.netlify.app"
        style="width: 100%; height: 1000px; border: none; position: absolute; top: 0; left: 0;"
        allow="fullscreen"
      ></iframe>
    </div>
  </div>
`;

display(tradingChartSection);
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
