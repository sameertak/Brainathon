import React, { useState, useEffect } from "react";
import "./Dashboard-style.css";

const Dashboard = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [quoteCurrency, setQuoteCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    fetch(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}&symbols=${quoteCurrency}`)
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

  const handleConvertClick = () => {
    setConvertedAmount((amount * rate).toFixed(2));
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
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="quote-currency">Quote Currency</label>
          <select id="quote-currency" value={quoteCurrency} onChange={handleQuoteCurrencyChange}>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="amount">Amount</label>
          <input id="amount" type="number" min="0" step="0.01" value={amount} onChange={handleAmountChange} />
        </div>
        <button className="convert-button" onClick={handleConvertClick}>Convert</button>
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
