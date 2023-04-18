import React, { useState } from 'react';
import './CurrencyTable.css';

function CurrencyTable() {
  const [country, setCountry] = useState('USD');
  const [rates, setRates] = useState({
    'USD': 1.00,
    'EUR': 0.83,
    'JPY': 109.95,
    'GBP': 0.72,
  });

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    // You would typically fetch the new exchange rates for the selected country
    // from an API and update the state with the new rates.
    // For the sake of simplicity, we'll just use some hardcoded rates here.
    if (event.target.value === 'USD') {
      setRates({
        'USD': 1.00,
        'EUR': 0.83,
        'JPY': 109.95,
        'GBP': 0.72,
      });
    } else if (event.target.value === 'EUR') {
      setRates({
        'USD': 1.20,
        'EUR': 1.00,
        'JPY': 131.17,
        'GBP': 0.86,
      });
    } else if (event.target.value === 'JPY') {
      setRates({
        'USD': 0.0091,
        'EUR': 0.0076,
        'JPY': 1.00,
        'GBP': 0.0065,
      });
    } else if (event.target.value === 'GBP') {
      setRates({
        'USD': 1.39,
        'EUR': 1.16,
        'JPY': 153.59,
        'GBP': 1.00,
      });
    }
  };

  return (
    <div className="currency-table">
      <h2>Currency Exchange Rates</h2>
      <label className='select-contry'>
        Select a country
        <select value={country} onChange={handleCountryChange}>
          <option value="USD">United States Dollar (USD)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="JPY">Japanese Yen (JPY)</option>
          <option value="GBP">British Pound Sterling (GBP)</option>
        </select>
      </label>
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Exchange Rate ({country})</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(rates).map((rateCountry) => (
            <tr key={rateCountry}>
              <td>{rateCountry}</td>
              <td>{rates[rateCountry]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CurrencyTable;
