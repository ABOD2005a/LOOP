import { useState, useRef } from "react";
import logoImage from "../../assets/loopNav.png";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activePage, setActivePage] = useState("profile");
  const [showAlert, setShowAlert] = useState(false);
  const [editMode, setEditMode] = useState({ personal: false, address: false });
  const [avatar, setAvatar] = useState("3mk.jpg");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [personalData, setPersonalData] = useState({
    firstName: "Abdallah",
    lastName: "Elwasify",
    email: "abdallahelwasify0@gmail.com",
    phone: "+20 109 640 2629",
    bio: "Founder",
  });

  const [addressData, setAddressData] = useState({
    country: "Arab Republic of Egypt",
    city: "Elsharqia, Egypt",
    postal: "44681",
    tax: "AS56417896",
  });

  const [originalData, setOriginalData] = useState({
    personal: { ...personalData },
    address: { ...addressData },
  });

  const orders = [
    {
      id: "#3933",
      date: "4 April, 2021",
      total: "$135.00",
      items: 5,
      status: "processing",
    },
    {
      id: "#5045",
      date: "27 Mar, 2021",
      total: "$25.00",
      items: 1,
      status: "on-the-way",
    },
    {
      id: "#5028",
      date: "20 Mar, 2021",
      total: "$250.00",
      items: 4,
      status: "completed",
    },
    {
      id: "#4600",
      date: "19 Mar, 2021",
      total: "$35.00",
      items: 1,
      status: "completed",
    },
    {
      id: "#4152",
      date: "18 Mar, 2021",
      total: "$578.00",
      items: 13,
      status: "completed",
    },
    {
      id: "#8811",
      date: "10 Mar, 2021",
      total: "$345.00",
      items: 7,
      status: "completed",
    },
    {
      id: "#3535",
      date: "5 Mar, 2021",
      total: "$560.00",
      items: 2,
      status: "completed",
    },
    {
      id: "#1374",
      date: "27 Feb, 2021",
      total: "$560.00",
      items: 2,
      status: "completed",
    },
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
        displayAlert();
      };
      reader.readAsDataURL(file);
    }
  };

  const displayAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const toggleEdit = (section) => {
    setEditMode((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const saveEdit = (section) => {
    if (section === "personal") {
      setOriginalData((prev) => ({ ...prev, personal: { ...personalData } }));
    } else {
      setOriginalData((prev) => ({ ...prev, address: { ...addressData } }));
    }
    toggleEdit(section);
    displayAlert();
  };

  const cancelEdit = (section) => {
    if (section === "personal") {
      setPersonalData({ ...originalData.personal });
    } else {
      setAddressData({ ...originalData.address });
    }
    toggleEdit(section);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      alert("Logged out successfully!");
    }
  };

  const Sidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <img
            src={logoImage}
            alt="Loop logo"
            className="logo-image"
            onClick={() => navigate("/homeAfter")}
          />
        </div>
      </div>

      <a
        href="#"
        className={`nav-link ${activePage === "profile" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          setActivePage("profile");
        }}
      >
        <i className="bi bi-person-circle"></i>
        <span>Profile</span>
      </a>
      <a
        href="#"
        className={`nav-link ${activePage === "dashboard" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          setActivePage("dashboard");
        }}
      >
        <i className="bi bi-speedometer2"></i>
        <span>Dashboard</span>
      </a>
      <a
        href="#"
        className={`nav-link ${activePage === "settings" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          setActivePage("settings");
        }}
      >
        <i className="bi bi-gear"></i>
        <span>Settings</span>
      </a>
      <a
        href="#"
        className="nav-link logout"
        onClick={(e) => {
          e.preventDefault();
          handleLogout();
        }}
      >
        <i className="bi bi-box-arrow-right"></i>
        <span>Log-out</span>
      </a>
    </aside>
  );

  const Alert = () => (
    <div className={`alert ${showAlert ? "show" : ""}`}>
      <div className="alert-icon">✓</div>
      <span className="alert-text">Changes saved successfully!</span>
      <button className="alert-close" onClick={() => setShowAlert(false)}>
        ×
      </button>
    </div>
  );

  const DashboardPage = () => (
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

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="icon">
            <i className="bi bi-bag-check"></i>
          </div>
          <h3>45</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card secondary">
          <div className="icon">
            <i className="bi bi-clock-history"></i>
          </div>
          <h3>3</h3>
          <p>Pending Orders</p>
        </div>
        <div className="stat-card warning">
          <div className="icon">
            <i className="bi bi-truck"></i>
          </div>
          <h3>1</h3>
          <p>On the Way</p>
        </div>
        <div className="stat-card danger">
          <div className="icon">
            <i className="bi bi-star"></i>
          </div>
          <h3>890</h3>
          <p>Reward Points</p>
        </div>
      </div>

      <div className="content-card">
        <h3 className="section-title">
          <i className="bi bi-arrow-repeat"></i>
          Order History
        </h3>

        <div className="table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.date}</td>
                  <td>
                    {order.total} ({order.items} Products)
                  </td>
                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status === "on-the-way"
                        ? "On the way"
                        : order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <a href="#" className="view-btn">
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button disabled>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );

  const ProfilePage = () => (
    <div className="page-content">
      <div className="page-header">
        <div className="breadcrumb">
          <a href="#">
            <i className="bi bi-house-door"></i>
          </a>
          <span>›</span>
          <a href="#">Account</a>
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
            <input
              type="file"
              ref={fileInputRef}
              className="avatar-input"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="profile-info">
            <h2>
              {personalData.firstName} {personalData.lastName}
            </h2>
            <p>
              <i className="bi bi-briefcase-fill"></i>
              {personalData.bio}
            </p>
            <p>
              <i className="bi bi-geo-alt-fill"></i>Zagazig, Elsharqia, Egypt
            </p>
          </div>
        </div>
      </div>

      <div className="content-card">
        <button className="edit-btn" onClick={() => toggleEdit("personal")}>
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
                setPersonalData({ ...personalData, firstName: e.target.value })
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
                setPersonalData({ ...personalData, lastName: e.target.value })
              }
              disabled={!editMode.personal}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={personalData.email}
              onChange={(e) =>
                setPersonalData({ ...personalData, email: e.target.value })
              }
              disabled={!editMode.personal}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={personalData.phone}
              onChange={(e) =>
                setPersonalData({ ...personalData, phone: e.target.value })
              }
              disabled={!editMode.personal}
            />
          </div>
          <div className="form-group full-width">
            <label className="form-label">Bio</label>
            <input
              type="text"
              className="form-input"
              value={personalData.bio}
              onChange={(e) =>
                setPersonalData({ ...personalData, bio: e.target.value })
              }
              disabled={!editMode.personal}
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
        <button className="edit-btn" onClick={() => toggleEdit("address")}>
          <i className="bi bi-pencil-fill"></i>
          <span>Edit</span>
        </button>

        <h3 className="section-title">
          <i className="bi bi-house-fill"></i>
          Address Information
        </h3>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-input"
              value={addressData.country}
              onChange={(e) =>
                setAddressData({ ...addressData, country: e.target.value })
              }
              disabled={!editMode.address}
            />
          </div>
          <div className="form-group">
            <label className="form-label">City / State</label>
            <input
              type="text"
              className="form-input"
              value={addressData.city}
              onChange={(e) =>
                setAddressData({ ...addressData, city: e.target.value })
              }
              disabled={!editMode.address}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Postal Code</label>
            <input
              type="text"
              className="form-input"
              value={addressData.postal}
              onChange={(e) =>
                setAddressData({ ...addressData, postal: e.target.value })
              }
              disabled={!editMode.address}
            />
          </div>
          <div className="form-group">
            <label className="form-label">TAX ID</label>
            <input
              type="text"
              className="form-input"
              value={addressData.tax}
              onChange={(e) =>
                setAddressData({ ...addressData, tax: e.target.value })
              }
              disabled={!editMode.address}
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
  );

  const SettingsPage = () => (
    <div className="page-content">
      <div className="page-header">
        <div className="breadcrumb">
          <a href="#">
            <i className="bi bi-house-door"></i>
          </a>
          <span>›</span>
          <a href="#">Account</a>
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={displayAlert}
          >
            <i className="bi bi-check-circle-fill"></i>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <Sidebar />
      <Alert />
      <main className="main-content">
        {activePage === "dashboard" && <DashboardPage />}
        {activePage === "profile" && <ProfilePage />}
        {activePage === "settings" && <SettingsPage />}
      </main>
    </div>
  );
};

export default Profile;
