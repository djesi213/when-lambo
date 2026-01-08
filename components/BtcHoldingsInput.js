/**
 * BtcHoldingsInput Component
 * Allows users to input their current Bitcoin holdings
 * Supports decimal values for satoshi-level precision
 */

class BtcHoldingsInput {
    constructor(containerId, onChange) {
        this.container = document.getElementById(containerId);
        this.onChange = onChange;
        this.currentValue = 0;

        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="input-header">
                <span class="input-icon">₿</span>
                <span class="input-title">Current BTC Holdings</span>
            </div>
            <p class="input-description">How much Bitcoin do you currently own?</p>
            <div class="input-with-unit">
                <input 
                    type="number" 
                    class="form-control" 
                    id="btc-holdings-input"
                    placeholder="0.00000000"
                    min="0"
                    step="0.00000001"
                    value=""
                >
                <span class="input-unit">BTC</span>
            </div>
            <div class="holdings-info" id="holdings-info">
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--space-sm);">
                    Enter amount in BTC (e.g., 0.5 for half a Bitcoin)
                </p>
            </div>
            <div class="usd-value" id="usd-value" style="margin-top: var(--space-sm);"></div>
        `;
    }

    attachEventListeners() {
        const input = this.container.querySelector('#btc-holdings-input');
        const usdDisplay = this.container.querySelector('#usd-value');
        const infoDisplay = this.container.querySelector('#holdings-info p');

        const updateValue = (value) => {
            this.currentValue = parseFloat(value) || 0;

            // Update USD value display if BTC price is available
            if (window.currentBtcPrice && this.currentValue > 0) {
                const usdValue = this.currentValue * window.currentBtcPrice;
                usdDisplay.innerHTML = `
                    <div class="result-stat" style="padding: var(--space-sm) var(--space-md);">
                        <span class="result-stat-value" style="font-size: 1.1rem;">$${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        <span class="result-stat-label">Current Value</span>
                    </div>
                `;
            } else {
                usdDisplay.innerHTML = '';
            }

            // Update context message
            if (this.currentValue === 0) {
                infoDisplay.textContent = "Enter amount in BTC (e.g., 0.5 for half a Bitcoin)";
            } else if (this.currentValue < 0.01) {
                infoDisplay.textContent = `💡 ${Math.round(this.currentValue * 100000000).toLocaleString()} satoshis - Every sat counts!`;
            } else if (this.currentValue < 0.1) {
                infoDisplay.textContent = "📊 Building your stack - keep stacking!";
            } else if (this.currentValue < 1) {
                infoDisplay.textContent = "🎯 Getting closer to a whole coin!";
            } else if (this.currentValue < 10) {
                infoDisplay.textContent = "🐋 Whole coiner status - impressive!";
            } else {
                infoDisplay.textContent = "🐋🐋 Whale alert! Serious hodler detected.";
            }

            if (this.onChange) {
                this.onChange(this.currentValue);
            }
        };

        input.addEventListener('input', (e) => updateValue(e.target.value));
        input.addEventListener('change', (e) => updateValue(e.target.value));
    }

    getValue() {
        return this.currentValue;
    }

    // Update USD display when BTC price changes
    updateUsdDisplay() {
        const input = this.container.querySelector('#btc-holdings-input');
        if (input && input.value) {
            const event = new Event('input');
            input.dispatchEvent(event);
        }
    }
}
