import React, { useState, useRef, useEffect } from "react";
import "./navbarAfter.css";
import logoImage from "../../../assets/loopNav.png";
import { useNavigate } from "react-router-dom";

function NavbarAfter() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserData(user);
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login"); 
      }
    } else {
      navigate("/login"); 
    }
  }, [navigate]);

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
    console.log("Logging out...");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getAvatarUrl = () => {
    if (!userData || !userData.first_name || !userData.last_name) {
      return "https://ui-avatars.com/api/?name=User&background=667eea&color=fff&bold=true&size=128";
    }
    const fullName = `${userData.first_name} ${userData.last_name}`;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=667eea&color=fff&bold=true&size=128`;
    console.log("Avatar URL:", avatarUrl); // Debug log
    return avatarUrl;
  };

  const getFullName = () => {
    if (!userData) return "User";
    return `${userData.first_name} ${userData.last_name}`;
  };

  if (!userData) {
    return null;
  }

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
            <a href="#how">How it Works</a>
          </li>
          <li>
            <a href="#impact">Impact</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
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
                src={getAvatarUrl()}
                alt="User Avatar"
                className="avatar-image"
                onError={(e) => {
                  console.error("Avatar failed to load, using fallback");
                  e.target.src =
                    "https://ui-avatars.com/api/?name=U&background=667eea&color=fff&bold=true&size=128";
                }}
              />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <img
                      src={getAvatarUrl()}
                      alt="User Avatar"
                      onError={(e) => {
                        e.target.src =
                          "https://ui-avatars.com/api/?name=U&background=667eea&color=fff&bold=true&size=128";
                      }}
                    />
                  </div>
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{getFullName()}</p>
                    <p className="dropdown-email">{userData.gmail}</p>
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
