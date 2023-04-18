import "./Header.css";
import logo from "../assets/logo2.png";
import React from "react";

const Header = () => {
  return (
    <header>
      <img className="header-img" alt="Logo" src={logo} />
      <div className="name">Currency Converter</div>
      <button className="contact-us">Contact Us</button>
    </header>
  );
};
export default Header;

