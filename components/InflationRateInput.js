/**
 * InflationRateInput Component
 * Allows users to set expected annual inflation rate (0-15%)
 * Adjusts the Lamborghini price target over time
 */

class InflationRateInput {
    constructor(containerId, onChange) {
        this.container = document.getElementById(containerId);
        this.onChange = onChange;
        this.minValue = 0;
        this.maxValue = 15;
        this.defaultValue = 3;
        this.currentValue = this.defaultValue;

        this.render();
        this.attachEventListeners();
        this.updateSliderBackground();
    }

    render() {
        this.container.innerHTML = `
            <div class="input-header">
                <span class="input-icon">💵</span>
                <span class="input-title">Annual Inflation Rate</span>
            </div>
            <p class="input-description">Expected price increase of goods (incl. Lambos)</p>
            <div class="range-container">
                <input 
                    type="range" 
                    class="range-slider inflation-slider" 
                    id="inflation-rate-slider"
                    min="${this.minValue}" 
                    max="${this.maxValue}" 
                    value="${this.defaultValue}"
                    step="0.5"
                >
                <div class="range-value">
                    <span class="range-current" id="inflation-rate-value">${this.defaultValue}%</span>
                    <span class="range-limits">${this.minValue}% - ${this.maxValue}%</span>
                </div>
            </div>
            <div class="inflation-context" id="inflation-context">
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--space-sm);">
                    ${this.getContextMessage(this.defaultValue)}
                </p>
            </div>
        `;
    }

    getContextMessage(value) {
        if (value <= 2) {
            return "🎯 Low inflation - ideal economic conditions";
        } else if (value <= 4) {
            return "📊 Moderate - typical for developed economies";
        } else if (value <= 7) {
            return "⚠️ Elevated - above central bank targets";
        } else if (value <= 10) {
            return "🔥 High inflation - significant purchasing power erosion";
        } else {
            return "🚨 Very high - considering extreme scenarios";
        }
    }

    attachEventListeners() {
        const slider = this.container.querySelector('#inflation-rate-slider');
        const valueDisplay = this.container.querySelector('#inflation-rate-value');
        const contextDisplay = this.container.querySelector('#inflation-context p');

        const updateValue = (value) => {
            this.currentValue = parseFloat(value);
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
        const slider = this.container.querySelector('#inflation-rate-slider');
        const percentage = ((this.currentValue - this.minValue) / (this.maxValue - this.minValue)) * 100;
        // Use a red-ish gradient for inflation (it's generally "bad")
        slider.style.background = `linear-gradient(to right, 
            #FF6B6B 0%, 
            #FF6B6B ${percentage}%, 
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
