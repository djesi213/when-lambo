/**
 * MonthlySavingsInput Component
 * Allows users to input how much USD they plan to invest in BTC monthly
 * Represents regular DCA (Dollar Cost Averaging) contributions
 */

class MonthlySavingsInput {
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
                <span class="input-icon">💰</span>
                <span class="input-title">Monthly Savings</span>
            </div>
            <p class="input-description">How much USD will you invest in BTC each month?</p>
            <div class="input-with-unit">
                <input 
                    type="number" 
                    class="form-control" 
                    id="monthly-savings-input"
                    placeholder="500"
                    min="0"
                    step="50"
                    value=""
                >
                <span class="input-unit">USD</span>
            </div>
            <div class="savings-info" id="savings-info">
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--space-sm);">
                    Regular contributions accelerate your goal
                </p>
            </div>
            <div class="btc-equivalent" id="btc-equivalent" style="margin-top: var(--space-sm);"></div>
        `;
    }

    attachEventListeners() {
        const input = this.container.querySelector('#monthly-savings-input');
        const btcDisplay = this.container.querySelector('#btc-equivalent');
        const infoDisplay = this.container.querySelector('#savings-info p');

        const updateValue = (value) => {
            this.currentValue = parseFloat(value) || 0;

            // Calculate BTC equivalent if price is available
            if (window.currentBtcPrice && this.currentValue > 0) {
                const btcAmount = this.currentValue / window.currentBtcPrice;
                const satsAmount = Math.round(btcAmount * 100000000);
                btcDisplay.innerHTML = `
                    <div class="result-stat" style="padding: var(--space-sm) var(--space-md);">
                        <span class="result-stat-value" style="font-size: 1.1rem;">${satsAmount.toLocaleString()} sats</span>
                        <span class="result-stat-label">≈ ${btcAmount.toFixed(8)} BTC/month</span>
                    </div>
                `;
            } else {
                btcDisplay.innerHTML = '';
            }

            // Update context message based on amount
            if (this.currentValue === 0) {
                infoDisplay.textContent = "Regular contributions accelerate your goal";
            } else if (this.currentValue < 100) {
                infoDisplay.textContent = "🌱 Every dollar counts - consistency is key!";
            } else if (this.currentValue < 500) {
                infoDisplay.textContent = "📈 Solid DCA strategy - building steadily!";
            } else if (this.currentValue < 1000) {
                infoDisplay.textContent = "💪 Strong commitment to your financial future!";
            } else if (this.currentValue < 5000) {
                infoDisplay.textContent = "🚀 Aggressive stacking - Lambo incoming!";
            } else {
                infoDisplay.textContent = "🐋 Whale-level DCA - respect the hustle!";
            }

            // Calculate yearly contribution
            if (this.currentValue > 0) {
                const yearly = this.currentValue * 12;
                infoDisplay.textContent += ` ($${yearly.toLocaleString()}/year)`;
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

    // Update BTC equivalent when BTC price changes
    updateBtcDisplay() {
        const input = this.container.querySelector('#monthly-savings-input');
        if (input && input.value) {
            const event = new Event('input');
            input.dispatchEvent(event);
        }
    }
}
