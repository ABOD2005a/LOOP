import { useState, useRef, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/loopNav.png";

const Profile = () => {
  const [activePage, setActivePage] = useState("profile");
  const [editMode, setEditMode] = useState({ personal: false, address: false });
  const [avatar, setAvatar] = useState(
    "https://avatar.iran.liara.run/username?username=User"
  );
  const [loading, setLoading] = useState(true);
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
  ];

  useEffect(() => {
    fetchUserData();
    if (userId) {
      fetchAddressData();
    }
  }, [userId]);

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
      const response = await fetch(`http://localhost:8081/address/${userId}`);
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
      const response = await fetch(`http://localhost:8081/user/${userId}`, {
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
        `http://localhost:8081/address/${userId}`
      );
      const checkData = await checkResponse.json();

      const method = checkData.hasAddress ? "PUT" : "POST";
      const url = checkData.hasAddress
        ? `http://localhost:8081/address/${userId}`
        : `http://localhost:8081/address`;

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

  const cancelEdit = (section) => {
    if (section === "personal") {
      setPersonalData({ ...originalData.personal });
    } else {
      setAddressData({ ...originalData.address });
    }
    toggleEdit(section);
  };

  return (
    <div className="profile-page">
      <aside className="sidebar">
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
            localStorage.clear();
            navigate("/");
          }}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Log-out</span>
        </a>
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

            <div className="stats-grid">
              <div className="stat-card primary">
                <h3>45</h3>
                <p>Total Orders</p>
              </div>
              <div className="stat-card secondary">
                <h3>3</h3>
                <p>Pending Orders</p>
              </div>
              <div className="stat-card warning">
                <h3>1</h3>
                <p>On the Way</p>
              </div>
              <div className="stat-card danger">
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
        )}

        {activePage === "profile" && (
          loading ? (
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
                        setPersonalData({ ...personalData, lastName: e.target.value })
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
                        setAddressData({ ...addressData, floor: e.target.value })
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
                        setAddressData({ ...addressData, apartment: e.target.value })
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
          )
        )}

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
                <button
                  type="button"
                  className="btn btn-primary"
                >
                  <i className="bi bi-check-circle-fill"></i>
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;