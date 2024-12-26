---
title: Real-Time Stock & Crypto Prices
theme: dashboard
index: true
toc: false
source: https://finnhub.io/docs/api/websocket-trades
keywords: live real time data wss streaming stream socket
---

# Real-Time Stock & Crypto Prices
```js
// Import dependencies and prepare data
import {datetime} from "../assets/components/datetime.js";
import * as XLSX from "npm:xlsx";
const stock_quotes = FileAttachment("../assets/loaders/rust/finnhub_stock_quotes_api.csv").csv();
const datasetname = "stock_data";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

Source: https://finnhub.io/docs/api/websocket-trades

---

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

<h2 class="mt-8 mb-4">Stocks</h2>
<div class="grid grid-cols-4 gap-4 mt-4">
  <div class="card">
    <h2>Meta (META)</h2>
    <div class="big">${meta?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${meta?.timestamp ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Apple (AAPL)</h2>
    <div class="big">${aapl?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${aapl?.timestamp ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Netflix (NFLX)</h2>
    <div class="big">${nflx?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${nflx?.timestamp ?? "--"}</div>
  </div>
  <div class="card">
    <h2>Google (GOOGL)</h2>
    <div class="big">${googl?.price?.toLocaleString("en-US", {style: "currency", currency: "USD"}) ?? "--"}</div>
    <div class="text-sm text-gray-500">${googl?.timestamp ?? "--"}</div>
  </div>
</div>

<h2 class="mt-8 mb-4">Crypto</h2>
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

---

## Data

```js 
// Function to format market cap
function formatMarketCap(value) {
  const num = Number(value);
  if (isNaN(num)) return value;
  
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)} T`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)} B`;
  } else {
    return num > 0 ? `${num}` : "";
  }
}


// Define the columns you want to extract
const desiredColumns = [
  'company_name',
  'symbol',
  'current_price',
  'previous_close',
  'change',
  'percent_change',
  'market_cap',
  'industry',
  'website',
  'ipo_date',
  'exchange',
  // 'country',
  // 'currency',
  // 'high_price', 
  // 'low_price',
  // 'open_price',
];

// Filter and format the data
const data = stock_quotes
  .map(row => {
    const filteredRow = {};
    desiredColumns.forEach(column => {
      if (column === 'percent_change') {
        // Store original value for sorting but display formatted value
        filteredRow[column] = `${Number(row[column]).toFixed(2)}%`;
        filteredRow['_percent_change_sort'] = Number(row[column]); // Hidden field for sorting
      } else if (column === 'market_cap') {
        // Extract the numeric part of the market cap
        const numericPart = parseFloat(row[column].replace(/[$\s]/g, ''));
        filteredRow[column] = row[column];
        filteredRow['_market_cap_sort'] = isNaN(numericPart) ? 0 : numericPart;
      } else {
        filteredRow[column] = row[column];
      }
    });
    return filteredRow;
  })
  // Sort by percent_change (highest to lowest)
  .sort((a, b) => b._percent_change_sort - a._percent_change_sort)
  // Remove the sorting fields from final output
  .map(({ _percent_change_sort, _market_cap_sort, ...rest }) => rest);
```

```js
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
      <div style="display: flex; margin-bottom: 10px;">
        ${Inputs.button(`Download ${datasetname}.xlsx`, {
          reduce() {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet);
            XLSX.writeFile(workbook, `${datasetname}.xlsx`);
          }
        })}
        ${Inputs.button(`Download ${datasetname}.csv`, {
          reduce() {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const csvContent = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `${datasetname}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        })}
      </div>
      ${Inputs.table(data, {
        rows: 30,
        format: {
          website: (x) => x ? htl.html`<a href="${/^https?:\/\//.test(x) ? x : 'https://' + x}" target="_blank">${x}</a>` : '',
          market_cap: formatMarketCap
        }
      })}
    </div>
  </div>
`);
```

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