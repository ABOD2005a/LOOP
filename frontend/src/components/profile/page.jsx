/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/loopNav.png";
import { API_URL } from "../../config";

const Profile = () => {
  const [activePage, setActivePage] = useState("profile");
  const [editMode, setEditMode] = useState({ personal: false, address: false });
  const [avatar, setAvatar] = useState(
    "https://avatar.iran.liara.run/username?username=User"
  );
  const [loading, setLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [addressData, setAddressData] = useState({
    governorate: "",
    city: "",
    building_number: "",
    floor: "",
    apartment: "",
  });

  const [originalData, setOriginalData] = useState({
    personal: { ...personalData },
    address: { ...addressData },
  });

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    totalEarnings: 0,
  });
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);

  useEffect(() => {
    fetchUserData();
    if (userId) {
      fetchAddressData();
    }
  }, [userId]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'dashboard' || hash === 'settings') {
      setActivePage(hash);
    }
  }, []);

  useEffect(() => {
    if (activePage === "dashboard" && userId) {
      fetchBookingsData();
    }
  }, [activePage, userId]);

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      
      await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      
      // Clear local storage
      localStorage.clear();
      navigate("/"); 
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if API call fails
      localStorage.clear();
      navigate("/");
    }
  };

  const fetchUserData = async () => {
    try {
      const user = localStorage.getItem("user");

      if (user) {
        const userData = JSON.parse(user);
        const firstName = userData.first_name || "";
        const lastName = userData.last_name || "";
        const email = userData.gmail || "";

        const data = {
          firstName,
          lastName,
          email,
        };

        setPersonalData(data);
        setOriginalData((prev) => ({ ...prev, personal: data }));

        setAvatar(
          `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`
        );
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const fetchAddressData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/address/${userId}`);
      const data = await response.json();

      if (response.ok && data.hasAddress) {
        const address = {
          governorate: data.address.governorate || "",
          city: data.address.city || "",
          building_number: data.address.building_number || "",
          floor: data.address.floor?.toString() || "",
          apartment: data.address.apartment?.toString() || "",
        };
        setAddressData(address);
        setOriginalData((prev) => ({ ...prev, address }));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const fetchBookingsData = async () => {
    setDashboardLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/bookings/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setBookings(data.bookings || []);
        calculateStats(data.bookings || []);
      } else {
        console.error("Failed to fetch bookings:", data.message);
        setBookings([]);
        calculateStats([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
      calculateStats([]);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleViewMaterials = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const calculateStats = (bookingsData) => {
    const stats = {
      totalOrders: bookingsData.length,
      pendingOrders: bookingsData.filter((b) => b.status === "pending").length,
      inProgressOrders: bookingsData.filter((b) => b.status === "in_progress")
        .length,
      totalEarnings: bookingsData.reduce(
        (sum, b) => sum + parseFloat(b.total_earnings || 0),
        0
      ),
    };
    setStats(stats);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Pending",
      confirmed: "Confirmed",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = (section) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const saveEdit = async (section) => {
    if (section === "personal") {
      await savePersonalData();
    } else {
      await saveAddressData();
    }
  };

  const savePersonalData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: personalData.firstName,
          last_name: personalData.lastName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = JSON.parse(localStorage.getItem("user"));
        user.first_name = personalData.firstName;
        user.last_name = personalData.lastName;
        localStorage.setItem("user", JSON.stringify(user));

        setAvatar(
          `https://avatar.iran.liara.run/username?username=${personalData.firstName}+${personalData.lastName}`
        );

        setOriginalData((prev) => ({ ...prev, personal: { ...personalData } }));
        toggleEdit("personal");
      }
    } catch (error) {
      console.error("Error saving personal data:", error);
    }
  };

  const saveAddressData = async () => {
    try {
      const checkResponse = await fetch(
        `${API_URL}/api/address/${userId}`
      );
      const checkData = await checkResponse.json();

      const method = checkData.hasAddress ? "PUT" : "POST";
      const url = checkData.hasAddress
        ? `${API_URL}/api/address/${userId}`
        : `${API_URL}/api/address`;

      const body = {
        user_id: parseInt(userId),
        governorate: addressData.governorate,
        city: addressData.city,
        building_number: addressData.building_number,
        floor: parseInt(addressData.floor),
        apartment: parseInt(addressData.apartment),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setOriginalData((prev) => ({ ...prev, address: { ...addressData } }));
        toggleEdit("address");
      }
    } catch (error) {
      console.error("Error saving address data:", error);
    }
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const toggleMobileMenu = () => {
    if (isMenuAnimating) return; // Prevent multiple clicks during animation
    
    setIsMenuAnimating(true);
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    // Reset animation flag after transition
    setTimeout(() => {
      setIsMenuAnimating(false);
    }, 350); // Slightly longer than CSS transition
  };

  const closeMobileMenu = () => {
    if (isMenuAnimating) return;
    
    setIsMenuAnimating(true);
    setIsMobileMenuOpen(false);
    
    setTimeout(() => {
      setIsMenuAnimating(false);
    }, 350);
  };

  const cancelEdit = (section) => {
    if (section === "personal") {
      setPersonalData(originalData.personal);
    } else {
      setAddressData(originalData.address);
    }
    toggleEdit(section);
  };

  return (
    <div className="profile-page">
      {/* Mobile Menu Button */}
      <button 
        className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''} ${isMenuAnimating ? 'animating' : ''}`}
        onClick={toggleMobileMenu}
        disabled={isMenuAnimating}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
          aria-hidden="false"
        ></div>
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon" onClick={() => navigate("/homeAfter")}>
            <span className="logo-text">
              <img
                src={logoImage}
                alt="Loop logo"
                className="logo-image"
                onClick={() => navigate("/homeAfter")}
              />
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a
            href="#"
            className={`nav-link1
               ${activePage === "profile" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("profile");
            }}
          >
            <i className="bi bi-person-circle"></i>
            <span>Profile</span>
          </a>
          <a
            className={`nav-link1 ${activePage === "dashboard" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("dashboard");
            }}
          >
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className={`nav-link1 ${activePage === "settings" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("settings");
            }}
          >
            <i className="bi bi-gear"></i>
            <span>Settings</span>
          </a>
          <a
            href="#"
            className="nav-link1 logout"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Log-out</span>
          </a>
        </nav>
      </aside>

      <main className="main-content">
        {activePage === "dashboard" && (
          <div className="page-content">
            <div className="page-header">
              <div className="breadcrumb">
                <a href="#">
                  <i className="bi bi-house-door"></i>
                </a>
                <span>›</span>
                <span className="active">Dashboard</span>
              </div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">
                Welcome back! Here's your account overview
              </p>
            </div>

            {dashboardLoading ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <p>Loading dashboard...</p>
              </div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card primary">
                    <h3>{stats.totalOrders}</h3>
                    <p>Total Orders</p>
                  </div>
                  <div className="stat-card secondary">
                    <h3>{stats.pendingOrders}</h3>
                    <p>Pending Orders</p>
                  </div>
                  <div className="stat-card warning">
                    <h3>{stats.inProgressOrders}</h3>
                    <p>In Progress</p>
                  </div>
                  <div className="stat-card danger">
                    <h3>EGP {stats.totalEarnings.toFixed(2)}</h3>
                    <p>Total Earnings</p>
                  </div>
                </div>

                <div className="content-card">
                  <h3 className="section-title">
                    <i className="bi bi-arrow-repeat"></i>
                    Order History
                  </h3>

                  {bookings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem" }}>
                      <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                      <p style={{ marginTop: "1rem", color: "#666" }}>
                        No bookings found. Start by creating your first booking!
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="table-container">
                        <table className="order-table">
                          <thead>
                            <tr>
                              <th>ORDER ID</th>
                              <th>DATE</th>
                              <th>AREA</th>
                              <th>WEIGHT</th>
                              <th>EARNINGS</th>
                              <th>STATUS</th>
                              <th>PICKUP</th>
                              <th>ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((booking) => (
                              <tr key={booking.id}>
                                <td className="order-id">#{booking.id}</td>
                                <td>{formatDate(booking.created_at)}</td>
                                <td>{booking.area}</td>
                                <td>{parseFloat(booking.total_weight).toFixed(2)} kg</td>
                                <td>EGP {parseFloat(booking.total_earnings).toFixed(2)}</td>
                                <td>
                                  <span className={`status ${booking.status}`}>
                                    {getStatusLabel(booking.status)}
                                  </span>
                                </td>
                                <td>{formatDate(booking.pickup_date)}</td>
                                <td>
                                  <button
                                    className="view-btn"
                                    onClick={() => handleViewMaterials(booking)}
                                    title="View Materials"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activePage === "profile" &&
          (loading ? (
            <div className="page-content">
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <p>Loading...</p>
              </div>
            </div>
          ) : (
            <div className="page-content">
              <div className="page-header">
                <div className="breadcrumb">
                  <a href="#">
                    <i className="bi bi-house-door"></i>
                  </a>
                  <span>›</span>
                  <span className="active">Profile</span>
                </div>
                <h1 className="page-title">My Profile</h1>
                <p className="page-subtitle">
                  Manage your personal information and preferences
                </p>
              </div>

              <div className="content-card">
                <div className="profile-header">
                  <div
                    className="avatar-container"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <img
                      src={avatar}
                      alt="Profile Picture"
                      className="profile-avatar"
                    />
                    <div className="avatar-overlay">
                      <i className="bi bi-camera-fill"></i>
                    </div>
                  </div>
                  <div className="profile-info">
                    <h2>
                      {personalData.firstName} {personalData.lastName}
                    </h2>
                    <p>
                      <i className="bi bi-envelope-fill"></i>
                      {personalData.email}
                    </p>
                    {addressData.city && (
                      <p>
                        <i className="bi bi-geo-alt-fill"></i>
                        {addressData.city}, {addressData.governorate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="content-card">
                <button
                  className="edit-btn"
                  onClick={() => toggleEdit("personal")}
                >
                  <i className="bi bi-pencil-fill"></i>
                  <span>Edit</span>
                </button>

                <h3 className="section-title">
                  <i className="bi bi-person-fill"></i>
                  Personal Information
                </h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={personalData.firstName}
                      onChange={(e) =>
                        setPersonalData({
                          ...personalData,
                          firstName: e.target.value,
                        })
                      }
                      disabled={!editMode.personal}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={personalData.lastName}
                      onChange={(e) =>
                        setPersonalData({
                          ...personalData,
                          lastName: e.target.value,
                        })
                      }
                      disabled={!editMode.personal}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={personalData.email}
                      disabled={true}
                    />
                  </div>
                </div>

                {editMode.personal && (
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => saveEdit("personal")}
                    >
                      <i className="bi bi-check-circle-fill"></i>
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => cancelEdit("personal")}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="content-card">
                <button
                  className="edit-btn"
                  onClick={() => toggleEdit("address")}
                >
                  <i className="bi bi-pencil-fill"></i>
                  <span>Edit</span>
                </button>

                <h3 className="section-title">
                  <i className="bi bi-house-fill"></i>
                  Address Information
                </h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Governorate</label>
                    <input
                      type="text"
                      className="form-input"
                      value={addressData.governorate}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          governorate: e.target.value,
                        })
                      }
                      disabled={!editMode.address}
                      placeholder="e.g., Cairo"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={addressData.city}
                      onChange={(e) =>
                        setAddressData({ ...addressData, city: e.target.value })
                      }
                      disabled={!editMode.address}
                      placeholder="e.g., Nasr City"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Building Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={addressData.building_number}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          building_number: e.target.value,
                        })
                      }
                      disabled={!editMode.address}
                      placeholder="e.g., 123"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Floor</label>
                    <input
                      type="number"
                      className="form-input"
                      value={addressData.floor}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          floor: e.target.value,
                        })
                      }
                      disabled={!editMode.address}
                      placeholder="e.g., 3"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apartment</label>
                    <input
                      type="number"
                      className="form-input"
                      value={addressData.apartment}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          apartment: e.target.value,
                        })
                      }
                      disabled={!editMode.address}
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>

                {editMode.address && (
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => saveEdit("address")}
                    >
                      <i className="bi bi-check-circle-fill"></i>
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => cancelEdit("address")}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

        {activePage === "settings" && (
          <div className="page-content">
            <div className="page-header">
              <div className="breadcrumb">
                <a href="#">
                  <i className="bi bi-house-door"></i>
                </a>
                <span>›</span>
                <span className="active">Settings</span>
              </div>
              <h1 className="page-title">Settings</h1>
              <p className="page-subtitle">Manage your account preferences</p>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-bell-fill"></i>
                Notifications
              </h3>
              <div className="settings-section">
                <div className="settings-item">
                  <div className="settings-info">
                    <h4>Email Notifications</h4>
                    <p>Receive order updates via email</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="settings-item">
                  <div className="settings-info">
                    <h4>SMS Notifications</h4>
                    <p>Receive order updates via SMS</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="settings-item">
                  <div className="settings-info">
                    <h4>Marketing Emails</h4>
                    <p>Receive promotional offers and news</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-shield-check"></i>
                Privacy & Security
              </h3>
              <div className="settings-section">
                <div className="settings-item">
                  <div className="settings-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="settings-item">
                  <div className="settings-info">
                    <h4>Show Online Status</h4>
                    <p>Let others see when you're active</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-key-fill"></i>
                Change Password
              </h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="btn-group">
                <button type="button" className="btn btn-primary">
                  <i className="bi bi-check-circle-fill"></i>
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Materials Modal */}
      {showModal && selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div 
            className="modal_content" 
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'white' }}
          >
            <div className="modal-header">
              <h2 style={{ color: 'white' }}>
                <i className="bi bi-recycle" style={{ color: 'white' }}></i>
                Booking Materials - Order #{selectedBooking.id}
              </h2>
            </div>
            
            <div className="modal-body" style={{ color: '#1e293b', background: 'white' }}>
              <div className="booking-details">
                <div className="detail-row">
                  <span className="detail-label" style={{ color: '#64748b' }}>Pickup Date:</span>
                  <span className="detail-value" style={{ color: '#1e293b' }}>
                    {formatDate(selectedBooking.pickup_date)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label" style={{ color: '#64748b' }}>Pickup Time:</span>
                  <span className="detail-value" style={{ color: '#1e293b' }}>
                    {selectedBooking.pickup_time}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label" style={{ color: '#64748b' }}>Area:</span>
                  <span className="detail-value" style={{ color: '#1e293b' }}>
                    {selectedBooking.area}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label" style={{ color: '#64748b' }}>Address:</span>
                  <span className="detail-value" style={{ color: '#1e293b' }}>
                    {selectedBooking.street}, Building {selectedBooking.building_number}
                    {selectedBooking.floor && `, Floor ${selectedBooking.floor}`}
                    {selectedBooking.apartment && `, Apt ${selectedBooking.apartment}`}
                  </span>
                </div>
                {selectedBooking.landmark && (
                  <div className="detail-row">
                    <span className="detail-label" style={{ color: '#64748b' }}>Landmark:</span>
                    <span className="detail-value" style={{ color: '#1e293b' }}>
                      {selectedBooking.landmark}
                    </span>
                  </div>
                )}
                {selectedBooking.notes && (
                  <div className="detail-row">
                    <span className="detail-label" style={{ color: '#64748b' }}>Notes:</span>
                    <span className="detail-value" style={{ color: '#1e293b' }}>
                      {selectedBooking.notes}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="materials-title" style={{ color: '#1e293b' }}>
                <i className="bi bi-box-seam" style={{ color: '#10b981' }}></i>
                Materials List
              </h3>

              {selectedBooking.items && selectedBooking.items.length > 0 ? (
                <div className="materials-table-container">
                  <table className="materials-table">
                    <thead>
                      <tr>
                        <th style={{ color: '#64748b' }}>Material</th>
                        <th style={{ color: '#64748b' }}>Subtype</th>
                        <th style={{ color: '#64748b' }}>Weight (kg)</th>
                        <th style={{ color: '#64748b' }}>Price/kg</th>
                        <th style={{ color: '#64748b' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBooking.items.map((item, index) => (
                        <tr key={index}>
                          <td style={{ color: '#1e293b' }}>{item.material_name}</td>
                          <td style={{ color: '#1e293b' }}>{item.subtype_name || "-"}</td>
                          <td style={{ color: '#1e293b' }}>{parseFloat(item.weight).toFixed(2)}</td>
                          <td style={{ color: '#1e293b' }}>EGP {parseFloat(item.price_per_kg).toFixed(2)}</td>
                          <td style={{ color: '#1e293b' }}>EGP {parseFloat(item.total_price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="2" style={{ color: '#1e293b' }}><strong>Total</strong></td>
                        <td style={{ color: '#1e293b' }}>
                          <strong>{parseFloat(selectedBooking.total_weight).toFixed(2)} kg</strong>
                        </td>
                        <td></td>
                        <td style={{ color: '#1e293b' }}>
                          <strong>EGP {parseFloat(selectedBooking.total_earnings).toFixed(2)}</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="no-materials" style={{ color: '#64748b' }}>
                  No materials found for this booking.
                </p>
              )}

              <div className="modal-stats">
                <div className="modal-stat">
                  <i className="bi bi-tree-fill" style={{ color: '#10b981' }}></i>
                  <div>
                    <span className="profile-stat-label" style={{ color: '#64748b' }}>CO₂ Saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;