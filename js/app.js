/**
 * Main Application
 * Initializes components, fetches BTC price, and orchestrates calculations
 */

// Global state
window.currentBtcPrice = null;

// Component instances
let lamboSelector;
let growthRateInput;
let inflationRateInput;
let btcHoldingsInput;
let monthlySavingsInput;

/**
 * Fetch current Bitcoin price from CoinGecko API
 */
async function fetchBtcPrice() {
    const priceDisplay = document.getElementById('current-btc-price');

    try {
        // Using CoinGecko's free API
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
            { mode: 'cors' }
        );

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        window.currentBtcPrice = data.bitcoin.usd;

        priceDisplay.textContent = `$${window.currentBtcPrice.toLocaleString()}`;
        priceDisplay.classList.add('price-loaded');

        // Update components that show USD values
        if (btcHoldingsInput) btcHoldingsInput.updateUsdDisplay();
        if (monthlySavingsInput) monthlySavingsInput.updateBtcDisplay();

        // Recalculate with real price
        updateCalculation();

    } catch (error) {
        console.error('Failed to fetch BTC price:', error);
        // Use a fallback price (last known approximate price)
        window.currentBtcPrice = 95000;
        priceDisplay.textContent = `~$${window.currentBtcPrice.toLocaleString()}`;
        priceDisplay.title = 'Using approximate price (API unavailable)';
    }
}

/**
 * Update the result display based on current inputs
 */
function updateCalculation() {
    const resultTitle = document.getElementById('result-title');
    const resultSubtitle = document.getElementById('result-subtitle');
    const resultDetails = document.getElementById('result-details');
    const resultSection = document.getElementById('result-section');
    const resultCard = resultSection.querySelector('.result-card');
    const resultIcon = resultCard.querySelector('.result-icon');

    // Gather all inputs
    const params = {
        currentBtcHoldings: btcHoldingsInput ? btcHoldingsInput.getValue() : 0,
        currentBtcPrice: window.currentBtcPrice,
        monthlyContributionUsd: monthlySavingsInput ? monthlySavingsInput.getValue() : 0,
        annualGrowthRate: growthRateInput ? growthRateInput.getDecimal() : 0.20,
        annualInflationRate: inflationRateInput ? inflationRateInput.getDecimal() : 0.03,
        lamboBasePrice: lamboSelector ? lamboSelector.getPrice() : null
    };

    // Check if we have minimum required inputs
    if (!params.lamboBasePrice) {
        resultTitle.textContent = 'Select Your Dream Lambo';
        resultSubtitle.textContent = 'Choose a model from the dropdown below';
        resultDetails.innerHTML = '';
        resultIcon.textContent = '🏎️';
        return;
    }

    if (params.currentBtcHoldings <= 0 && params.monthlyContributionUsd <= 0) {
        resultTitle.textContent = 'Enter Your Bitcoin Details';
        resultSubtitle.textContent = 'Add your current holdings or monthly savings plan';
        resultDetails.innerHTML = '';
        resultIcon.textContent = '₿';
        return;
    }

    // Calculate!
    const result = Calculator.findLamboDate(params);

    if (result.success) {
        // Remove old animation class and re-add for animation effect
        resultCard.classList.remove('result-success');
        void resultCard.offsetWidth; // Trigger reflow
        resultCard.classList.add('result-success');

        if (result.months === 0) {
            // Already can afford it!
            resultIcon.textContent = '🎉';
            resultTitle.textContent = 'You Can Afford It NOW!';
            resultSubtitle.textContent = 'Time to visit the dealership!';
            resultDetails.innerHTML = `
                <div class="result-stat">
                    <span class="result-stat-value">${Calculator.formatCurrency(result.currentValue)}</span>
                    <span class="result-stat-label">Your BTC Value</span>
                </div>
                <div class="result-stat">
                    <span class="result-stat-value">${Calculator.formatCurrency(result.lamboPrice)}</span>
                    <span class="result-stat-label">Lambo Price</span>
                </div>
            `;
        } else {
            resultIcon.textContent = '🏎️';
            resultTitle.textContent = Calculator.formatDate(result.date);
            resultSubtitle.textContent = `That's only ${Calculator.formatDuration(result.months)} away!`;

            const selectedLambo = lamboSelector.getValue();
            const lamboName = selectedLambo ? selectedLambo.model.name : 'Lamborghini';

            resultDetails.innerHTML = `
                <div class="result-stat">
                    <span class="result-stat-value">${Calculator.formatCurrency(result.lamboPrice)}</span>
                    <span class="result-stat-label">${lamboName} (Inflation Adjusted)</span>
                </div>
                <div class="result-stat">
                    <span class="result-stat-value">${Calculator.formatCurrency(result.btcPrice)}</span>
                    <span class="result-stat-label">Projected BTC Price</span>
                </div>
                <div class="result-stat">
                    <span class="result-stat-value">${result.btcHoldings.toFixed(4)} BTC</span>
                    <span class="result-stat-label">Your Future Holdings</span>
                </div>
                ${result.totalContributed > 0 ? `
                <div class="result-stat">
                    <span class="result-stat-value">${Calculator.formatCurrency(result.totalContributed)}</span>
                    <span class="result-stat-label">Total Invested</span>
                </div>
                ` : ''}
            `;
        }
    } else {
        resultIcon.textContent = '⏳';
        resultTitle.textContent = 'Keep Stacking!';
        resultSubtitle.textContent = result.error;
        resultDetails.innerHTML = `
            <div class="result-stat">
                <span class="result-stat-value" style="color: var(--warning);">50+ years</span>
                <span class="result-stat-label">Estimated Timeline</span>
            </div>
        `;
    }
}

/**
 * Initialize all components
 */
function initializeApp() {
    // Create component instances with onChange callbacks
    lamboSelector = new LamboSelector('lambo-selector-container', () => {
        updateCalculation();
    });

    growthRateInput = new GrowthRateInput('growth-rate-container', () => {
        updateCalculation();
    });

    inflationRateInput = new InflationRateInput('inflation-rate-container', () => {
        updateCalculation();
    });

    btcHoldingsInput = new BtcHoldingsInput('btc-holdings-container', () => {
        updateCalculation();
    });

    monthlySavingsInput = new MonthlySavingsInput('monthly-savings-container', () => {
        updateCalculation();
    });

    // Fetch BTC price
    fetchBtcPrice();

    // Refresh price every 120 seconds
    setInterval(fetchBtcPrice, 120000);

    // Initial calculation
    updateCalculation();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
