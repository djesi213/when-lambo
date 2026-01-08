/**
 * LamboSelector Component
 * Allows users to select their desired Lamborghini model
 * Each model includes name, base price, and optional image
 */

class LamboSelector {
    constructor(containerId, onChange) {
        this.container = document.getElementById(containerId);
        this.onChange = onChange;
        this.selectedValue = null;
        
        // Lamborghini models with 2024/2025 approximate MSRP prices
        this.models = [
            { id: 'huracan', name: 'Huracán EVO', price: 261274, emoji: '🟡' },
            { id: 'huracan-sto', name: 'Huracán STO', price: 327838, emoji: '🟠' },
            { id: 'huracan-tecnica', name: 'Huracán Tecnica', price: 302064, emoji: '🟡' },
            { id: 'urus', name: 'Urus S', price: 239050, emoji: '🔵' },
            { id: 'urus-performante', name: 'Urus Performante', price: 260676, emoji: '🔵' },
            { id: 'revuelto', name: 'Revuelto', price: 608358, emoji: '🔴' },
            { id: 'aventador-svj', name: 'Aventador SVJ (Used)', price: 550000, emoji: '🟣' },
            { id: 'sian', name: 'Sián FKP 37 (Collector)', price: 3600000, emoji: '💎' }
        ];
        
        this.render();
        this.attachEventListeners();
    }
    
    render() {
        const optionsHTML = this.models.map(model => 
            `<option value="${model.id}" data-price="${model.price}">
                ${model.emoji} ${model.name} - $${model.price.toLocaleString()}
            </option>`
        ).join('');
        
        this.container.innerHTML = `
            <div class="input-header">
                <span class="input-icon">🏎️</span>
                <span class="input-title">Lamborghini Model</span>
            </div>
            <p class="input-description">Choose your dream Lambo</p>
            <select class="form-control" id="lambo-select">
                <option value="" disabled selected>Select a model...</option>
                ${optionsHTML}
            </select>
            <div class="model-preview" id="model-preview"></div>
        `;
    }
    
    attachEventListeners() {
        const select = this.container.querySelector('#lambo-select');
        
        select.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const modelId = e.target.value;
            const price = parseInt(selectedOption.dataset.price);
            const model = this.models.find(m => m.id === modelId);
            
            this.selectedValue = { id: modelId, price: price, model: model };
            
            // Update preview
            const preview = this.container.querySelector('#model-preview');
            preview.innerHTML = `
                <div class="result-stat" style="margin-top: var(--space-md);">
                    <span class="result-stat-value">$${price.toLocaleString()}</span>
                    <span class="result-stat-label">Target Price</span>
                </div>
            `;
            
            if (this.onChange) {
                this.onChange(this.selectedValue);
            }
        });
    }
    
    getValue() {
        return this.selectedValue;
    }
    
    getPrice() {
        return this.selectedValue ? this.selectedValue.price : null;
    }
}
