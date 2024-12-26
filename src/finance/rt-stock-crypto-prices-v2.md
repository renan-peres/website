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
import {datetime} from "../assets/components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

Source: https://finnhub.io/docs/api/websocket-trades

---

```js
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

// BTC price observer
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

// ETH price observer
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

// SOL price observer
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

// XRP price observer
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

```html
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