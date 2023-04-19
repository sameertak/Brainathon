import React, { useState, useEffect } from "react";
import "./CurrencyTable.css";
import { Col, Form, Pagination, Row } from "react-bootstrap";
import { MenuItem } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

function CurrencyTable() {
  const [fromCountry, setFromCountry] = useState([]);
  const [country, setCountry] = useState("USD");
  const [tableData, setTableData] = useState();
  const [countryCode, setCountryCode] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (fromCountry.length > 0) {
  //     countryId(fromCountry[0].country_id);
  //   }
  // }, [fromCountry]);

  const fetchData = async () => {
    const res = await fetch(`http://127.0.0.1:8000/superadmin/getcountry/`, {
      method: "GET",
    });
    const result = await res.json();
    setFromCountry(result.data);
  };

  const countryId = async (e) => {
    setCountryCode(e);
    console.log(e);

    const res = await fetch(`http://127.0.0.1:8000/superadmin/userrates/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_id: e,
      }),
    });
    const result = await res.json();
    setTableData(result.data);
  };

  return (
    <div className="currency-table">
      <h2>Currency Exchange Rates</h2>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel
          id="demo-simple-select-helper-label"
          style={{ backgroundColor: "white", padding: "0 0.45rem" }}
        >
          Select Country
        </InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          name="from_currency"
          onChange={(e) => {
            countryId(e.target.value);
          }}
        >
          {fromCountry
            ? fromCountry.map((d, id) => (
                <MenuItem key={id} value={d.country_id}>
                  {d.country_name} ({d.country_id})
                </MenuItem>
              ))
            : null}
        </Select>
      </FormControl>

      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Exchange Rate ({countryCode})</th>
          </tr>
        </thead>
        <tbody>
          {tableData
            ? tableData.map((d, id) => (
                <tr key={id}>
                  <td>{d.to_id}</td>
                  <td>{parseFloat(d.rate).toFixed(3)}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}

export default CurrencyTable;
