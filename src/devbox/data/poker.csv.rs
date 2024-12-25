//! ```cargo
//! [dependencies]
//! serde = { version = "1.0.203", features = ["derive"] }
//! serde_json = "1.0.117"
//! rand = "0.8.5"
//! rayon = "1.10.0"
//! csv = "1.2"
//! ```

use rand::Rng;
use rayon::prelude::*;
use serde::Serialize;
use std::collections::HashMap;
use std::time::Instant;

fn main() {
    const COUNT: u32 = 10_000_000;
    let total_start = Instant::now();

    // Time the hand generation and categorization
    let generation_start = Instant::now();
    let counts = (0..COUNT)
        .into_par_iter()
        .map(|_| {
            let hand = Hand::random();
            let mut map = HashMap::new();
            map.insert(hand.categorize(), 1);
            map
        })
        .reduce(
            || HashMap::with_capacity(10),
            |mut acc, map| {
                for (category, count) in map {
                    *acc.entry(category).or_insert(0) += count;
                }
                acc
            },
        );
    let generation_duration = generation_start.elapsed();

    // Time the data processing and sorting
    let processing_start = Instant::now();
    let mut tidy_data = counts
        .into_iter()
        .map(|(category, count)| SummaryRow { category, count })
        .collect::<Vec<_>>();
    tidy_data.sort_by_key(|data| data.category);
    let processing_duration = processing_start.elapsed();

    // Time the output generation
    let output_start = Instant::now();
    
    // Write CSV header
    println!("category,count,percentage");
    
    // Write data rows
    for row in tidy_data {
        println!("{:?},{},{:.4}",
            row.category,
            row.count,
            (row.count as f64 / COUNT as f64) * 100.0
        );
    }
    let output_duration = output_start.elapsed();

    // Print timing information to stderr
    eprintln!("\nTiming Information:");
    eprintln!("Hand generation and categorization: {:?}", generation_duration);
    eprintln!("Data processing and sorting: {:?}", processing_duration);
    eprintln!("Output generation: {:?}", output_duration);
    eprintln!("Total execution time: {:?}", total_start.elapsed());
    eprintln!("\nSimulation Details:");
    eprintln!("Total hands simulated: {}", COUNT);
}

#[derive(Debug, Clone, Serialize)]
struct SummaryRow {
    category: HandCategory,
    count: u32,
}

#[derive(Debug, PartialEq, Clone, Serialize)]
struct Hand(Vec<Card>);

#[derive(Debug, PartialEq, Clone, Copy, Serialize)]
struct Card {
    rank: u8,
    suit: Suit,
}

#[derive(Debug, PartialEq, Eq, Clone, Copy, Serialize, Hash)]
enum Suit {
    Clubs,
    Diamonds,
    Hearts,
    Spades,
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Clone, Copy, Serialize)]
enum HandCategory {
    HighCard,
    OnePair,
    TwoPair,
    ThreeOfAKind,
    Straight,
    Flush,
    FullHouse,
    FourOfAKind,
    StraightFlush,
}

impl Hand {
    fn random() -> Self {
        let mut rng = rand::thread_rng();
        let mut cards = Vec::with_capacity(5);
        while cards.len() < 5 {
            let rank = rng.gen_range(1..=13);
            let suit = match rng.gen_range(0..4) {
                0 => Suit::Clubs,
                1 => Suit::Diamonds,
                2 => Suit::Hearts,
                3 => Suit::Spades,
                _ => unreachable!(),
            };
            let card = Card { rank, suit };
            if cards.iter().any(|&c| c == card) { continue };
            cards.push(card);
        }
        Self(cards)
    }

    fn categorize(&self) -> HandCategory {
        let rank_counts = self.0.iter().fold(HashMap::new(), |mut acc, card| {
            *acc.entry(card.rank).or_insert(0) += 1;
            acc
        });
        let suit_counts = self.0.iter().fold(HashMap::new(), |mut acc, card| {
            *acc.entry(card.suit).or_insert(0) += 1;
            acc
        });
        let is_flush = suit_counts.len() == 1;
        let is_straight = if self.0.iter().any(|card| card.rank == 1) {
            let min_rank = self.0.iter().map(|card| card.rank).filter(|&rank| rank != 1).min().unwrap();
            let max_rank = self.0.iter().map(|card| card.rank).filter(|&rank| rank != 1).max().unwrap();
            (min_rank == 2 && max_rank == 5) || (min_rank == 10 && max_rank == 13)
        } else {
            let min_rank = self.0.iter().map(|card| card.rank).min().unwrap();
            let max_rank = self.0.iter().map(|card| card.rank).max().unwrap();
            (max_rank - min_rank) as usize == self.0.len() - 1
        };

        if is_flush && is_straight {
            HandCategory::StraightFlush
        } else if rank_counts.values().any(|&count| count == 4) {
            HandCategory::FourOfAKind
        } else if rank_counts.values().any(|&count| count == 3)
            && rank_counts.values().any(|&count| count == 2)
        {
            HandCategory::FullHouse
        } else if is_flush {
            HandCategory::Flush
        } else if is_straight {
            HandCategory::Straight
        } else if rank_counts.values().any(|&count| count == 3) {
            HandCategory::ThreeOfAKind
        } else if rank_counts.values().filter(|&&count| count == 2).count() == 2 {
            HandCategory::TwoPair
        } else if rank_counts.values().any(|&count| count == 2) {
            HandCategory::OnePair
        } else {
            HandCategory::HighCard
        }
    }
}