import "./header.css";
import logo from "../assets/logo.jpg";
import React from "react";

const Header = () => {
  return (
    <>
      <header className="header-main">
        <img className="header-img" src={logo}></img>
        <span>
          <select name="support">
            <option value="Contact Us">Contact Us</option>
            <option value="Contact Us">Contact Us</option>
          </select>
        </span>
      </header>
    </>
  );
};

export default Header;
