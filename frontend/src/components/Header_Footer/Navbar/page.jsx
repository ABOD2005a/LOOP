import React, { useState } from 'react';
import './nav.css';
import logoImage from '../../../assets/loopNav.png';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo">
          <div className="logo-icon">
            <img src={logoImage} alt="Loop logo" className="logo-image" />
          </div>
          {/* <span className="logo-text">Loop</span> */}
        </div>

        {/* left side nav */}
        <ul className={`navbar__links navbar__links--left ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#home">Home</a></li>
          <li><a href="#how">How it Works</a></li>
          <li><a href="#impact">Impact</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* right side auth */}
        <ul className={`navbar__links navbar__auth ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#login" className="nav-login">Login</a></li>
          <li><a href="#signup" className="nav-signup">SignUp</a></li>
        </ul>

        <button 
          className={`navbar__toggle ${isMenuOpen ? 'active' : ''}`}
          id="navToggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;