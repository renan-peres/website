#!/bin/sh

mkdir -p parquet_exports
duckdb data.db -c "EXPORT DATABASE 'parquet_exports' (FORMAT PARQUET);"

for f in parquet_exports/*.parquet; do
    new_name=$(echo "$f" | sed -e 's/_\+/_/g' -e 's/_\.parquet/.parquet/g')
    [ "$f" != "$new_name" ] && mv "$f" "$new_name"
done

echo "Export complete. Files saved in parquet_exports/"