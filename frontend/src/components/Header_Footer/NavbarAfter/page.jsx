import React, { useState, useRef, useEffect } from "react";
import "./navbarAfter.css";
import logoImage from "../../../assets/loopNav.png";
import { useNavigate } from "react-router-dom";

function NavbarAfter() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    console.log("✅ Logging out...");

    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userEmail");

    console.log("✅ تم مسح البيانات من localStorage");

    navigate("/");
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
              onClick={() => navigate("/")}
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
          <button className="btn-book-now" onClick={() => navigate("/booking")}>
            <i className="fas fa-calendar-check"></i>
            <span>Book Now</span>
          </button>

          <div className="user-menu" ref={dropdownRef}>
            <button className="avatar-button" onClick={toggleDropdown}>
              <img
                src="https://avatar.iran.liara.run/public/9"
                alt="User Avatar"
                className="avatar-image"
              />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <img
                      src="https://avatar.iran.liara.run/public/9"
                      alt="User Avatar"
                    />
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
                    <a href="/profile" className="dropdown-item">
                      <i className="fas fa-user"></i>
                      <span>Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="/bookings" className="dropdown-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>My Bookings</span>
                    </a>
                  </li>
                  <li>
                    <a href="/settings" className="dropdown-item">
                      <i className="fas fa-cog"></i>
                      <span>Settings</span>
                    </a>
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
        </div>
      </div>
    </nav>
  );
}

export default NavbarAfter;
