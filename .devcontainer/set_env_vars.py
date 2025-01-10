import os
from dotenv import load_dotenv

# Load existing .env file if it exists
load_dotenv()

secrets = {
    'EIA_KEY': os.getenv('EIA_KEY'),
    'FINNHUB_API_KEY': os.getenv('FINNHUB_API_KEY'),
    'TWELVE_DATA_API_KEY': os.getenv('TWELVE_DATA_API_KEY'),
    'HF_TOKEN': os.getenv('HF_TOKEN'),
    'AWS_ACCESS_KEY_ID': os.getenv('AWS_ACCESS_KEY_ID'),
    'AWS_SECRET_ACCESS_KEY': os.getenv('AWS_SECRET_ACCESS_KEY'),
    'FMP_API_KEY': os.getenv('FMP_API_KEY'),
    'ALPHAVANTAGE_API_KEY': os.getenv('ALPHAVANTAGE_API_KEY'),
    'FINRA_CLIENT_ID': os.getenv('FINRA_CLIENT_ID'),
    'FINRA_CLIENT_SECRET': os.getenv('FINRA_CLIENT_SECRET'),
    'FRED_API_KEY': os.getenv('FRED_API_KEY')
}

# Update .env file
with open('.env', 'w') as f:
    for key, value in secrets.items():
        if value is not None:
            f.write(f"{key}={value}\n")