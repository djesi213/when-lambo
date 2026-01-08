/**
 * GrowthRateInput Component
 * Allows users to set expected annual BTC growth rate (5-40%)
 * Uses a slider for intuitive input with visual feedback
 */

class GrowthRateInput {
    constructor(containerId, onChange) {
        this.container = document.getElementById(containerId);
        this.onChange = onChange;
        this.minValue = 5;
        this.maxValue = 40;
        this.defaultValue = 20;
        this.currentValue = this.defaultValue;

        this.render();
        this.attachEventListeners();
        this.updateSliderBackground();
    }

    render() {
        this.container.innerHTML = `
            <div class="input-header">
                <span class="input-icon">📈</span>
                <span class="input-title">BTC Annual Growth Rate</span>
            </div>
            <p class="input-description">Expected yearly Bitcoin appreciation</p>
            <div class="range-container">
                <input 
                    type="range" 
                    class="range-slider" 
                    id="growth-rate-slider"
                    min="${this.minValue}" 
                    max="${this.maxValue}" 
                    value="${this.defaultValue}"
                    step="1"
                >
                <div class="range-value">
                    <span class="range-current" id="growth-rate-value">${this.defaultValue}%</span>
                    <span class="range-limits">${this.minValue}% - ${this.maxValue}%</span>
                </div>
            </div>
            <div class="growth-context" id="growth-context">
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--space-sm);">
                    ${this.getContextMessage(this.defaultValue)}
                </p>
            </div>
        `;
    }

    getContextMessage(value) {
        if (value <= 10) {
            return "📉 Conservative estimate - similar to traditional markets";
        } else if (value <= 20) {
            return "📊 Moderate growth - reasonable long-term Bitcoin outlook";
        } else if (value <= 30) {
            return "📈 Optimistic - based on historical BTC performance";
        } else {
            return "🚀 Very bullish - expecting significant adoption growth";
        }
    }

    attachEventListeners() {
        const slider = this.container.querySelector('#growth-rate-slider');
        const valueDisplay = this.container.querySelector('#growth-rate-value');
        const contextDisplay = this.container.querySelector('#growth-context p');

        const updateValue = (value) => {
            this.currentValue = parseInt(value);
            valueDisplay.textContent = `${this.currentValue}%`;
            contextDisplay.textContent = this.getContextMessage(this.currentValue);
            this.updateSliderBackground();

            if (this.onChange) {
                this.onChange(this.currentValue);
            }
        };

        slider.addEventListener('input', (e) => updateValue(e.target.value));
        slider.addEventListener('change', (e) => updateValue(e.target.value));
    }

    updateSliderBackground() {
        const slider = this.container.querySelector('#growth-rate-slider');
        const percentage = ((this.currentValue - this.minValue) / (this.maxValue - this.minValue)) * 100;
        slider.style.background = `linear-gradient(to right, 
            var(--btc-orange) 0%, 
            var(--btc-orange) ${percentage}%, 
            var(--bg-input) ${percentage}%, 
            var(--bg-input) 100%)`;
    }

    getValue() {
        return this.currentValue;
    }

    getDecimal() {
        return this.currentValue / 100;
    }
}
