//! **AlphaVantage News Sentiment API Tool**
//! 
//! Downloads news articles and sentiment data from the last 2 days across multiple categories
//! Documentation: https://www.alphavantage.co/documentation/#news-sentiment
//!
//! **Usage**: rust-script alphavantage_news_api.csv.rs > output.csv
//!
//! **Environment Setup**:
//! ```cargo
//! [dependencies]
//! reqwest = { version = "0.11", features = ["json"] }
//! serde = { version = "1.0", features = ["derive"] }
//! serde_json = "1.0"
//! tokio = { version = "1.0", features = ["full"] }
//! csv = "1.2"
//! chrono = { version = "0.4", features = ["serde"] }
//! ```

use serde::{Deserialize};
use std::error::Error;
use std::time::Instant;
use chrono::prelude::*;
use serde_json::Value;
use std::collections::BTreeMap;
use make_clean_names::clean_column_name;

mod make_clean_names;

#[derive(Debug, Deserialize)]
struct AlphaVantageResponse {
    #[serde(default)]
    feed: Vec<Value>,
    #[serde(default)]
    items: Vec<Value>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let start = Instant::now();
    let client = reqwest::Client::new();
    let mut wtr = csv::Writer::from_writer(std::io::stdout());
    let mut headers_written = false;
    let mut total_articles = 0;
    
    let two_days_ago = Utc::now() - chrono::Duration::days(2);
    let time_from = two_days_ago.format("%Y%m%dT%H%M").to_string();
    
    let api_key = "WC1568Y6FXY98WA9";
    let categories = vec![
        "mergers_and_acquisitions", "earnings", "financial_markets", 
        "finance", "real_estate", "ipo", "economy_monetary", 
        "economy_fiscal", "economy_macro"
    ];

    for category in &categories {
        let data_start = Instant::now();
        let url = format!(
            "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics={}&time_from={}&apikey={}", 
            category, time_from, api_key
        );
        
        eprintln!("Fetching news for category: {} from {}", category, time_from);
        
        let response = client.get(&url).send().await?;
        let news_data: AlphaVantageResponse = response.json().await?;
        let data_duration = data_start.elapsed();
        
        let processing_start = Instant::now();
        let feed = if !news_data.feed.is_empty() {
            &news_data.feed
        } else {
            &news_data.items
        };

        if !feed.is_empty() {
            if !headers_written {
                if let Some(first_item) = feed.first() {
                    let mut headers: Vec<String> = first_item.as_object()
                        .unwrap_or(&serde_json::Map::new())
                        .keys()
                        .map(|k| clean_column_name(k))
                        .collect();
                    headers.insert(0, "category".to_string());
                    wtr.write_record(&headers)?;
                    headers_written = true;
                }
            }

            for article in feed {
                if let Some(obj) = article.as_object() {
                    let mut ordered: BTreeMap<String, String> = obj.iter()
                        .map(|(k, v)| {
                            let value = match v {
                                Value::String(s) => s.clone(),
                                Value::Number(n) => n.to_string(),
                                Value::Bool(b) => b.to_string(),
                                Value::Null => String::from(""),
                                _ => v.to_string(),
                            };
                            (clean_column_name(k), value)
                        })
                        .collect();
                    
                    ordered.insert("category".to_string(), category.to_string());
                    let record: Vec<String> = ordered.values().cloned().collect();
                    wtr.write_record(&record)?;
                    total_articles += 1;
                }
            }
        }

        let processing_duration = processing_start.elapsed();
        eprintln!("\nCategory {} Information:", category);
        eprintln!("Data fetching: {:?}", data_duration);
        eprintln!("CSV processing: {:?}", processing_duration);
    }

    wtr.flush()?;
    
    eprintln!("\nFinal Summary:");
    eprintln!("Total execution time: {:?}", start.elapsed());
    eprintln!("Total articles processed: {}", total_articles);
    eprintln!("Time range: from {} to now", time_from);

    Ok(())
}