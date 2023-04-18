import React, { useState, useEffect } from "react";
import "./Dashboard-style.css";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';


const Dashboard = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [quoteCurrency, setQuoteCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
      .then((res) => res.json())
      .then((data) => setRate(data.rates[quoteCurrency]));
  }, [baseCurrency, quoteCurrency]);

  useEffect(() => {
    setConvertedAmount((amount * rate).toFixed(2));
  }, [amount, rate]);

  const handleBaseCurrencyChange = (event) => {
    setBaseCurrency(event.target.value);
  };

  const handleQuoteCurrencyChange = (event) => {
    setQuoteCurrency(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSwapCurrency = () => {
    setBaseCurrency(quoteCurrency);
    setQuoteCurrency(baseCurrency);
  };

  return (
    <div className="dashboard">
      <div className="converter">
        <div className="input-group">
          <label htmlFor="base-currency">Base Currency</label>
          <select id="base-currency" value={baseCurrency} onChange={handleBaseCurrencyChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
            <option value="CHF">CHF</option>
            <option value="CNY">CNY</option>
          </select>
          {/* <button onClick={handleSwapCurrency}>Swap</button> */}
          {/* <button onClick={handleSwapCurrency}>Swap</button> */}

          <SwapHorizIcon onClick={handleSwapCurrency} />
          <label htmlFor="quote-currency">Quote Currency</label>
          <select id="quote-currency" value={quoteCurrency} onChange={handleQuoteCurrencyChange}>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
            <option value="CHF">CHF</option>
            <option value="CNY">CNY</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="amount">Amount</label>
          <input id="amount" type="number" min="0" step="0.01" value={amount} onChange={handleAmountChange} />
          <label htmlFor="amount">Amount</label>
          <input id="amount" type="number" min="0" step="0.01" />
        </div>
        
        <div className="output">
          <p>
            {amount} {baseCurrency} = {convertedAmount} {quoteCurrency}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

