---
title: Real-Time Stock & Crypto Prices
theme: dashboard
index: true
toc: false
source: https://finnhub.io/docs/api/websocket-trades | https://www.tradingview.com/widget-docs/widgets/charts/symbol-overview/ | https://www.coingecko.com/en/widgets | https://www.geckoterminal.com/solana/pools/22WrmyTj8x2TRVQen3fxxi2r4Rn6JDHWoMTpsSmn8RUd
keywords: live real time data wss streaming stream socket
---

```js
import { datetime } from "../assets/components/datetime.js";
import {getDefaultClient} from "observablehq:stdlib/duckdb";
import * as XLSX from "npm:xlsx";
import { DEFAULT_CONFIG, getCustomTableFormat, formatUrl, createCollapsibleSection } from "../assets/components/tableFormatting.js";
import * as htl from "htl";
import * as arrow from "apache-arrow";

const db = await getDefaultClient();
```

```js
function toLocaleTimeString(timestamp) {
  try {
    const date = typeof timestamp === 'string' 
      ? new Date(timestamp)
      : timestamp;
      
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'  // Or your preferred timezone
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '--:--:-- --';
  }
}
```

# Real-Time Stock & Crypto Prices

<div class="datetime-container"> <div id="datetime"></div> </div>

---

# Stocks

<!-- ```js
const stock_quotes = await FileAttachment("../assets/loaders/rust/parquet/finnhub_stock_quotes_api.parquet").parquet()
  .then(table => Array.from(table, row => ({
    symbol: row.symbol,
    current_price: row.current_price,
    previous_close: row.previous_close,
    change: row.change,
    percent_change: row.percent_change
  })))
  .catch(error => {
    console.error("Error loading Parquet file:", error);
    return [];
  });

stock_quotes.forEach(quote => {
  const priceData = {
    price: Number(quote.current_price),
    timestamp: new Date().toLocaleTimeString()
  };
  if (initialStockPrices.hasOwnProperty(quote.symbol)) {
    initialStockPrices[quote.symbol] = priceData;
  }
});

const selectedStockData = stock_quotes.map(({ symbol, current_price, previous_close, change, percent_change }) => ({
  symbol, current_price, previous_close, change, percent_change
}));
``` -->

```sql id = stock_quotes display = false
ATTACH 's3://aws-test-duckdb/duckdb/stock_quotes.db' AS s3;
USE s3;

SELECT 
    symbol,
    percent_change,
    current_price,
    previous_close,
    open_price,
    high_price,
    low_price,
    CAST(CAST(timestamp AS DATETIME) - INTERVAL '5 hours' AS VARCHAR) as timestamp
FROM quotes
ORDER BY percent_change DESC;
```

```js
// Get tables
const initial_stock_data = await db.sql`
USE s3;

SELECT 
    symbol,
    current_price AS price,
    CAST(timestamp AS VARCHAR) as timestamp
FROM quotes
WHERE symbol IN ('META', 'AAPL', 'NFLX', 'GOOGL')
ORDER BY symbol;
`;

const initialStockPrices = {
  'META': null, 
  'AAPL': null,
  'NFLX': null,
  'GOOGL': null
};

// Populate initial prices from SQL query results
for (const row of initial_stock_data) {
  if (initialStockPrices.hasOwnProperty(row.symbol)) {
    initialStockPrices[row.symbol] = {
      price: Number(row.price),
      timestamp: toLocaleTimeString(row.timestamp)
    };
  }
}
```

```js
const finnhubWs = new WebSocket('wss://ws.finnhub.io?token=ctl0tnpr01qn6d7jqpj0ctl0tnpr01qn6d7jqpjg');

finnhubWs.onopen = () => {
  ['META', 'GOOGL', 'NFLX', 'AAPL', 'BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:SOLUSDT', 'BINANCE:XRPUSDT'].forEach(symbol => {
    finnhubWs.send(JSON.stringify({ 'type': 'subscribe', 'symbol': symbol }));
  });
};

const createObserver = (symbol, initialData) => Generators.observe((notify) => {
  if (initialData) notify(initialData);
  const messaged = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      if (data.data && data.data[0].s === symbol) {
        const trade = data.data[0];
        notify({
          price: Number(trade.p),
          timestamp: new Date(trade.t).toLocaleTimeString()
        });
      }
    } catch (error) {
      console.error(`Error parsing ${symbol} price:`, error);
    }
  };
  finnhubWs.addEventListener("message", messaged);
  return () => finnhubWs.removeEventListener("message", messaged);
});

const meta = createObserver('META', initialStockPrices.META);
const aapl = createObserver('AAPL', initialStockPrices.AAPL);
const nflx = createObserver('NFLX', initialStockPrices.NFLX);
const googl = createObserver('GOOGL', initialStockPrices.GOOGL);

const btc = createObserver('BINANCE:BTCUSDT');
const eth = createObserver('BINANCE:ETHUSDT');
const sol = createObserver('BINANCE:SOLUSDT');
const xrp = createObserver('BINANCE:XRPUSDT');

finnhubWs.onerror = (error) => console.error('Finnhub WebSocket error:', error);

invalidation.then(() => finnhubWs.close());
```

```js
const tableConfig = getCustomTableFormat(stock_quotes, {
  ...DEFAULT_CONFIG,
  datasetName: 'stock_data'
});

const collapsibleContent = htl.html`
  ${tableConfig.container}
  ${Inputs.table(tableConfig.dataArray, tableConfig)}
`;

display(createCollapsibleSection(collapsibleContent, "Show Data", "hide"));
```

<div class="grid grid-cols-4 gap-4 mt-4">
  <div class="card">
    <h2>Apple (AAPL)</h2>
    <div class="big">${aapl?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${aapl?.timestamp ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Google (GOOGL)</h2>
    <div class="big">${googl?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${googl?.timestamp ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Meta (META)</h2>
    <div class="big">${meta?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${meta?.timestamp ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Netflix (NFLX)</h2>
    <div class="big">${nflx?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${nflx?.timestamp ?? "--"}</div>
  </div>
</div>

<!-- TradingView Widget BEGIN -->
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TradingView Widgets Side by Side</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        .charts-container {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            gap: 16px;
            padding: 16px;
        }
        .chart-wrapper {
            flex: 1;
            min-width: 300px;
        }
        .tradingview-widget-container {
            width: 100%;
            height: 500px;
        }
        /* Responsive design */
        @media (max-width: 1024px) {
            .charts-container {
                flex-direction: column;
            }
            .chart-wrapper {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="charts-container">
        <div class="chart-wrapper">
            <!-- First TradingView Widget (Symbol Overview) -->
            <div class="tradingview-widget-container" style="height: 500px; width: 100%;">
                <div class="tradingview-widget-container__widget" style="height: 100%; width: 100%;"></div>
                <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js" async>
                {
                    "symbols": [
                        ["Apple", "AAPL|1D"],
                        ["Google", "GOOGL|1D"],
                        ["Meta", "NASDAQ:META|1D"],
                        ["Netflix", "NASDAQ:NFLX|1D"]
                    ],
                    "chartOnly": false,
                    "width": "100%",
                    "height": 500,
                    "locale": "en",
                    "colorTheme": "dark",
                    "autosize": true,
                    "showVolume": false,
                    "showMA": false,
                    "hideDateRanges": false,
                    "hideMarketStatus": false,
                    "hideSymbolLogo": false,
                    "scalePosition": "right",
                    "scaleMode": "Normal",
                    "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
                    "fontSize": "10",
                    "noTimeScale": false,
                    "valuesTracking": "1",
                    "changeMode": "price-and-percent",
                    "calendar": true,
                    "chartType": "area",
                    "maLineColor": "#2962FF",
                    "maLineWidth": 1,
                    "maLength": 9,
                    "headerFontSize": "medium",
                    "lineWidth": 2,
                    "lineType": 0,
                    "dateRanges": [
                        "1d|1",
                        "1m|30",
                        "3m|60",
                        "12m|1D",
                        "60m|1W",
                        "all|1M"
                    ]
                }
                </script>
            </div>
        </div>
        <div class="chart-wrapper">
            <!-- Second TradingView Widget (Advanced Chart) -->
            <div class="tradingview-widget-container">
                <div class="tradingview-widget-container__widget"></div>
                <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
                {
                    "width": "100%",
                    "height": 500,
                    "symbol": "NASDAQ:AAPL",
                    "interval": "D",
                    "timezone": "exchange",
                    "theme": "dark",
                    "backgroundColor": "rgba(22, 26, 37, 1)",
                    "style": "1",
                    "withdateranges": true,
                    "hide_side_toolbar": false,
                    "allow_symbol_change": true,
                    "save_image": true,
                    "locale": "en",
                    "watchlist": [
                        "AAPL",
                        "GOOG",
                        "META",
                        "NFLX"
                    ],
                    "studies": [
                        "ROC@tv-basicstudies",
                        "StochasticRSI@tv-basicstudies",
                        "MASimple@tv-basicstudies"
                    ],
                    "locale": "en",
                    "show_popup_button": true,
                    "popup_width": "1000",
                    "popup_height": "650",
                    "calendar": true,
                    "support_host": "https://www.tradingview.com"
                }
                </script>
            </div>
        </div>
    </div>
</body>

---

# Crypto

<div class="grid grid-cols-4 gap-4 mt-4">
  <div class="card">
    <h2>Bitcoin (BTC)</h2>
    <div class="big">${btc?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${btc?.timestamp ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Ethereum (ETH)</h2>
    <div class="big">${eth?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${eth?.timestamp ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Solana (SOL)</h2>
    <div class="big">${sol?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${sol?.timestamp ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Ripple (XRP)</h2>
    <div class="big">${xrp?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${xrp?.timestamp ?? "--"}</div>
  </div>
</div>

<!-- TradingView Widget BEGIN -->
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TradingView Widgets Side by Side</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        .charts-container {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            gap: 16px;
            padding: 16px;
        }
        .chart-wrapper {
            flex: 1;
            min-width: 300px;
        }
        .tradingview-widget-container {
            width: 100%;
            height: 500px;
        }
        /* Responsive design */
        @media (max-width: 1024px) {
            .charts-container {
                flex-direction: column;
            }
            .chart-wrapper {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="charts-container">
        <div class="chart-wrapper">
            <!-- First TradingView Widget (Symbol Overview) -->
            <div class="tradingview-widget-container">
                <div class="tradingview-widget-container__widget"></div>
                <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js" async>
                {
                    "symbols": [
                        ["BTC/USD", "BINANCE:BTCUSD|1D"],
                        ["ETH/USD", "BINANCE:ETHUSD|1D"],
                        ["SOL/USD", "BINANCE:SOLUSD|1D"],
                        ["XRP/USD", "BINANCE:XRPUSD|1D"]
                    ],
                    "chartOnly": false,
                    "width": "100%",
                    "height": 500,
                    "locale": "en",
                    "colorTheme": "dark",
                    "autosize": true,
                    "showVolume": false,
                    "showMA": false,
                    "hideDateRanges": false,
                    "hideMarketStatus": false,
                    "hideSymbolLogo": false,
                    "scalePosition": "right",
                    "scaleMode": "Normal",
                    "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
                    "fontSize": "10",
                    "noTimeScale": false,
                    "valuesTracking": "1",
                    "changeMode": "price-and-percent",
                    "chartType": "area",
                    "maLineColor": "#2962FF",
                    "maLineWidth": 1,
                    "maLength": 9,
                    "headerFontSize": "medium",
                    "lineWidth": 2,
                    "lineType": 0,
                    "dateRanges": [
                        "1d|1",
                        "1m|30",
                        "3m|60",
                        "12m|1D",
                        "60m|1W",
                        "all|1M"
                    ]
                }
                </script>
            </div>
        </div>
        <div class="chart-wrapper">
            <!-- Second TradingView Widget (Advanced Chart) -->
            <div class="tradingview-widget-container">
                <div class="tradingview-widget-container__widget"></div>
                <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
                {
                    "width": "100%",
                    "height": 500,
                    "symbol": "BINANCE:BTCUSD",
                    "interval": "D",
                    "timezone": "exchange",
                    "theme": "dark",
                    "backgroundColor": "rgba(22, 26, 37, 1)",
                    "style": "1",
                    "withdateranges": true,
                    "hide_side_toolbar": false,
                    "allow_symbol_change": true,
                    "save_image": true,
                    "locale": "en",
                    "watchlist": [
                        "BINANCE:BTCUSD",
                        "BINANCE:ETHUSD",
                        "BINANCE:SOLUSD",
                        "BINANCE:XRPUSD"
                    ],
                    "studies": [
                        "ROC@tv-basicstudies",
                        "StochasticRSI@tv-basicstudies",
                        "MASimple@tv-basicstudies"
                    ],
                    "show_popup_button": true,
                    "popup_width": "1000",
                    "popup_height": "650",
                    "calendar": true,
                    "support_host": "https://www.tradingview.com"
                }
                </script>
            </div>
        </div>
    </div>
</body>

<!-- ```js
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
    <div style="width: 100%; height: 800px; position: relative;">
      <iframe
        src="https://trading-api-javascript.netlify.app"
        style="width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0;"
        allow="fullscreen"
      ></iframe>
    </div>
  </div>
`;

display(tradingChartSection);
``` -->

---

## GeckoTerminal

```js
const geckoterminal = html`
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
    <div style="width: 100%; height: 800px; position: relative;">
    <iframe height="100%" width="100%" 
        id="geckoterminal-embed" 
        title="GeckoTerminal Embed"
        src="https://www.geckoterminal.com/chain-rankings"
        frameborder="0" allow="clipboard-write" allowfullscreen></iframe>
    </div>
  </div>
`;

display(geckoterminal);
```

<!-- ```js
const geckoterminal = html`
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
    <iframe height="100%" width="100%" 
        id="geckoterminal-embed" 
        title="GeckoTerminal Embed"
        // src="https://www.geckoterminal.com/solana/pools/22WrmyTj8x2TRVQen3fxxi2r4Rn6JDHWoMTpsSmn8RUd?embed=1&info=1&swaps=1&grayscale=0&light_chart=0"
        src="https://www.geckoterminal.com/chain-rankings"
        frameborder="0" allow="clipboard-write" allowfullscreen></iframe>
    </div>
  </div>
`;

display(geckoterminal);
``` -->