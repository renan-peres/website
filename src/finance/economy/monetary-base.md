---
theme: dashboard
index: true
toc: false
source: https://fred.stlouisfed.org/
keywords: monetary base money stock currency circulation FRED API
---

# Monetary Base
```js
import {datetime} from "../../assets/components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Current Monetary Metrics

```js
// Load and process the data
const monetaryData = await FileAttachment("../../assets/loaders/js/fred_mb_api.csv").csv({typed: true});

// Make sure we have data and process it into the correct format
const processedData = monetaryData.map(d => ({
  date: d.date,
  monetary_base: +d.monetary_base || 0,
  m1_stock: +d.m1_stock || 0,
  m2_stock: +d.m2_stock || 0,
  currency_circulation: +d.currency_circulation || 0
})).sort((a, b) => new Date(b.date) - new Date(a.date));

// Make current metrics available globally
const currentMetrics = processedData[0] || {
  date: "No data",
  monetary_base: 0,
  m1_stock: 0,
  m2_stock: 0,
  currency_circulation: 0
};

// Create observable variables for the metrics
const monetaryBase = {
  value: currentMetrics.monetary_base,
  date: currentMetrics.date
};

const m1Stock = {
  value: currentMetrics.m1_stock,
  date: currentMetrics.date
};

const m2Stock = {
  value: currentMetrics.m2_stock,
  date: currentMetrics.date
};

const currencyCirculation = {
  value: currentMetrics.currency_circulation,
  date: currentMetrics.date
};
```

```html
<div class="grid grid-cols-4 gap-4 mt-4">
    <div class="card">
        <h2>Monetary Base</h2>
        <div class="big">
            ${monetaryBase?.value ? 
                `$${(monetaryBase.value / 1000).toFixed(2)}B` : 
                "--"}
        </div>
        <div class="small">${monetaryBase?.date ?? ""}</div>
    </div>
    <div class="card">
        <h2>Currency in Circulation</h2>
        <div class="big">
            ${currencyCirculation?.value ? 
                `$${(currencyCirculation.value / 1000).toFixed(2)}B` : 
                "--"}
        </div>
        <div class="small">${currencyCirculation?.date ?? ""}</div>
    </div>
    <div class="card">
        <h2>M1 Money Stock</h2>
        <div class="big">
            ${m1Stock?.value ? 
                `$${(m1Stock.value / 1000).toFixed(2)}B` : 
                "--"}
        </div>
        <div class="small">${m1Stock?.date ?? ""}</div>
    </div>
    <div class="card">
        <h2>M2 Money Stock</h2>
        <div class="big">
            ${m2Stock?.value ? 
                `$${(m2Stock.value / 1000).toFixed(2)}B` : 
                "--"}
        </div>
        <div class="small">${m2Stock?.date ?? ""}</div>
    </div>
</div>
```

---

## Historical Trends

```js
// Import Highcharts and modules
import Highcharts from "npm:highcharts";
await import("npm:highcharts/modules/stock");

// Create dashboard container
const dashboard = html`
    <div style="background-color: #ffffff; padding: 20px;">
        <div style="height: 600px;" id="historical-chart"></div>
    </div>
`;

const historicalContainer = dashboard.querySelector('#historical-chart');
display(dashboard);

// Format data for Highcharts
const chartData = {
    monetary_base: processedData.map(d => [new Date(d.date).getTime(), d.monetary_base]).sort((a, b) => a[0] - b[0]),
    m1_stock: processedData.map(d => [new Date(d.date).getTime(), d.m1_stock]).sort((a, b) => a[0] - b[0]),
    m2_stock: processedData.map(d => [new Date(d.date).getTime(), d.m2_stock]).sort((a, b) => a[0] - b[0]),
    currency_circulation: processedData.map(d => [new Date(d.date).getTime(), d.currency_circulation]).sort((a, b) => a[0] - b[0])
};

// Create historical chart
const historicalChart = Highcharts.stockChart(historicalContainer, {
    chart: {
        style: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }
    },
    title: {
        text: 'Monetary Metrics Historical Comparison'
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
        }],
        selected: 2
    },
    yAxis: {
        labels: {
            formatter: function() {
                return '$' + (this.value / 1000).toFixed(0) + 'B';
            }
        },
        title: {
            text: 'Value (Billions USD)'
        }
    },
    tooltip: {
        shared: true,
        split: false,
        formatter: function() {
            let tooltipText = '<b>' + Highcharts.dateFormat('%Y-%m-%d', this.x) + '</b><br/>';
            this.points.forEach(point => {
                tooltipText += `<span style="color:${point.series.color}">${point.series.name}</span>: $${(point.y / 1000).toFixed(2)}B<br/>`;
            });
            return tooltipText;
        }
    },
    series: [{
        name: 'Monetary Base',
        id: 'BOGMBASE',
        data: chartData.monetary_base,
        color: '#8884d8'
    }, {
        name: 'M1 Money Stock',
        id: 'M1SL',
        data: chartData.m1_stock,
        color: '#82ca9d'
    }, {
        name: 'M2 Money Stock',
        id: 'M2SL',
        data: chartData.m2_stock,
        color: '#ffc658'
    }, {
        name: 'Currency in Circulation',
        id: 'MBCURRCIR',
        data: chartData.currency_circulation,
        color: '#ff7300'
    }]
});

// Add window resize handler
function updateChartSize() {
    historicalChart.reflow();
}
window.addEventListener('resize', updateChartSize);

// Cleanup
invalidation.then(() => {
    window.removeEventListener('resize', updateChartSize);
});
```

```css echo=false
.card {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
}

.card h2 {
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
    color: #666;
}

.card .big {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
}

.card .small {
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.5rem;
}

.datetime-container {
    text-align: right;
    padding: 1rem;
    color: #666;
}
```