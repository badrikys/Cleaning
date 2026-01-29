/**
 * Aura Cleaning - Calculator Logic
 * Handles pricing calculations based on area and frequency
 */

const Calculator = {
  // Price zones based on apartment size
  zones: {
    zone1: { min: 50, max: 90 },
    zone2: { min: 91, max: 150 },
    zone3: { min: 151, max: 250 }
  },

  // Prices per zone (regular = 15% discount)
  prices: {
    zone1: { single: 9900, weekly: 8400 },   // 1 cleaner, ~4 hours
    zone2: { single: 14900, weekly: 12700 }, // 2 cleaners, ~2.5 hours
    zone3: { single: 21900, weekly: 18600 }  // 3 cleaners, ~2.5 hours
  },

  // Area hints with cleaner count
  areaHints: {
    50: '1-2 комнатная • Приедет 1 клинер',
    75: '2-комнатная • Приедет 1 клинер',
    90: '2-3 комнатная • Приедет 1 клинер',
    100: '3-комнатная • Приедут 2 клинера',
    130: '3-4 комнатная • Приедут 2 клинера',
    150: '4-комнатная • Приедут 2 клинера',
    170: 'Большая квартира • Приедут 3 клинера',
    200: 'Пентхаус • Приедут 3 клинера'
  },

  // Frequency labels
  frequencyLabels: {
    single: 'разовая',
    weekly: 'регулярно раз в неделю'
  },

  /**
   * Get zone based on area
   */
  getZone(area) {
    if (area <= 90) return 'zone1';
    if (area <= 150) return 'zone2';
    return 'zone3';
  },

  /**
   * Get price for given area and frequency
   */
  getPrice(area, frequency) {
    const zone = this.getZone(area);
    return this.prices[zone][frequency];
  },

  /**
   * Get monthly cost based on frequency
   */
  getMonthlyPrice(price, frequency) {
    if (!price) return null;
    if (frequency === 'weekly') {
      return price * 4;
    }
    return price;
  },

  /**
   * Calculate savings compared to single cleaning
   */
  getSavings(area, frequency) {
    if (frequency === 'single') return 0;

    const singlePrice = this.getPrice(area, 'single');
    const currentPrice = this.getPrice(area, frequency);

    if (!singlePrice || !currentPrice) return 0;

    return singlePrice - currentPrice;
  },

  /**
   * Get area hint text
   */
  getAreaHint(area) {
    const hints = Object.entries(this.areaHints);
    for (let i = hints.length - 1; i >= 0; i--) {
      if (area >= parseInt(hints[i][0])) {
        return hints[i][1];
      }
    }
    return hints[0][1];
  },

  /**
   * Format price with Russian locale
   */
  formatPrice(price) {
    if (!price) return 'По запросу';
    return new Intl.NumberFormat('ru-RU').format(price) + '₽';
  },

  /**
   * Initialize calculator UI
   */
  init() {
    this.slider = document.getElementById('area-slider');
    this.areaValue = document.getElementById('area-value');
    this.areaHint = document.getElementById('area-hint');
    this.options = document.querySelectorAll('input[name="frequency"]');
    this.resultSummary = document.getElementById('result-summary');
    this.resultPrice = document.getElementById('result-price');
    this.resultMonthly = document.getElementById('result-monthly');
    this.savingElements = document.querySelectorAll('.calculator__option-saving');

    if (!this.slider) return;

    // Event listeners
    this.slider.addEventListener('input', () => this.update());
    this.options.forEach(option => {
      option.addEventListener('change', () => this.update());
    });

    // Update option prices based on slider
    this.slider.addEventListener('input', () => this.updateOptionPrices());

    // Initial update
    this.update();
    this.updateOptionPrices();
  },

  /**
   * Update calculator display
   */
  update() {
    const area = parseInt(this.slider.value);
    const frequency = document.querySelector('input[name="frequency"]:checked').value;

    // Update area display
    this.areaValue.textContent = area;
    this.areaHint.textContent = this.getAreaHint(area);

    // Update slider track
    const percent = ((area - 50) / (250 - 50)) * 100;
    this.slider.style.background = `linear-gradient(to right, #3498DB 0%, #2C3E50 ${percent}%, #E0E7EF ${percent}%, #E0E7EF 100%)`;

    // Get prices
    const price = this.getPrice(area, frequency);
    const monthlyPrice = this.getMonthlyPrice(price, frequency);

    // Update result
    this.resultSummary.textContent = `${area} кв.м, ${this.frequencyLabels[frequency]}`;
    this.resultPrice.textContent = this.formatPrice(price);

    if (frequency === 'single') {
      this.resultMonthly.textContent = '';
    } else if (price) {
      this.resultMonthly.textContent = `${this.formatPrice(monthlyPrice)} раз в месяц`;
    } else {
      this.resultMonthly.textContent = 'Свяжитесь с нами для расчета';
    }
  },

  /**
   * Update prices in options based on current area
   */
  updateOptionPrices() {
    const area = parseInt(this.slider.value);

    // Update single option
    const singlePriceEl = document.getElementById('price-single');
    const singlePrice = this.getPrice(area, 'single');
    if (singlePriceEl) {
      singlePriceEl.textContent = this.formatPrice(singlePrice);
    }

    // Update weekly option
    const weeklyPriceEl = document.getElementById('price-weekly');
    const weeklyMonthlyEl = document.getElementById('monthly-weekly');
    const weeklySavingEl = document.getElementById('saving-weekly');
    const weeklyPrice = this.getPrice(area, 'weekly');

    if (weeklyPriceEl) {
      weeklyPriceEl.textContent = this.formatPrice(weeklyPrice);
    }
    if (weeklyMonthlyEl && weeklyPrice) {
      weeklyMonthlyEl.textContent = `(${this.formatPrice(weeklyPrice * 4)} раз в месяц)`;
    }
    if (weeklySavingEl) {
      const saving = this.getSavings(area, 'weekly');
      weeklySavingEl.textContent = saving > 0 ? `💰 Экономия ${this.formatPrice(saving)} на каждой` : '';
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Calculator.init();
});
