/**
 * Calculator Module
 * Handles all financial calculations for the "When Lambo?" app
 * Includes compound growth, inflation adjustment, and monthly contributions
 */

const Calculator = {
    /**
     * Calculate the future value of Bitcoin holdings with monthly contributions
     * Uses compound growth formula with regular additions
     * 
     * @param {number} currentBtcHoldings - Current BTC owned
     * @param {number} currentBtcPrice - Current BTC price in USD
     * @param {number} monthlyContributionUsd - Monthly USD investment
     * @param {number} annualGrowthRate - Expected annual BTC growth (decimal, e.g., 0.20 for 20%)
     * @param {number} months - Number of months to project
     * @returns {object} - Future BTC holdings and USD value
     */
    calculateFutureValue(currentBtcHoldings, currentBtcPrice, monthlyContributionUsd, annualGrowthRate, months) {
        // Monthly growth rate (convert annual to monthly)
        const monthlyGrowthRate = Math.pow(1 + annualGrowthRate, 1 / 12) - 1;

        let totalBtc = currentBtcHoldings;
        let btcPrice = currentBtcPrice;

        for (let month = 1; month <= months; month++) {
            // Price grows each month
            btcPrice = btcPrice * (1 + monthlyGrowthRate);

            // Add monthly contribution (converted to BTC at current price)
            if (monthlyContributionUsd > 0) {
                const btcBought = monthlyContributionUsd / btcPrice;
                totalBtc += btcBought;
            }
        }

        return {
            btcHoldings: totalBtc,
            btcPrice: btcPrice,
            usdValue: totalBtc * btcPrice
        };
    },

    /**
     * Calculate the inflation-adjusted price of the Lamborghini
     * 
     * @param {number} basePrice - Current Lambo price in USD
     * @param {number} annualInflationRate - Expected annual inflation (decimal)
     * @param {number} months - Number of months in the future
     * @returns {number} - Inflation-adjusted price
     */
    calculateInflatedPrice(basePrice, annualInflationRate, months) {
        const years = months / 12;
        return basePrice * Math.pow(1 + annualInflationRate, years);
    },

    /**
     * Find the month when the user can afford the Lamborghini
     * Uses binary search for efficiency, then linear refinement
     * 
     * @param {object} params - All calculation parameters
     * @returns {object} - Result with date, months, and details
     */
    findLamboDate(params) {
        const {
            currentBtcHoldings,
            currentBtcPrice,
            monthlyContributionUsd,
            annualGrowthRate,
            annualInflationRate,
            lamboBasePrice
        } = params;

        // Validate inputs
        if (!currentBtcPrice || currentBtcPrice <= 0) {
            return { success: false, error: 'BTC price not available' };
        }

        if (!lamboBasePrice || lamboBasePrice <= 0) {
            return { success: false, error: 'Please select a Lamborghini model' };
        }

        if (currentBtcHoldings <= 0 && monthlyContributionUsd <= 0) {
            return { success: false, error: 'Please enter BTC holdings or monthly savings' };
        }

        // Check if already affordable
        const currentValue = currentBtcHoldings * currentBtcPrice;
        if (currentValue >= lamboBasePrice) {
            return {
                success: true,
                months: 0,
                date: new Date(),
                currentValue: currentValue,
                lamboPrice: lamboBasePrice,
                btcPrice: currentBtcPrice,
                btcHoldings: currentBtcHoldings,
                message: "You can already afford it! 🎉"
            };
        }

        // Search for the month when we can afford it (max 50 years = 600 months)
        const maxMonths = 600;

        for (let months = 1; months <= maxMonths; months++) {
            const future = this.calculateFutureValue(
                currentBtcHoldings,
                currentBtcPrice,
                monthlyContributionUsd,
                annualGrowthRate,
                months
            );

            const inflatedLamboPrice = this.calculateInflatedPrice(
                lamboBasePrice,
                annualInflationRate,
                months
            );

            if (future.usdValue >= inflatedLamboPrice) {
                // Found the month!
                const targetDate = new Date();
                targetDate.setMonth(targetDate.getMonth() + months);

                return {
                    success: true,
                    months: months,
                    years: Math.floor(months / 12),
                    remainingMonths: months % 12,
                    date: targetDate,
                    futureValue: future.usdValue,
                    lamboPrice: inflatedLamboPrice,
                    btcPrice: future.btcPrice,
                    btcHoldings: future.btcHoldings,
                    totalContributed: monthlyContributionUsd * months
                };
            }
        }

        // Could not afford within 50 years
        return {
            success: false,
            error: 'With current parameters, it would take more than 50 years. Consider increasing savings or adjusting expectations.',
            months: maxMonths
        };
    },

    /**
     * Format a date as "Month Year" (e.g., "March 2028")
     */
    formatDate(date) {
        const options = { month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    /**
     * Format a number as USD currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Format years and months nicely
     */
    formatDuration(months) {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (years === 0) {
            return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
        } else if (remainingMonths === 0) {
            return `${years} year${years !== 1 ? 's' : ''}`;
        } else {
            return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
        }
    }
};
