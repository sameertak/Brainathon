import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2023 Company, Inc. All rights reserved.</p>
        <ul className="footer-links">
          <li><a href="https://www.example.com">Terms of Service</a></li>
          <li><a href="https://www.example.com">Privacy Policy</a></li>
          <li><a href="https://www.example.com">Cookie Policy</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

