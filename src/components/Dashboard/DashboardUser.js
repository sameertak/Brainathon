import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Col, Form } from "react-bootstrap";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";

const Dashboard = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [quoteCurrency, setQuoteCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [fromCountry, setFromCountry] = useState([]);
  const [toCountry, setToCountry] = useState();
  const [temp, setTemp] = useState();
  const [toCurrency1, setToCurrency1] = useState(0);
  const [toCurrency2, setToCurrency2] = useState(0);
  const [fromId, setFromId] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (fromCountry.length > 0) {
  //     checkStatus(fromCountry[0].country_id);
  //   }
  // }, [fromCountry]);

  // useEffect(() => {
  //   if (toCountry) {
  //     getRates(toCountry[0].to_id);
  //   }
  // }, [toCountry]);

  // useEffect(() => {
  //   if (rate) {
  //     setToCurrency2((1 * rate).toFixed(3));
  //   }
  // }, [rate]);

  // setToCurrency2((1 * rate).toFixed(3));

  const fetchData = async () => {
    const res = await fetch(`http://127.0.0.1:8000/superadmin/getcountry/`, {
      method: "GET",
    });
    const result = await res.json();
    setFromCountry(result.data);
  };

  const checkStatus = async (e) => {
    const res = await fetch(`http://127.0.0.1:8000/superadmin/activerates/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_id: e,
      }),
    });

    setFromId(e);
    const result = await res.json();
    setToCountry(result.data);
    setTemp(result.data[0].from_id);
    setToCurrency1(toCurrency2 * parseFloat(result.data[0].rate));
  };

  const getRates = async (e) => {
    console.log(temp);
    console.log(e);
    const res = await fetch(`http://127.0.0.1:8000/superadmin/getrates/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_id: temp,
        to_id: e,
      }),
    });
    const result = await res.json();
    setRate(result.data[0].rate);
    console.log(fromId);
    setToCurrency1(toCurrency2 * parseFloat(result.data[0].rate));
  };

  const handleAmountChange2 = (e) => {
    setToCurrency2(e);
    setToCurrency1((e * rate).toFixed(3));
  };

  const handleAmountChange1 = (e) => {
    setToCurrency1(e);
    setToCurrency2((e / rate).toFixed(3));
  };

  console.log(toCurrency1, toCurrency2);

  return (
    <div className="dashboard">
      <div className="converter">
        <div className="input-group">
          {/* <label htmlFor="base-currency">Base Currency</label> */}

          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel
              style={{ backgroundColor: "whitesmoke", padding: "0 0.45rem" }}
              id="demo-simple-select-helper-label"
            >
              Select Country
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              name="from_currency"
              onChange={(e) => {
                checkStatus(e.target.value);
              }}
            >
              {fromCountry
                ? fromCountry.map((d, id) => (
                    <MenuItem key={id} value={d.country_id}>
                      {d.country_id}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormControl>

          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="filled-basic"
              label="Amount"
              variant="filled"
              value={toCurrency2}
              onChange={(e) => {
                setToCurrency2(e.target.value);
                handleAmountChange2(e.target.value);
              }}
            />
          </Box>
        </div>
        <div className="input-group">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel
              style={{ backgroundColor: "whitesmoke", padding: "0 0.45rem" }}
              id="demo-simple-select-helper-label"
            >
              Select Country
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              name="to_currency"
              onChange={(e) => getRates(e.target.value)}
            >
              {toCountry
                ? toCountry.map((d, id) => (
                    <MenuItem key={id} value={d.to_id}>
                      {d.to_id}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormControl>

          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            {console.log(toCurrency1)}
            <TextField
              id="filled-basic"
              label="Amount"
              variant="filled"
              value={toCurrency1}
              onChange={(e) => {
                setToCurrency1(e.target.value);
                handleAmountChange1(e.target.value);
              }}
            />
          </Box>
        </div>

        <div className="output">
          <p>
            {/* {amount} {baseCurrency} = {convertedAmount} {quoteCurrency} */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
