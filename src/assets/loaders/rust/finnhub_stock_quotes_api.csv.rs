//! ```cargo
//! [dependencies]
//! reqwest = { version = "0.11", features = ["json"] }
//! serde = { version = "1.0", features = ["derive"] }
//! serde_json = "1.0"
//! tokio = { version = "1.0", features = ["full"] }
//! csv = "1.2"
//! futures = "0.3"
//! ```

use serde::{Deserialize};
use std::error::Error;
use std::time::Instant;
use futures::future;
use std::collections::HashMap;

#[derive(Debug, Deserialize, Clone)]
struct QuoteResponse {
    c: f64,    // Current price
    d: f64,    // Change
    dp: f64,   // Percent change
    h: f64,    // High price of the day
    l: f64,    // Low price of the day
    o: f64,    // Open price of the day
    pc: f64,   // Previous close price
}

#[derive(Debug, Deserialize, Clone)]
struct CompanyProfile {
    country: Option<String>,
    currency: Option<String>,
    exchange: Option<String>,
    ipo: Option<String>,
    #[serde(rename = "marketCapitalization")]
    market_capitalization: Option<f64>,
    name: Option<String>,
    phone: Option<String>,
    #[serde(rename = "shareOutstanding")]
    share_outstanding: Option<f64>,
    ticker: String,
    weburl: Option<String>,
    #[serde(rename = "finnhubIndustry")]
    industry: Option<String>,
}

#[derive(Debug)]
struct StockData {
    symbol: String,
    quote: QuoteResponse,
    profile: Option<CompanyProfile>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let start = Instant::now();
    let api_key = "ctl0tnpr01qn6d7jqpj0ctl0tnpr01qn6d7jqpjg";
    
    let symbols = vec![
        // Technology
        "AAPL", "MSFT", "GOOGL", "GOOG", "META", "NVDA", "AVGO", "ORCL", "CRM", "ACN", "ADBE", "CSCO", "INTC",
        // Communication Services
        "NFLX", "DIS", "CMCSA", "VZ", "T",
        // Consumer Discretionary
        "AMZN", "TSLA", "HD", "MCD", "NKE", "SBUX", "TGT", "LOW",
        // Consumer Staples
        "WMT", "PG", "KO", "PEP", "COST",
        // Financials
        "BRK-B", "JPM", "BAC", "WFC", "GS", "MS", "BLK",
        // Healthcare
        "UNH", "JNJ", "PFE", "ABBV", "MRK", "LLY",
        // Industrials
        "CAT", "BA", "HON", "UPS", "RTX", "GE",
        // Energy
        "XOM", "CVX", "COP", "SLB",
        // Materials
        "LIN", "APD", "ECL",
        // Real Estate
        "PLD", "AMT", "CCI"
    ];
    
    let data_start = Instant::now();
    let client = reqwest::Client::new();

    // Create concurrent requests for both quotes and profiles
    let requests = symbols.iter().map(|symbol| {
        let client = &client;
        let api_key = api_key;
        let symbol = symbol.to_string();
        
        async move {
            let quote_future = client
                .get("https://finnhub.io/api/v1/quote")
                .query(&[
                    ("token", api_key),
                    ("symbol", &symbol)
                ])
                .send();

            let profile_future = client
                .get("https://finnhub.io/api/v1/stock/profile2")
                .query(&[
                    ("token", api_key),
                    ("symbol", &symbol)
                ])
                .send();

            let (quote_response, profile_response) = future::join(quote_future, profile_future).await;

            match quote_response?.json::<QuoteResponse>().await {
                Ok(quote) => {
                    let profile = profile_response?.json::<CompanyProfile>().await.ok();
                    eprintln!("Successfully processed: {}", symbol);
                    Ok(StockData { symbol, quote, profile })
                },
                Err(e) => {
                    eprintln!("Error parsing data for {}: {}", symbol, e);
                    Err(e.into())
                }
            }
        }
    });

    let results: Vec<Result<StockData, Box<dyn Error + Send + Sync>>> = future::join_all(requests.collect::<Vec<_>>()).await;

    // Store results in a HashMap for ordered access
    let mut data_map: HashMap<String, (QuoteResponse, Option<CompanyProfile>)> = HashMap::new();
    for result in results {
        if let Ok(stock_data) = result {
            data_map.insert(stock_data.symbol, (stock_data.quote, stock_data.profile));
        }
    }

    let mut wtr = csv::Writer::from_writer(std::io::stdout());
    
    // Write headers
    wtr.write_record(&[
        "symbol",
        "current_price",
        "change",
        "percent_change",
        "high_price",
        "low_price",
        "open_price",
        "previous_close",
        "company_name",
        "country",
        "currency",
        "exchange",
        "ipo_date",
        "market_cap",
        "industry",
        "website"
    ])?;

    // Write data in the original symbol order
    let mut successful_entries = 0;
    for symbol in &symbols {
        if let Some((quote, profile)) = data_map.get(*symbol) {
            wtr.write_record(&[
                symbol.to_string(),
                quote.c.to_string(),
                quote.d.to_string(),
                quote.dp.to_string(),
                quote.h.to_string(),
                quote.l.to_string(),
                quote.o.to_string(),
                quote.pc.to_string(),
                profile.as_ref().and_then(|p| p.name.clone()).unwrap_or_default(),
                profile.as_ref().and_then(|p| p.country.clone()).unwrap_or_default(),
                profile.as_ref().and_then(|p| p.currency.clone()).unwrap_or_default(),
                profile.as_ref().and_then(|p| p.exchange.clone()).unwrap_or_default(),
                profile.as_ref().and_then(|p| p.ipo.clone()).unwrap_or_default(),
                profile.as_ref().and_then(|p| p.market_capitalization.map(|m| m.to_string())).unwrap_or_default(),
                profile.as_ref().and_then(|p| p.industry.clone()).unwrap_or_default(),
                profile.as_ref().and_then(|p| p.weburl.clone()).unwrap_or_default(),
            ])?;
            successful_entries += 1;
        }
    }

    wtr.flush()?;
    let data_duration = data_start.elapsed();
    
    eprintln!("\nTiming Information:");
    eprintln!("Data fetching and processing: {:?}", data_duration);
    eprintln!("Total execution time: {:?}", start.elapsed());
    eprintln!("\nData Information:");
    eprintln!("Successful entries: {}/{}", successful_entries, symbols.len());

    Ok(())
}