---
index: true
source: https://observablehq.com/@mbostock/bitcoin-transaction-size
keywords: live real time data wss streaming stream socket
---

# WebSocket: Bitcoin transactions

This is a realtime histogram of the size of recent unconfirmed bitcoin transactions. Transactions bigger than 1,000KB are included in the rightmost bin.

Data: [Blockchain](https://blockchain.info/api/api_websocket)
and: [Bitcoin Ticker](https://codepen.io/HebleV/pen/JygRjL)

```js
var ws = new WebSocket("wss://api.bitfinex.com/ws/2");

ws.onopen = function() {
    // Subscribe with maximum frequency
    ws.send(JSON.stringify({
        "event": "subscribe",
        "channel": "ticker",
        "pair": "tBTCUSD",
        "freq": "F0"  // F0 is the fastest frequency
    }));
};

// Last price observer with immediate updates
const btc = Generators.observe((notify) => {
    const messaged = (msg) => {
        const response = JSON.parse(msg.data);
        // Updated array indices for v2 API
        if (Array.isArray(response) && response[1] && Array.isArray(response[1])) {
            notify(response[1][6]); // Last price in v2 API
        }
    };
    ws.addEventListener("message", messaged);
    return () => ws.removeEventListener("message", messaged);
});

// Bid price observer
const bid = Generators.observe((notify) => {
    const messaged = (msg) => {
        const response = JSON.parse(msg.data);
        if (Array.isArray(response) && response[1] && Array.isArray(response[1])) {
            notify(response[1][0]); // Bid price in v2 API
        }
    };
    ws.addEventListener("message", messaged);
    return () => ws.removeEventListener("message", messaged);
});

// Ask price observer
const ask = Generators.observe((notify) => {
    const messaged = (msg) => {
        const response = JSON.parse(msg.data);
        if (Array.isArray(response) && response[1] && Array.isArray(response[1])) {
            notify(response[1][2]); // Ask price in v2 API
        }
    };
    ws.addEventListener("message", messaged);
    return () => ws.removeEventListener("message", messaged);
});

invalidation.then(() => ws.close());

```
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

```js
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

```js
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
