import React from "react";
import "./NavbarTest.css";
import logoImage from "../../../assets/loopFooter.png";
import { useNavigate } from "react-router-dom";

function NavbarTest() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo">
          <div className="logo-icon">
            <img
              src={logoImage}
              alt="Loop logo"
              className="logo-image"
              onClick={() => navigate("/")}
            />
          </div>
          {/* <span className="logo-text">Loop</span> */}
        </div>

        {/* left side nav */}
        <ul className="navbar__links navbar__links--left">
          {/* <li>
            <a href="#home">Home</a>
          </li> */}
          <li>
            <a href="#how-it-works">How it Works</a>
          </li>
          <li>
            <a href="#impact" >Impact</a>
          </li>
          <li>
            <a href="./contact">Contact</a>
          </li>
          <li>
            <a href="./about">About</a>
          </li>
        </ul>

        {/* right side auth */}
        <ul className="navbar__links navbar__auth">
          <li>
            <a href="./login" className="nav-login">
              Login
            </a>
          </li>
          <li>
            <a href="./signup" className="nav-signup">
              SignUp
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default NavbarTest;
