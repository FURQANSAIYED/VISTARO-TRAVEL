// Global object to store currency exchange rates
const exchangeRates = {
  usd: 0.012,
  eur: 0.011,
  aed: 0.044,
  gbp: 0.0095
};

// Attempt to fetch live INR rates once the page loads
async function fetchRates() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    exchangeRates.usd = data.rates.USD;
    exchangeRates.eur = data.rates.EUR;
    exchangeRates.aed = data.rates.AED;
    if (data.rates.GBP) exchangeRates.gbp = data.rates.GBP;
  } catch (err) {
    console.warn('Using fallback exchange rates', err);
  }
}

function buildTrip() {
  const dest = document.getElementById('dest').value;
  const nights = parseInt(document.getElementById('nights').value || '0', 10);
  const travelers = parseInt(
    document.getElementById('travelers').value || '1',
    10
  );
  const baseRates = {
    dubai: 5000,
    europe: 10000,
    maldives: 7000
  };
  const total = (baseRates[dest] || 0) * nights * travelers;
  document.getElementById('trip-result').innerText = `Estimated cost: ₹${total.toLocaleString()}`;
}

function convertCurrency(event) {
  if (event) event.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value || '0');
  const currency = document.getElementById('currency').value;
  const rate = exchangeRates[currency] || 0;
  const result = amount * rate;
  document.getElementById('conversion-result').innerText = `Converted amount: ${result.toFixed(2)}`;
}

// Setup listeners after DOM loads
window.addEventListener('DOMContentLoaded', () => {
  fetchRates();
  const builderForm = document.getElementById('trip-builder-form');
  if (builderForm) builderForm.addEventListener('submit', (e) => { e.preventDefault(); buildTrip(); });
  const converterForm = document.getElementById('converter-form');
  if (converterForm) converterForm.addEventListener('submit', convertCurrency);
  console.log('Vistaro Travel loaded');
});
