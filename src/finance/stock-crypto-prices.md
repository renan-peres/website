---
title: Real-Time Stock & Crypto Prices
theme: dashboard
index: true
toc: false
source: https://finnhub.io/docs/api/websocket-trades | https://www.tradingview.com/widget-docs/widgets/charts/symbol-overview/ | https://www.coingecko.com/en/widgets | https://www.geckoterminal.com/solana/pools/22WrmyTj8x2TRVQen3fxxi2r4Rn6JDHWoMTpsSmn8RUd
keywords: live real time data wss streaming stream socket
---

# Real-Time Stock & Crypto Prices
```js
// Import dependencies and prepare data
import {datetime} from "../assets/components/datetime.js";
import * as XLSX from "npm:xlsx";
import { getTableFormat, getCustomTableFormat } from "../assets/components/tableFormatting.js"; // Table Formatting & Download Buttons
const formatUrl = (x) => x ? htl.html`<a href="${/^https?:\/\//.test(x) ? x : 'https://' + x}" target="_blank">${x}</a>` : ''; // Helper function for URL formatting
const stock_quotes = FileAttachment("../assets/loaders/rust/finnhub_stock_quotes_api.csv").csv();
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

```js
// Initial stock prices from CSV
const initialStockPrices = {
  'META': null,
  'AAPL': null,
  'NFLX': null,
  'GOOGL': null
};

// Populate initial stock prices from stock_quotes
stock_quotes.forEach(quote => {
  switch(quote.symbol) {
    case 'META':
      initialStockPrices.META = {
        price: parseFloat(quote.current_price),
        timestamp: new Date().toLocaleTimeString()
      };
      break;
    case 'AAPL':
      initialStockPrices.AAPL = {
        price: parseFloat(quote.current_price),
        timestamp: new Date().toLocaleTimeString()
      };
      break;
    case 'NFLX':
      initialStockPrices.NFLX = {
        price: parseFloat(quote.current_price),
        timestamp: new Date().toLocaleTimeString()
      };
      break;
    case 'GOOGL':
      initialStockPrices.GOOGL = {
        price: parseFloat(quote.current_price),
        timestamp: new Date().toLocaleTimeString()
      };
      break;
  }
});

// Create WebSocket connection
const finnhubWs = new WebSocket('wss://ws.finnhub.io?token=ctl0tnpr01qn6d7jqpj0ctl0tnpr01qn6d7jqpjg');

// Subscribe on open
finnhubWs.onopen = function() {
    ['META', 'GOOGL', 'NFLX', 'AAPL', 
     'BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 
     'BINANCE:SOLUSDT', 'BINANCE:XRPUSDT'].forEach(symbol => {
        finnhubWs.send(JSON.stringify({'type':'subscribe', 'symbol': symbol}));
    });
};

// Meta price observer
const meta = Generators.observe((notify) => {
    // Initially set from stock_quotes
    if (initialStockPrices.META) {
        notify(initialStockPrices.META);
    }

    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.data && data.data[0].s === 'META') {
                const trade = data.data[0];
                notify({
                    price: parseFloat(trade.p),
                    timestamp: new Date(trade.t).toLocaleTimeString()
                });
            }
        } catch (error) {
            console.error('Error parsing META price:', error);
        }
    };
    finnhubWs.addEventListener("message", messaged);
    return () => finnhubWs.removeEventListener("message", messaged);
});

// Apple price observer
const aapl = Generators.observe((notify) => {
    // Initially set from stock_quotes
    if (initialStockPrices.AAPL) {
        notify(initialStockPrices.AAPL);
    }

    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.data && data.data[0].s === 'AAPL') {
                const trade = data.data[0];
                notify({
                    price: parseFloat(trade.p),
                    timestamp: new Date(trade.t).toLocaleTimeString()
                });
            }
        } catch (error) {
            console.error('Error parsing AAPL price:', error);
        }
    };
    finnhubWs.addEventListener("message", messaged);
    return () => finnhubWs.removeEventListener("message", messaged);
});

// Netflix price observer
const nflx = Generators.observe((notify) => {
    // Initially set from stock_quotes
    if (initialStockPrices.NFLX) {
        notify(initialStockPrices.NFLX);
    }

    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.data && data.data[0].s === 'NFLX') {
                const trade = data.data[0];
                notify({
                    price: parseFloat(trade.p),
                    timestamp: new Date(trade.t).toLocaleTimeString()
                });
            }
        } catch (error) {
            console.error('Error parsing NFLX price:', error);
        }
    };
    finnhubWs.addEventListener("message", messaged);
    return () => finnhubWs.removeEventListener("message", messaged);
});

// Google price observer
const googl = Generators.observe((notify) => {
    // Initially set from stock_quotes
    if (initialStockPrices.GOOGL) {
        notify(initialStockPrices.GOOGL);
    }

    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.data && data.data[0].s === 'GOOGL') {
                const trade = data.data[0];
                notify({
                    price: parseFloat(trade.p),
                    timestamp: new Date(trade.t).toLocaleTimeString()
                });
            }
        } catch (error) {
            console.error('Error parsing GOOGL price:', error);
        }
    };
    finnhubWs.addEventListener("message", messaged);
    return () => finnhubWs.removeEventListener("message", messaged);
});

// BTC, ETH, SOL, XRP price observers remain the same (no initial CSV data)
const btc = Generators.observe((notify) => {
    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.data && data.data[0].s === 'BINANCE:BTCUSDT') {
                const trade = data.data[0];
                notify({
                    price: parseFloat(trade.p),
                    timestamp: new Date(trade.t).toLocaleTimeString()
                });
            }
        } catch (error) {
            console.error('Error parsing BTC price:', error);
        }
    };
    finnhubWs.addEventListener("message", messaged);
    return () => finnhubWs.removeEventListener("message", messaged);
});

const eth = Generators.observe((notify) => {
    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.data && data.data[0].s === 'BINANCE:ETHUSDT') {
                const trade = data.data[0];
                notify({
                    price: parseFloat(trade.p),
                    timestamp: new Date(trade.t).toLocaleTimeString()
                });
            }
        } catch (error) {
            console.error('Error parsing ETH price:', error);
        }
    };
    finnhubWs.addEventListener("message", messaged);
    return () => finnhubWs.removeEventListener("message", messaged);
});

const sol = Generators.observe((notify) => {
    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.data && data.data[0].s === 'BINANCE:SOLUSDT') {
                const trade = data.data[0];
                notify({
                    price: parseFloat(trade.p),
                    timestamp: new Date(trade.t).toLocaleTimeString()
                });
            }
        } catch (error) {
            console.error('Error parsing SOL price:', error);
        }
    };
    finnhubWs.addEventListener("message", messaged);
    return () => finnhubWs.removeEventListener("message", messaged);
});

const xrp = Generators.observe((notify) => {
    const messaged = (msg) => {
        try {
            const data = JSON.parse(msg.data);
            if (data.data && data.data[0].s === 'BINANCE:XRPUSDT') {
                const trade = data.data[0];
                notify({
                    price: parseFloat(trade.p),
                    timestamp: new Date(trade.t).toLocaleTimeString()
                });
            }
        } catch (error) {
            console.error('Error parsing XRP price:', error);
        }
    };
    finnhubWs.addEventListener("message", messaged);
    return () => finnhubWs.removeEventListener("message", messaged);
});

// Error handling
finnhubWs.onerror = function(error) {
    console.error('Finnhub WebSocket error:', error);
};

// Cleanup
invalidation.then(() => finnhubWs.close());
```

```js

// Select Columns

const selectedStockData = stock_quotes.map(({ 
  symbol, 
  current_price, 
  previous_close, 
  change, 
  percent_change,
  // 'market_cap',
  // 'industry',
  // 'website',
  // 'ipo_date',
  // 'exchange',
  // 'country',
  // 'currency',
  // 'high_price', 
  // 'low_price',
  // 'open_price',
  
}) => ({ 
  symbol, 
  current_price, 
  previous_close, 
  change, 
  percent_change 
}));

// Collapsible Display
display(html`
  <div>
    <button 
      style="margin-bottom: 10px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
      onclick=${(e) => {
        const dataSection = e.target.nextElementSibling;
        const isHidden = dataSection.style.display === 'none';
        
        dataSection.style.display = isHidden ? 'block' : 'none';
        e.target.textContent = isHidden ? 'Hide Data' : 'Show Data';
      }}
    >
      Show Data
    </button>
    
    <div style="display: none;">
      ${(() => {
        // Get the configuration and buttons
        const tableConfig = getCustomTableFormat(selectedStockData, {
          datasetName: 'stock_data',
          rows: 20,
          additionalFormatting: {
            logo: formatUrl,
            url: formatUrl,
            website: formatUrl,
            weburl: formatUrl
          }
        });
        
        return html`
          ${tableConfig.container}
          ${Inputs.table(selectedStockData, tableConfig)}
        `;
      })()}
    </div>
  </div>
`);
```

---

# Stocks 

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
<div class="tradingview-widget-container" style="height: 500px; width: 100%;">
 <div class="tradingview-widget-container__widget" style="height: 100%; width: 100%;"></div>
 <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js" async>
 {
 "symbols": [
   [
     "Apple",
     "AAPL|1D"
   ],
   [
     "Google",
     "GOOGL|1D"
   ],
    [
      "Meta",
      "NASDAQ:META|1D"
    ],
   [
     "Netflix",
     "NASDAQ:NFLX|1D"
   ]
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
<!-- TradingView Widget END -->

---

# Crypto

<!-- <div style="width: 100%; position: relative;">
  <script src="https://widgets.coingecko.com/gecko-coin-price-marquee-widget.js"></script>
  <gecko-coin-price-marquee-widget locale="en" dark-mode="false" outlined="true" coin-ids="bitcoin, ethereum, solana, ripple" initial-currency="usd"></gecko-coin-price-marquee-widget>
</div> -->

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
<div class="tradingview-widget-container" style="height: 500px; width: 100%;">
 <div class="tradingview-widget-container__widget" style="height: 100%; width: 100%;"></div>
 <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js" async>
 {
 "symbols": [
   [
     "BTC/USD",
     "BINANCE:BTCUSD|1D"
   ],
   [
     "ETH/USD",
     "BINANCE:ETHUSD|1D"
   ],
   [
     "SOL/USD",
     "BINANCE:SOLUSD|1D"
   ],
   [
     "XPP/USD",
     "BINANCE:XRPUSD|1D"
   ]
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
<!-- TradingView Widget END -->

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
    <div style="width: 100%; height: 1000px; position: relative;">
      <iframe
        src="https://trading-api-javascript.netlify.app"
        style="width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0;"
        allow="fullscreen"
      ></iframe>
    </div>
  </div>
`;

display(tradingChartSection);
```

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
    <div style="width: 100%; height: 1000px; position: relative;">
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