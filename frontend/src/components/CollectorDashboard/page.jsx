import React, { useState, useEffect } from "react";
import "./CollectorDashboard.css";

const API_BASE_URL = "http://localhost:8081/api";

const CollectorDashboard = () => {
  const [activePage, setActivePage] = useState("profile");
  const [showModal, setShowModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [collectorData, setCollectorData] = useState(null);
  const [formData, setFormData] = useState({
    actualQuantity: "",
    wasteType: "",
    notes: "",
  });

  // Get collector ID from localStorage or props
  const collectorId = localStorage.getItem("collector_id") || "1";

  useEffect(() => {
    fetchCollectorData();
    fetchAssignedBookings();
  }, []);

  const fetchCollectorData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/collector/${collectorId}`);
      if (response.ok) {
        const data = await response.json();
        setCollectorData(data.collector);
      }
    } catch (error) {
      console.error("Error fetching collector data:", error);
    }
  };

  const fetchAssignedBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      if (response.ok) {
        const data = await response.json();
        // Filter bookings assigned to this collector (you may need to add collector_id field)
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showAlertMessage("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleNavigation = (page) => {
    if (page === "logout") {
      if (window.confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("collector_id");
        localStorage.removeItem("collector_token");
        showAlertMessage("Logged out successfully!");
        setTimeout(() => (window.location.href = "/collector-login"), 1500);
      }
      return;
    }
    setActivePage(page);
  };

  const startPickup = async (bookingId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "in-progress" }),
        }
      );

      if (response.ok) {
        showAlertMessage(`Started pickup for booking #${bookingId}`);
        fetchAssignedBookings();
      } else {
        throw new Error("Failed to start pickup");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlertMessage("Failed to start pickup");
    }
  };

  const viewDetails = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      alert(
        `Booking Details:\n\nAddress: ${booking.address}\nDate: ${
          booking.pickup_date
        }\nTime: ${booking.pickup_time}\nMaterials: ${booking.materials?.join(
          ", "
        )}`
      );
    }
  };

  const completePickup = (bookingId) => {
    setCurrentRequestId(bookingId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ actualQuantity: "", wasteType: "", notes: "" });
    setCurrentRequestId(null);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const submitPickup = async () => {
    if (!formData.actualQuantity || !formData.wasteType) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/${currentRequestId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "completed",
            actual_quantity: formData.actualQuantity,
            waste_type: formData.wasteType,
            notes: formData.notes,
          }),
        }
      );

      if (response.ok) {
        closeModal();
        showAlertMessage("Pickup confirmed successfully!");
        fetchAssignedBookings();
      } else {
        throw new Error("Failed to complete pickup");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlertMessage("Failed to confirm pickup");
    }
  };

  const saveSettings = () => {
    showAlertMessage("Settings saved successfully!");
  };

  const changePassword = async () => {
    // Add password change logic here
    showAlertMessage("Password updated successfully!");
  };

  // Calculate statistics
  const stats = {
    totalPickups: bookings.filter((b) => b.status === "completed").length,
    todayTasks: bookings.filter((b) => {
      const today = new Date().toISOString().split("T")[0];
      return b.pickup_date === today && b.status !== "completed";
    }).length,
    totalEarnings: bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + (b.total_earnings || 0), 0),
  };

  // Filter bookings by status
  const pendingBookings = bookings.filter((b) => b.status === "scheduled");
  const inProgressBookings = bookings.filter((b) => b.status === "in-progress");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  return (
    <div className="app-container">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />

      <aside className="sidebar">
        <a
          href="#"
          className={`nav-link ${activePage === "profile" ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("profile");
          }}
        >
          <i className="bi bi-person-circle"></i>
          <span>Profile</span>
        </a>
        <a
          href="#"
          className={`nav-link ${activePage === "tasks" ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("tasks");
          }}
        >
          <i className="bi bi-list-check"></i>
          <span>Assigned Pickups</span>
        </a>
        <a
          href="#"
          className={`nav-link ${activePage === "earnings" ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("earnings");
          }}
        >
          <i className="bi bi-currency-dollar"></i>
          <span>Earnings</span>
        </a>
        <a
          href="#"
          className={`nav-link ${activePage === "history" ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("history");
          }}
        >
          <i className="bi bi-clock-history"></i>
          <span>Pickup History</span>
        </a>
        <a
          href="#"
          className={`nav-link ${
            activePage === "notifications" ? "active" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("notifications");
          }}
        >
          <i className="bi bi-bell"></i>
          <span>Notifications</span>
          <span className="notification-badge">{pendingBookings.length}</span>
        </a>
        <a
          href="#"
          className={`nav-link ${activePage === "settings" ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("settings");
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
            handleNavigation("logout");
          }}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Log-out</span>
        </a>
      </aside>

      <div className={`alert ${showAlert ? "show" : ""}`}>
        <div className="alert-icon">✓</div>
        <span className="alert-text">{alertMessage}</span>
      </div>

      <main className="main-content">
        {activePage === "profile" && (
          <div className="page-content">
            <div className="page-header">
              <h1 className="page-title">Worker Profile</h1>
              <p className="page-subtitle">
                Your account information and work details
              </p>
            </div>

            <div className="content-card profile-card">
              <div className="profile-avatar">
                {collectorData?.name?.charAt(0) || "C"}
              </div>
              <div className="profile-info">
                <h2>{collectorData?.name || "Collector"}</h2>
                <p>
                  <i className="bi bi-person-badge"></i>Worker ID:{" "}
                  {collectorData?.id || collectorId}
                </p>
                <p>
                  <i className="bi bi-geo-alt-fill"></i>Assigned Zone: Nasr City
                  - Zone A
                </p>
                <p>
                  <span className="status-badge active">Active</span>
                </p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="icon">
                  <i className="bi bi-check-circle"></i>
                </div>
                <h3>{stats.totalPickups}</h3>
                <p>Total Pickups</p>
              </div>
              <div className="stat-card secondary">
                <div className="icon">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h3>{stats.todayTasks}</h3>
                <p>Today's Tasks</p>
              </div>
              <div className="stat-card success">
                <div className="icon">
                  <i className="bi bi-currency-dollar"></i>
                </div>
                <h3>${stats.totalEarnings.toFixed(2)}</h3>
                <p>Total Earnings</p>
              </div>
            </div>
          </div>
        )}

        {activePage === "tasks" && (
          <div className="page-content">
            <div className="page-header">
              <h1 className="page-title">Assigned Pickups</h1>
              <p className="page-subtitle">Your daily collection tasks</p>
            </div>

            {loading ? (
              <div className="content-card">
                <p style={{ textAlign: "center", padding: "2rem" }}>
                  Loading bookings...
                </p>
              </div>
            ) : (
              <div className="content-card">
                <h3 className="section-title">
                  <i className="bi bi-list-task"></i>
                  Today's Tasks (
                  {pendingBookings.length + inProgressBookings.length})
                </h3>

                {pendingBookings.length === 0 &&
                inProgressBookings.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#666",
                    }}
                  >
                    No pending tasks at the moment
                  </p>
                ) : (
                  <>
                    {inProgressBookings.map((booking) => (
                      <div key={booking.id} className="task-card">
                        <div className="task-header">
                          <div className="task-info">
                            <h4>Booking #{booking.id}</h4>
                            <p>
                              <i className="bi bi-geo-alt"></i>
                              {booking.address}
                            </p>
                            <p>
                              <i className="bi bi-clock"></i>
                              {booking.pickup_date} - {booking.pickup_time}
                            </p>
                          </div>
                          <span className="task-status in-progress">
                            In Progress
                          </span>
                        </div>
                        <div className="task-details">
                          <div className="detail-item">
                            <span className="detail-label">Materials</span>
                            <span className="detail-value">
                              {booking.materials?.join(", ") || "N/A"}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">
                              Expected Weight
                            </span>
                            <span className="detail-value">
                              ~{booking.total_weight} kg
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Earnings</span>
                            <span className="detail-value">
                              ${booking.total_earnings}
                            </span>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => completePickup(booking.id)}
                          >
                            <i className="bi bi-check-circle"></i>
                            Mark as Collected
                          </button>
                        </div>
                      </div>
                    ))}

                    {pendingBookings.map((booking) => (
                      <div key={booking.id} className="task-card">
                        <div className="task-header">
                          <div className="task-info">
                            <h4>Booking #{booking.id}</h4>
                            <p>
                              <i className="bi bi-geo-alt"></i>
                              {booking.address}
                            </p>
                            <p>
                              <i className="bi bi-clock"></i>
                              {booking.pickup_date} - {booking.pickup_time}
                            </p>
                          </div>
                          <span className="task-status pending">Pending</span>
                        </div>
                        <div className="task-details">
                          <div className="detail-item">
                            <span className="detail-label">Materials</span>
                            <span className="detail-value">
                              {booking.materials?.join(", ") || "N/A"}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">
                              Expected Weight
                            </span>
                            <span className="detail-value">
                              ~{booking.total_weight} kg
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Earnings</span>
                            <span className="detail-value">
                              ${booking.total_earnings}
                            </span>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => startPickup(booking.id)}
                          >
                            <i className="bi bi-play-circle"></i>
                            Start Pickup
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => viewDetails(booking.id)}
                          >
                            <i className="bi bi-info-circle"></i>
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activePage === "earnings" && (
          <div className="page-content">
            <div className="page-header">
              <h1 className="page-title">Earnings & Performance</h1>
              <p className="page-subtitle">
                Track your earnings and performance metrics
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card success">
                <div className="icon">
                  <i className="bi bi-cash-stack"></i>
                </div>
                <h3>${stats.totalEarnings.toFixed(2)}</h3>
                <p>Total Earnings</p>
              </div>
              <div className="stat-card primary">
                <div className="icon">
                  <i className="bi bi-calendar-week"></i>
                </div>
                <h3>{stats.totalPickups}</h3>
                <p>Completed Pickups</p>
              </div>
              <div className="stat-card secondary">
                <div className="icon">
                  <i className="bi bi-trophy"></i>
                </div>
                <h3>${(stats.totalEarnings * 0.1).toFixed(2)}</h3>
                <p>Bonuses & Incentives</p>
              </div>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-graph-up"></i>
                Performance Metrics
              </h3>

              <div
                className="task-details"
                style={{ borderTop: "none", paddingTop: 0 }}
              >
                <div className="detail-item">
                  <span className="detail-label">Completed Pickups</span>
                  <span className="detail-value">
                    {stats.totalPickups} total
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">On-Time Rate</span>
                  <span className="detail-value">96%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Customer Satisfaction</span>
                  <span className="detail-value">4.8/5.0</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Waste Collected</span>
                  <span className="detail-value">
                    {completedBookings
                      .reduce((sum, b) => sum + (b.total_weight || 0), 0)
                      .toFixed(1)}{" "}
                    kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === "history" && (
          <div className="page-content">
            <div className="page-header">
              <h1 className="page-title">Pickup History</h1>
              <p className="page-subtitle">
                Complete record of your past collections
              </p>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-archive"></i>
                Completed Pickups ({completedBookings.length})
              </h3>

              {completedBookings.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#666",
                  }}
                >
                  No completed pickups yet
                </p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>BOOKING ID</th>
                        <th>DATE & TIME</th>
                        <th>ADDRESS</th>
                        <th>MATERIALS</th>
                        <th>WEIGHT</th>
                        <th>EARNINGS</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>#{booking.id}</td>
                          <td>
                            {booking.pickup_date} - {booking.pickup_time}
                          </td>
                          <td>{booking.address}</td>
                          <td>{booking.materials?.join(", ") || "N/A"}</td>
                          <td>{booking.total_weight} kg</td>
                          <td>${booking.total_earnings}</td>
                          <td>
                            <span className="task-status completed">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activePage === "notifications" && (
          <div className="page-content">
            <div className="page-header">
              <h1 className="page-title">Notifications</h1>
              <p className="page-subtitle">
                Stay updated with real-time alerts
              </p>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-bell-fill"></i>
                Recent Notifications
              </h3>

              {pendingBookings.length > 0 && (
                <div className="notification-item">
                  <div className="notification-icon new">
                    <i className="bi bi-plus-circle-fill"></i>
                  </div>
                  <div className="notification-content">
                    <h4>New Pickup Requests</h4>
                    <p>
                      You have {pendingBookings.length} pending pickup
                      request(s)
                    </p>
                    <span className="notification-time">Now</span>
                  </div>
                </div>
              )}

              <div className="notification-item">
                <div className="notification-icon update">
                  <i className="bi bi-chat-dots-fill"></i>
                </div>
                <div className="notification-content">
                  <h4>System Status</h4>
                  <p>All systems operational. Have a great day!</p>
                  <span className="notification-time">Today</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === "settings" && (
          <div className="page-content">
            <div className="page-header">
              <h1 className="page-title">Settings</h1>
              <p className="page-subtitle">Manage your account preferences</p>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-person-fill"></i>
                Personal Information
              </h3>

              <div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={collectorData?.name || "Collector"}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    defaultValue={collectorData?.email || "collector@loop.com"}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    defaultValue={collectorData?.phone || "+20 100 123 4567"}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Worker ID</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={collectorId}
                    disabled
                  />
                </div>

                <div className="task-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveSettings}
                  >
                    <i className="bi bi-check-circle"></i>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-key-fill"></i>
                Change Password
              </h3>

              <div>
                <div className="form-group">
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

                <div className="task-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={changePassword}
                  >
                    <i className="bi bi-shield-check"></i>
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div
          className="modal show"
          onClick={(e) => e.target.className.includes("modal") && closeModal()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Pickup</h3>
              <button className="close-modal" onClick={closeModal}>
                &times;
              </button>
            </div>

            <div>
              <div className="form-group">
                <label className="form-label">
                  Actual Collected Quantity (kg)
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter weight in kg"
                  value={formData.actualQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, actualQuantity: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Waste Type</label>
                <select
                  className="form-input"
                  value={formData.wasteType}
                  onChange={(e) =>
                    setFormData({ ...formData, wasteType: e.target.value })
                  }
                  required
                >
                  <option value="">Select waste type</option>
                  <option value="plastic">Plastic</option>
                  <option value="paper">Paper</option>
                  <option value="metal">Metal</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-input"
                  placeholder="Add any additional notes or issues..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <div className="task-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={submitPickup}
                >
                  <i className="bi bi-check-circle-fill"></i>
                  Confirm Pickup
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  <i className="bi bi-x-circle"></i>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorDashboard;
