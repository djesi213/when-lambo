# When Lambo? — Architecture Document

## Overview

**When Lambo?** is a single-page application (SPA) designed to help Bitcoin holders visualize the future purchasing power of their savings. The app calculates when a user will be able to afford their dream Lamborghini based on current holdings, monthly contributions, expected BTC growth, and inflation.

### Core Mission

> Give people a reason to save in Bitcoin by demonstrating the power of compound growth over time.

---

## Project Structure

```
when-lambo/
├── index.html                 # Main entry point and app shell
├── styles.css                 # Complete design system and styles
├── components/                # Encapsulated UI components
│   ├── LamboSelector.js       # Lamborghini model dropdown
│   ├── GrowthRateInput.js     # BTC annual growth rate (5-40%)
│   ├── InflationRateInput.js  # Inflation rate (0-15%)
│   ├── BtcHoldingsInput.js    # Current BTC holdings
│   └── MonthlySavingsInput.js # Monthly USD investment
├── js/                        # Core application logic
│   ├── calculator.js          # Financial calculation engine
│   └── app.js                 # App initialization and orchestration
├── firebase.json              # Firebase Hosting configuration
├── .firebaserc                # Firebase project settings
└── README.md                  # User-facing documentation
```

---

## Design Decisions

### 1. Frontend-Only Architecture

**Decision:** No backend server; purely client-side JavaScript.

**Rationale:**
- Simplifies hosting (static files on Firebase)
- Reduces operational costs to near-zero
- Eliminates server security concerns
- All calculations are deterministic and require no persistent state

**Trade-offs:**
- BTC price fetched client-side (CORS-friendly API required)
- No user accounts or saved calculations (could use localStorage if needed)

---

### 2. Component-Based Structure (Vanilla JS)

**Decision:** Each user input is a self-contained JavaScript class with its own file.

**Rationale:**
- Follows Single Responsibility Principle
- Easy to modify, test, or replace individual inputs
- No build step or framework dependencies
- Clear API: each component exposes `getValue()` and an `onChange` callback

**Component Pattern:**
```javascript
class ComponentName {
    constructor(containerId, onChange) {
        this.container = document.getElementById(containerId);
        this.onChange = onChange;
        this.render();
        this.attachEventListeners();
    }
    
    render() { /* Generate HTML */ }
    attachEventListeners() { /* Bind events, call onChange */ }
    getValue() { /* Return current value */ }
}
```

---

### 3. CSS Design System

**Decision:** Single `styles.css` file with CSS custom properties (variables).

**Rationale:**
- No build tools required
- Easy theme customization via CSS variables
- BTC orange (`#F7931A`) as primary brand color
- Dark theme optimized for the crypto-savvy audience

**Key Design Tokens:**
| Token | Purpose |
|-------|---------|
| `--btc-orange` | Primary accent color |
| `--bg-primary` | Page background (#0D0D0F) |
| `--bg-card` | Card backgrounds |
| `--radius-lg` | Consistent border radius |
| `--transition-normal` | Standard animation timing |

---

### 4. Real-Time Calculation

**Decision:** Results update immediately as any input changes.

**Rationale:**
- Provides instant feedback (no "Calculate" button)
- Encourages experimentation with different scenarios
- Creates an engaging, interactive experience

**Implementation:** Each component calls `updateCalculation()` via its `onChange` callback, which gathers all values and runs the projection.

---

### 5. Financial Calculation Model

**Decision:** Month-by-month simulation rather than closed-form formula.

**Rationale:**
- Handles monthly DCA contributions accurately (purchases at varying BTC prices)
- Easier to understand and debug
- Flexible for future enhancements (e.g., halving events, variable rates)

**Algorithm (in `calculator.js`):**
1. Convert annual growth rate to monthly: `(1 + annual)^(1/12) - 1`
2. For each month:
   - Apply growth to BTC price
   - Add monthly contribution (converted to BTC at new price)
3. Compare portfolio value to inflation-adjusted Lambo price
4. Return the first month where `portfolio >= target`

---

### 6. External API: CoinGecko

**Decision:** Use CoinGecko's free public API for live BTC price.

**Rationale:**
- No API key required
- CORS-friendly
- Reliable and widely used
- Fallback price hardcoded if API fails

**Endpoint:**
```
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd
```

---

## User Inputs

| Input | Range | Default | Purpose |
|-------|-------|---------|---------|
| Lamborghini Model | 8 models | — | Sets target price ($239K–$3.6M) |
| BTC Growth Rate | 5–40% | 20% | Expected annual appreciation |
| Inflation Rate | 0–15% | 3% | Adjusts Lambo price over time |
| Current BTC Holdings | ≥0 BTC | 0 | Starting portfolio |
| Monthly Savings | ≥$0 | 0 | Regular DCA contribution |

---

## Extending the Application

### Add New Lamborghini Models

Edit `components/LamboSelector.js` and add to the `models` array:

```javascript
{ id: 'new-model', name: 'Model Name', price: 500000, emoji: '🔴' }
```

### Add a New Input Component

1. Create `components/NewInput.js` following the component pattern
2. Add a container div in `index.html`:
   ```html
   <div class="input-card" id="new-input-container"></div>
   ```
3. Import in `index.html`:
   ```html
   <script src="components/NewInput.js"></script>
   ```
4. Initialize in `app.js`:
   ```javascript
   newInput = new NewInput('new-input-container', () => updateCalculation());
   ```
5. Use `newInput.getValue()` in the calculation

### Add User Preferences (localStorage)

Store and restore user inputs for returning visitors:

```javascript
// Save
localStorage.setItem('whenLambo', JSON.stringify({
    btcHoldings: 0.5,
    monthlySavings: 500,
    // ...
}));

// Restore on load
const saved = JSON.parse(localStorage.getItem('whenLambo'));
```

### Add Alternative Assets/Goals

The calculation engine is generic. To support other goals:

1. Create a new selector component (e.g., `GoalSelector.js`)
2. Define items with `{ id, name, price }`
3. Pass selected price to `Calculator.findLamboDate()`

### Add Shareable Results

Generate a URL with parameters:

```javascript
const params = new URLSearchParams({
    lambo: 'huracan',
    growth: 20,
    btc: 0.5,
    monthly: 500
});
const shareUrl = `${location.origin}?${params}`;
```

Parse on load to restore state.

### Add Charts/Visualizations

Consider adding:
- Portfolio growth over time (line chart)
- Contribution breakdown (stacked area)
- BTC vs Lambo price race

Libraries like Chart.js or lightweight options like uPlot work well.

---

## Firebase Deployment

### First-Time Setup

```bash
npm install -g firebase-tools
firebase login
firebase projects:create when-lambo-your-id
# Update .firebaserc with your project ID
firebase deploy
```

### Subsequent Deploys

```bash
firebase deploy
```

### Custom Domain

1. Go to Firebase Console → Hosting → Add custom domain
2. Follow DNS verification steps
3. SSL certificate is provisioned automatically

---

## Performance Considerations

- **No build step:** Files served as-is (consider minification for production)
- **Single CSS file:** Could be split if it grows significantly
- **API rate limits:** CoinGecko free tier allows ~10-30 calls/minute; app refreshes every 60s
- **Calculation efficiency:** Linear search up to 600 months; could optimize with binary search if needed

---

## Future Ideas

- [ ] Multiple currency support (EUR, GBP, etc.)
- [ ] Bitcoin halving cycle integration
- [ ] Historical backtesting ("If you started in 2020...")
- [ ] PWA support (offline mode, installable)
- [ ] Dark/light theme toggle
- [ ] Social sharing with OG image generation
- [ ] Export calculation as PDF

---

## Original Requirements

This application was built to fulfill the following specifications:

1. Single Page App hosted on Google Firebase
2. Bitcoin calculator showing compound growth potential
3. Display current BTC price in USD
4. User inputs: Lamborghini model, growth rate (5-40%), inflation rate (0-15%), current BTC holdings, monthly savings
5. Output: Month and year when user can afford selected Lamborghini
6. Account for compound growth, monthly contributions, and inflation
7. Frontend-only architecture (no backend)
8. Each input as a separate, encapsulated component
