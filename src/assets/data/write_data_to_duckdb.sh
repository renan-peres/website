#!/bin/bash

DB_FILE="data.db"

# CSV files
for csv_file in *.csv; do
   [ -f "$csv_file" ] || continue
   table_name=$(echo "${csv_file%.csv}" | tr '-' '_')
   duckdb "$DB_FILE" "CREATE OR REPLACE TABLE $table_name AS (FROM read_csv('$csv_file'));"
   echo "Created table $table_name from $csv_file"
done

# Parquet files
for parquet_file in *.parquet; do
   [ -f "$parquet_file" ] || continue
   table_name=$(echo "${parquet_file%.parquet}" | tr '-' '_')
   duckdb "$DB_FILE" "CREATE OR REPLACE TABLE $table_name AS (FROM read_parquet('$parquet_file'));"
   echo "Created table $table_name from $parquet_file"
done

# JSON files
for json_file in *.json; do
   [ -f "$json_file" ] || continue
   table_name=$(echo "${json_file%.json}" | tr '-' '_')
   duckdb "$DB_FILE" "CREATE OR REPLACE TABLE $table_name AS (FROM read_json_auto('$json_file'));"
   echo "Created table $table_name from $json_file"
done