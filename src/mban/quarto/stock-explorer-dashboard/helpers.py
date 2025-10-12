# helpers.py

import yfinance as yf
import pandas as pd
import cufflinks as cf

# ticker -> stock
def get_stock(ticker):
    return yf.Ticker(ticker.upper())

# stock -> data
def get_data(stock, period = "1y"):
    return stock.history(period = period)

# data -> current price
def get_price(data):
    return f'{data["Close"].iloc[-1]:,.2f}'

def get_stocks_data(tickers, period="1y"):
    stocks = {ticker: yf.Ticker(ticker.upper()) for ticker in tickers}
    data = {ticker: stocks[ticker].history(period=period) for ticker in tickers}
    return stocks, data

# data -> change
def get_change(data):
    current_price = data["Close"].iloc[-1]
    last_price = data["Close"].iloc[-2]
    change = current_price - last_price
    return {
        'amount': f"${abs(change):.2f}",
        'percent': f"{change / last_price * 100:.2f}",
        'color': 'success' if change >= 0 else 'danger',
        'icon': 'arrow-up' if change >= 0 else 'arrow-down'
    }

# data -> OHLC table
def make_OHLC_table(data):
    return {
        'date': data.reset_index()['Date'].iloc[-1].date().strftime('%Y-%m-%d'),
        'open': f"${data['Open'].iloc[-1]:.2f}",
        'high': f"${data['High'].iloc[-1]:.2f}",
        'low': f"${data['Low'].iloc[-1]:.2f}",
        'close': f"${data['Close'].iloc[-1]:.2f}",
        'volume': f"{data['Volume'].iloc[-1]:,.0f}"
    }

# data -> candlestick chart
def make_candlestick_chart(data, ticker):
    import plotly.graph_objects as go
    
    fig = go.Figure(data=[go.Candlestick(x=data.index,
                open=data['Open'],
                high=data['High'],
                low=data['Low'],
                close=data['Close'])])

    fig.add_trace(go.Scatter(x=data.index, 
                          y=data['Close'].rolling(window=20).mean(),
                          name='20 Day MA',
                          line=dict(color='orange')))

    fig.update_layout(
        title=f'{ticker} Stock Price',
        yaxis_title='Price',
        template='plotly_white',
        xaxis_rangeslider_visible=False
    )

    return fig