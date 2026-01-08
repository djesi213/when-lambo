# When Lambo? 🏎️

A Bitcoin savings calculator that shows you when you'll be able to afford your dream Lamborghini.

## Features

- **Live BTC Price**: Fetches real-time Bitcoin prices from CoinGecko API
- **Lamborghini Selection**: Choose from various models with real MSRP prices
- **Compound Growth Calculation**: Projects future BTC value with monthly contributions
- **Inflation Adjustment**: Accounts for increasing Lamborghini prices over time
- **Real-time Updates**: Results update instantly as you adjust parameters

## How It Works

1. The app fetches the current Bitcoin price
2. Select your dream Lamborghini model
3. Set your expected BTC annual growth rate (5-40%)
4. Set expected inflation rate (0-15%)
5. Enter your current BTC holdings
6. Enter your monthly USD investment plan
7. See when you'll be able to afford your Lambo! 🚀

## Tech Stack

- Pure HTML, CSS, and JavaScript (no frameworks)
- Modular component architecture
- Responsive design with mobile support
- Firebase Hosting ready

## Deployment to Firebase

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Create a project: `firebase projects:create when-lambo`
4. Update `.firebaserc` with your project ID
5. Deploy: `firebase deploy`

## Local Development

Simply open `index.html` in a browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

## Components

| Component | Description |
|-----------|-------------|
| `LamboSelector` | Dropdown to select Lamborghini model and price |
| `GrowthRateInput` | Slider for expected BTC annual growth (5-40%) |
| `InflationRateInput` | Slider for expected inflation rate (0-15%) |
| `BtcHoldingsInput` | Input for current BTC holdings |
| `MonthlySavingsInput` | Input for monthly USD investment |

## License

AGPLv3 - Stack sats and dream big! ₿
