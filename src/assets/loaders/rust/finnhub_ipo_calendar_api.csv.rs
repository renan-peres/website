//! ```cargo
//! [dependencies]
//! reqwest = { version = "0.11", features = ["json"] }
//! serde = { version = "1.0", features = ["derive"] }
//! serde_json = "1.0"
//! tokio = { version = "1.0", features = ["full"] }
//! csv = "1.2"
//! chrono = "0.4"
//! ```

use serde::{Deserialize};
use std::error::Error;
use std::time::Instant;
use chrono::Local;

#[derive(Debug, Deserialize)]
struct FinnhubResponse {
    #[serde(rename = "ipoCalendar")]
    ipo_calendar: Vec<IpoData>,
}

#[derive(Debug, Deserialize)]
struct IpoData {
    date: String,
    exchange: String,
    name: String,
    #[serde(rename = "numberOfShares")]
    number_of_shares: Option<i64>,
    price: String,
    status: String,
    symbol: String,
    #[serde(rename = "totalSharesValue")]
    total_shares_value: Option<i64>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let start = Instant::now();
    let api_key = "ctl0tnpr01qn6d7jqpj0ctl0tnpr01qn6d7jqpjg";
    
    // Get current date and 3 months from now for the date range
    let now = Local::now();
    let from_date = now.format("%Y-%m-%d").to_string();
    let to_date = now.checked_add_months(chrono::Months::new(3))
        .unwrap()
        .format("%Y-%m-%d")
        .to_string();
    
    let data_start = Instant::now();
    let client = reqwest::Client::new();
    let response = client
        .get("https://finnhub.io/api/v1/calendar/ipo")
        .query(&[
            ("token", api_key),
            ("from", &from_date),
            ("to", &to_date)
        ])
        .send()
        .await?;

    let api_response: FinnhubResponse = response.json().await?;
    let data_duration = data_start.elapsed();
    
    let processing_start = Instant::now();
    let mut wtr = csv::Writer::from_writer(std::io::stdout());
    
    // Write headers
    wtr.write_record(&[
        "date",
        "exchange",
        "name",
        "numberOfShares",
        "price",
        "status",
        "symbol",
        "totalSharesValue"
    ])?;

    // Write data rows
    for item in &api_response.ipo_calendar {
        wtr.write_record(&[
            &item.date,
            &item.exchange,
            &item.name,
            &item.number_of_shares.map_or("".to_string(), |n| n.to_string()),
            &item.price,
            &item.status,
            &item.symbol,
            &item.total_shares_value.map_or("".to_string(), |n| n.to_string()),
        ])?;
    }

    wtr.flush()?;
    let processing_duration = processing_start.elapsed();
    
    eprintln!("\nTiming Information:");
    eprintln!("Data fetching: {:?}", data_duration);
    eprintln!("CSV processing: {:?}", processing_duration);
    eprintln!("Total execution time: {:?}", start.elapsed());
    eprintln!("\nData Information:");
    eprintln!("Date range: {} to {}", from_date, to_date);
    eprintln!("Total IPOs found: {}", api_response.ipo_calendar.len());

    Ok(())
}