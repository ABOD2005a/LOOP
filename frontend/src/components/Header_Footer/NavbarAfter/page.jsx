import React, { useState, useRef, useEffect } from "react";
import "./navbarAfter.css";
import logoImage from "../../../assets/loopNav.png";
import { useNavigate } from "react-router-dom";

function NavbarAfter() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    console.log("✅ Logging out...");

    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userEmail");

    navigate("/"); 
  };

  const getInitials = () => {
    if (!user) return "?";
    const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || "";
    const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "?";
  };

  const getAvatarColor = () => {
    if (!user) return "#6366f1";
    const name = `${user.first_name}${user.last_name}`;
    const colors = [
      "#6366f1",
      "#8b5cf6", 
      "#ec4899", 
      "#f59e0b", 
      "#10b981", 
      "#3b82f6",
      "#ef4444", 
      "#06b6d4", 
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo">
          <div className="logo-icon">
            <img
              src={logoImage}
              alt="Loop logo"
              className="logo-image"
              onClick={() => navigate("/homeAfter")}
            />
          </div>
        </div>

        <ul className="navbar__links navbar__links--left">
          <li>
            <a href="#how-it-works">How it Works</a>
          </li>
          <li>
            <a href="#impact">Impact</a>
          </li>
          <li>
            <a href="./contact">Contact</a>
          </li>
          <li>
            <a href="./About">About</a>
          </li>
        </ul>

        <div className="navbar__auth">
          <button className="btn-book-now" onClick={() => navigate("../choose")}>
            <i className="fas fa-calendar-check"></i>
            <span>Book Now</span>
          </button>

          <div className="user-menu" ref={dropdownRef}>
            <button className="avatar-button" onClick={toggleDropdown}>
              <div
                className="avatar-initials"
                style={{ backgroundColor: getAvatarColor() }}
              >
                {getInitials()}
              </div>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <div
                      className="avatar-initials"
                      style={{ backgroundColor: getAvatarColor() }}
                    >
                      {getInitials()}
                    </div>
                  </div>
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">
                      {user
                        ? `${user.first_name} ${user.last_name}`
                        : "Loading..."}
                    </p>
                    <p className="dropdown-email">
                      {user ? user.gmail : "Loading..."}
                    </p>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <ul className="dropdown-list">
                  <li>
                    <button 
                      onClick={() => navigate('/profile')} 
                      className="dropdown-item"
                    >
                      <i className="fas fa-user"></i>
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/profile#dashboard')} 
                      className="dropdown-item"
                    >
                      <i className="fas fa-calendar-alt"></i>
                      <span>My Bookings</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/profile#settings')} 
                      className="dropdown-item"
                    >
                      <i className="fas fa-cog"></i>
                      <span>Settings</span>
                    </button>
                  </li>
                </ul>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item dropdown-logout"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          <button className="navbar__toggle" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${isMobileMenuOpen ? 'active' : ''}`} ref={mobileMenuRef}>
        <ul className="navbar__mobile-links">
          <li>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
          </li>
          <li>
            <a href="#impact" onClick={() => setIsMobileMenuOpen(false)}>Impact</a>
          </li>
          <li>
            <a href="./contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          </li>
          <li>
            <a href="./About" onClick={() => setIsMobileMenuOpen(false)}>About</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavbarAfter;