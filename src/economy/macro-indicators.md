---
theme: dashboard
index: true
toc: false
source: https://fred.stlouisfed.org/
keywords: macro economics indicators unemployment gdp inflation exchange rate
sql:
    fred_data: https://raw.githubusercontent.com/renan-peres/datasets/refs/heads/master/data/finance/fred_macro_economy.parquet
---

# Macro Indicators
```js
import {datetime} from "../assets/components/datetime.js";
```

<div class="datetime-container">
  <div id="datetime"></div>
</div>

---

## Key Economic Indicators

```sql id=economicData_historical
FROM fred_data
ORDER BY date DESC;
```

```sql id=economicData_mostRecent
WITH ranked_data AS (
    SELECT *,
        ROW_NUMBER() OVER (PARTITION BY series_id ORDER BY date DESC) AS rn
    FROM fred_data
)

SELECT 
    date,
    series_id,
    series_description,
    value
FROM ranked_data
WHERE rn = 1
ORDER BY date DESC;
```

```js
function formatTableData(data) {
  // Create a mapping of series_id to friendly names
  const seriesMapping = {
    'UNRATE': 'unemployment',
    'GDP': 'gdp',
    'CPIAUCSL': 'inflation',
    'FEDFUNDS': 'fedRate',
    'DEXUSEU': 'exchangeRate'
  };

  // Initialize metrics object
  const metrics = {};
  
  // Convert SQL results to metrics object
  const rows = data.toArray();
  rows.forEach(row => {
    const metricName = seriesMapping[row.series_id];
    if (metricName) {
      metrics[metricName] = {
        value: row.value,
        date: new Date(row.date).toLocaleDateString(),
        format: (val) => {
          switch(metricName) {
            case 'gdp':
              return `$${Number(val).toLocaleString()} B`;
            case 'exchangeRate':
              return Number(val).toFixed(2);
            default:
              return `${Number(val).toFixed(1)}%`;
          }
        }
      };
    }
  });
  
  return metrics;
}

const metrics = formatTableData(economicData_mostRecent);
```

```html
<div class="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
    <div class="card bg-gray-800 p-4 rounded-lg">
        <h2 class="text-gray-400">Unemployment Rate</h2>
        <div class="big text-xl font-bold my-2">
            ${metrics.unemployment?.format(metrics.unemployment?.value) || 'N/A'}
        </div>
        <div class="small text-gray-500">${metrics.unemployment?.date || ''}</div>
    </div>
    <div class="card bg-gray-800 p-4 rounded-lg">
        <h2 class="text-gray-400">GDP</h2>
        <div class="big text-xl font-bold my-2">
            ${metrics.gdp?.format(metrics.gdp?.value) || 'N/A'}
        </div>
        <div class="small text-gray-500">${metrics.gdp?.date || ''}</div>
    </div>
    <div class="card bg-gray-800 p-4 rounded-lg">
        <h2 class="text-gray-400">Inflation Rate</h2>
        <div class="big text-xl font-bold my-2">
            ${metrics.inflation?.format(metrics.inflation?.value) || 'N/A'}
        </div>
        <div class="small text-gray-500">${metrics.inflation?.date || ''}</div>
    </div>
    <div class="card bg-gray-800 p-4 rounded-lg">
        <h2 class="text-gray-400">Fed Funds Rate</h2>
        <div class="big text-xl font-bold my-2">
            ${metrics.fedRate?.format(metrics.fedRate?.value) || 'N/A'}
        </div>
        <div class="small text-gray-500">${metrics.fedRate?.date || ''}</div>
    </div>
    <div class="card bg-gray-800 p-4 rounded-lg">
        <h2 class="text-gray-400">USD/EUR Rate</h2>
        <div class="big text-xl font-bold my-2">
            ${metrics.exchangeRate?.format(metrics.exchangeRate?.value) || 'N/A'}
        </div>
        <div class="small text-gray-500">${metrics.exchangeRate?.date || ''}</div>
    </div>
</div>
```

---

## Historical Trends

```js
// Import Highcharts and modules
import Highcharts from "npm:highcharts";
await import("npm:highcharts/modules/stock");

// Create dashboard containers
const ratesContainer = html`
    <div style="background-color: #ffffff; padding: 20px;">
        <div style="height: 400px;" id="rates-chart"></div>
    </div>
`;

const gdpContainer = html`
    <div style="background-color: #ffffff; padding: 20px; margin-top: 20px;">
        <div style="height: 400px;" id="gdp-chart"></div>
    </div>
`;

display(ratesContainer);
display(gdpContainer);

// Format data for Highcharts
const chartData = {
    unemployment: processedData.map(d => [new Date(d.date).getTime(), d.unemployment_rate]).sort((a, b) => a[0] - b[0]),
    inflation: processedData.map(d => [new Date(d.date).getTime(), d.inflation_rate]).sort((a, b) => a[0] - b[0]),
    fedRate: processedData.map(d => [new Date(d.date).getTime(), d.fed_funds_rate]).sort((a, b) => a[0] - b[0]),
    exchangeRate: processedData.map(d => [new Date(d.date).getTime(), d.exchange_rate_usd_eur]).sort((a, b) => a[0] - b[0]),
    gdp: processedData.map(d => [new Date(d.date).getTime(), d.gdp]).sort((a, b) => a[0] - b[0])
};

// Create rates chart
const ratesChart = Highcharts.stockChart(ratesContainer.querySelector('#rates-chart'), {
    chart: {
        style: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }
    },
    title: {
        text: 'Economic Rates Comparison'
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
    yAxis: [{
        title: {
            text: 'Rate (%)'
        },
        labels: {
            format: '{value}%'
        }
    }, {
        title: {
            text: 'Exchange Rate (EUR/USD)'
        },
        opposite: true
    }],
    tooltip: {
        shared: true,
        split: false
    },
    series: [{
        name: 'Unemployment Rate',
        data: chartData.unemployment,
        color: '#8884d8',
        yAxis: 0
    }, {
        name: 'Inflation Rate',
        data: chartData.inflation,
        color: '#82ca9d',
        yAxis: 0
    }, {
        name: 'Fed Funds Rate',
        data: chartData.fedRate,
        color: '#ffc658',
        yAxis: 0
    }, {
        name: 'USD/EUR Rate',
        data: chartData.exchangeRate,
        color: '#ff7300',
        yAxis: 1
    }]
});

// Create GDP chart
const gdpChart = Highcharts.stockChart(gdpContainer.querySelector('#gdp-chart'), {
    chart: {
        style: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }
    },
    title: {
        text: 'Gross Domestic Product (GDP)'
    },
    rangeSelector: {
        buttons: [{
            type: 'month',
            count: 3,
            text: '3m'
        }, {
            type: 'month',
            count: 6,
            text: '6m'
        }, {
            type: 'year',
            count: 1,
            text: '1y'
        }, {
            type: 'year',
            count: 2,
            text: '2y'
        }, {
            type: 'all',
            text: 'All'
        }],
        selected: 2
    },
    yAxis: {
        title: {
            text: 'GDP (Trillions USD)'
        },
        labels: {
            formatter: function() {
                return '$' + (this.value / 1000).toFixed(1) + 'T';
            }
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>${point.y/1000:.2f}T</b><br/>'
    },
    series: [{
        name: 'GDP',
        data: chartData.gdp,
        color: '#2196f3'
    }]
});

// Add window resize handler
function updateChartSize() {
    ratesChart.reflow();
    gdpChart.reflow();
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
