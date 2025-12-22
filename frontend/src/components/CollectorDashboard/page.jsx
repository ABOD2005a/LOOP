import React, { useState } from 'react';
import './CollectorDashboard.css';

const CollectorDashboard = () => {
  const [activePage, setActivePage] = useState('profile');
  const [showModal, setShowModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    actualQuantity: '',
    wasteType: '',
    notes: ''
  });

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleNavigation = (page) => {
    if (page === 'logout') {
      if (window.confirm('Are you sure you want to logout?')) {
        showAlertMessage('Logged out successfully!');
        setTimeout(() => window.location.reload(), 1500);
      }
      return;
    }
    setActivePage(page);
  };

  const startPickup = (requestId) => {
    showAlertMessage(`Started pickup for ${requestId}`);
  };

  const viewDetails = (requestId) => {
    showAlertMessage(`Viewing details for ${requestId}`);
  };

  const completePickup = (requestId) => {
    setCurrentRequestId(requestId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ actualQuantity: '', wasteType: '', notes: '' });
    setPhotoPreview(null);
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

  const submitPickup = () => {
    if (!formData.actualQuantity || !formData.wasteType) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Submitting pickup:', {
      requestId: currentRequestId,
      ...formData
    });

    closeModal();
    showAlertMessage('Pickup confirmed successfully!');
    setTimeout(() => window.location.reload(), 1500);
  };

  const saveSettings = () => {
    showAlertMessage('Settings saved successfully!');
  };

  const changePassword = () => {
    showAlertMessage('Password updated successfully!');
  };

  return (
    <div className="app-container">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      
      <aside className="sidebar">
        
        <a href="#" className={`nav-link ${activePage === 'profile' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('profile'); }}>
          <i className="bi bi-person-circle"></i>
          <span>Profile</span>
        </a>
        <a href="#" className={`nav-link ${activePage === 'tasks' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('tasks'); }}>
          <i className="bi bi-list-check"></i>
          <span>Assigned Pickups</span>
        </a>
        <a href="#" className={`nav-link ${activePage === 'earnings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('earnings'); }}>
          <i className="bi bi-currency-dollar"></i>
          <span>Earnings</span>
        </a>
        <a href="#" className={`nav-link ${activePage === 'history' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('history'); }}>
          <i className="bi bi-clock-history"></i>
          <span>Pickup History</span>
        </a>
        <a href="#" className={`nav-link ${activePage === 'notifications' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('notifications'); }}>
          <i className="bi bi-bell"></i>
          <span>Notifications</span>
          <span className="notification-badge">3</span>
        </a>
        <a href="#" className={`nav-link ${activePage === 'settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavigation('settings'); }}>
          <i className="bi bi-gear"></i>
          <span>Settings</span>
        </a>
        <a href="#" className="nav-link logout" onClick={(e) => { e.preventDefault(); handleNavigation('logout'); }}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Log-out</span>
        </a>
      </aside>

      <div className={`alert ${showAlert ? 'show' : ''}`}>
        <div className="alert-icon">✓</div>
        <span className="alert-text">{alertMessage}</span>
      </div>

      <main className="main-content">
        {activePage === 'profile' && (
          <div className="page-content">
            <div className="page-header">
              <h1 className="page-title">Worker Profile</h1>
              <p className="page-subtitle">Your account information and work details</p>
            </div>

            <div className="content-card profile-card">
              <div className="profile-avatar">MC</div>
              <div className="profile-info">
                <h2>Mohamed Collector</h2>
                <p><i className="bi bi-person-badge"></i>Worker ID: LOOP-W-2024-001</p>
                <p><i className="bi bi-geo-alt-fill"></i>Assigned Zone: Nasr City - Zone A</p>
                <p><span className="status-badge active">Active</span></p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="icon"><i className="bi bi-check-circle"></i></div>
                <h3>324</h3>
                <p>Total Pickups</p>
              </div>
              <div className="stat-card secondary">
                <div className="icon"><i className="bi bi-calendar-check"></i></div>
                <h3>8</h3>
                <p>Today's Tasks</p>
              </div>
              <div className="stat-card success">
                <div className="icon"><i className="bi bi-currency-dollar"></i></div>
                <h3>$1,240</h3>
                <p>Total Earnings</p>
              </div>
            </div>
          </div>
        )}

        {activePage === 'tasks' && (
          <div className="page-content">
            <div className="page-header">
              <h1 className="page-title">Assigned Pickups</h1>
              <p className="page-subtitle">Your daily collection tasks</p>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-list-task"></i>
                Today's Tasks (8)
              </h3>

              <div className="task-card">
                <div className="task-header">
                  <div className="task-info">
                    <h4>Ahmed Hassan</h4>
                    <p><i className="bi bi-geo-alt"></i>123 Abbas El Akkad St, Nasr City</p>
                    <p><i className="bi bi-clock"></i>08:00 AM - 09:00 AM</p>
                  </div>
                  <span className="task-status pending">Pending</span>
                </div>
                <div className="task-details">
                  <div className="detail-item">
                    <span className="detail-label">Waste Type</span>
                    <span className="detail-value">Plastic & Paper</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Expected Quantity</span>
                    <span className="detail-value">~15 kg</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Request ID</span>
                    <span className="detail-value">#REQ-2024-1234</span>
                  </div>
                </div>
                <div className="task-actions">
                  <button className="btn btn-primary" onClick={() => startPickup('REQ-2024-1234')}>
                    <i className="bi bi-play-circle"></i>
                    Start Pickup
                  </button>
                  <button className="btn btn-secondary" onClick={() => viewDetails('REQ-2024-1234')}>
                    <i className="bi bi-info-circle"></i>
                    View Details
                  </button>
                </div>
              </div>

              <div className="task-card">
                <div className="task-header">
                  <div className="task-info">
                    <h4>Fatma Ali</h4>
                    <p><i className="bi bi-geo-alt"></i>456 Mostafa El Nahas St, Nasr City</p>
                    <p><i className="bi bi-clock"></i>09:30 AM - 10:30 AM</p>
                  </div>
                  <span className="task-status in-progress">In Progress</span>
                </div>
                <div className="task-details">
                  <div className="detail-item">
                    <span className="detail-label">Waste Type</span>
                    <span className="detail-value">Electronics</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Expected Quantity</span>
                    <span className="detail-value">~8 kg</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Request ID</span>
                    <span className="detail-value">#REQ-2024-1235</span>
                  </div>
                </div>
                <div className="task-actions">
                  <button className="btn btn-primary" onClick={() => completePickup('REQ-2024-1235')}>
                    <i className="bi bi-check-circle"></i>
                    Mark as Collected
                  </button>
                </div>
              </div>

              <div className="task-card">
                <div className="task-header">
                  <div className="task-info">
                    <h4>Omar Mahmoud</h4>
                    <p><i className="bi bi-geo-alt"></i>789 Makram Ebeid St, Nasr City</p>
                    <p><i className="bi bi-clock"></i>11:00 AM - 12:00 PM</p>
                  </div>
                  <span className="task-status pending">Pending</span>
                </div>
                <div className="task-details">
                  <div className="detail-item">
                    <span className="detail-label">Waste Type</span>
                    <span className="detail-value">Glass & Metal</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Expected Quantity</span>
                    <span className="detail-value">~20 kg</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Request ID</span>
                    <span className="detail-value">#REQ-2024-1236</span>
                  </div>
                </div>
                <div className="task-actions">
                  <button className="btn btn-primary" onClick={() => startPickup('REQ-2024-1236')}>
                    <i className="bi bi-play-circle"></i>
                    Start Pickup
                  </button>
                  <button className="btn btn-secondary" onClick={() => viewDetails('REQ-2024-1236')}>
                    <i className="bi bi-info-circle"></i>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === 'earnings' && (
          <div className="page-content">
            <div className="page-header">
              <h1 className="page-title">Earnings & Performance</h1>
              <p className="page-subtitle">Track your earnings and performance metrics</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card success">
                <div className="icon"><i className="bi bi-cash-stack"></i></div>
                <h3>$45</h3>
                <p>Today's Earnings</p>
              </div>
              <div className="stat-card primary">
                <div className="icon"><i className="bi bi-calendar-week"></i></div>
                <h3>$315</h3>
                <p>This Week</p>
              </div>
              <div className="stat-card secondary">
                <div className="icon"><i className="bi bi-trophy"></i></div>
                <h3>$150</h3>
                <p>Bonuses & Incentives</p>
              </div>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-graph-up"></i>
                Performance Metrics
              </h3>

              <div className="task-details" style={{ borderTop: 'none', paddingTop: 0 }}>
                <div className="detail-item">
                  <span className="detail-label">Completed Pickups</span>
                  <span className="detail-value">324 total</span>
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
                  <span className="detail-value">4,890 kg</span>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-calendar-range"></i>
                Weekly Earnings Breakdown
              </h3>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>PICKUPS</th>
                      <th>EARNINGS</th>
                      <th>BONUS</th>
                      <th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Mon, Dec 16</td>
                      <td>12 pickups</td>
                      <td>$42</td>
                      <td>$8</td>
                      <td><strong>$50</strong></td>
                    </tr>
                    <tr>
                      <td>Tue, Dec 17</td>
                      <td>15 pickups</td>
                      <td>$52</td>
                      <td>$10</td>
                      <td><strong>$62</strong></td>
                    </tr>
                    <tr>
                      <td>Wed, Dec 18</td>
                      <td>11 pickups</td>
                      <td>$38</td>
                      <td>$5</td>
                      <td><strong>$43</strong></td>
                    </tr>
                    <tr>
                      <td>Thu, Dec 19</td>
                      <td>14 pickups</td>
                      <td>$48</td>
                      <td>$12</td>
                      <td><strong>$60</strong></td>
                    </tr>
                    <tr>
                      <td>Fri, Dec 20</td>
                      <td>13 pickups</td>
                      <td>$45</td>
                      <td>$8</td>
                      <td><strong>$53</strong></td>
                    </tr>
                    <tr>
                      <td>Sat, Dec 21</td>
                      <td>10 pickups</td>
                      <td>$35</td>
                      <td>$12</td>
                      <td><strong>$47</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activePage === 'history' && (
          <div className="page-content">
            <div className="page-header">
              <h1 className="page-title">Pickup History</h1>
              <p className="page-subtitle">Complete record of your past collections</p>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-archive"></i>
                Completed Pickups
              </h3>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>REQUEST ID</th>
                      <th>DATE & TIME</th>
                      <th>CUSTOMER</th>
                      <th>WASTE TYPE</th>
                      <th>QUANTITY</th>
                      <th>EARNINGS</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#REQ-2024-1233</td>
                      <td>Dec 21, 2025 - 02:30 PM</td>
                      <td>Sara Mohamed</td>
                      <td>Paper & Cardboard</td>
                      <td>18 kg</td>
                      <td>$6.50</td>
                      <td><span className="task-status completed">Completed</span></td>
                    </tr>
                    <tr>
                      <td>#REQ-2024-1232</td>
                      <td>Dec 21, 2025 - 11:15 AM</td>
                      <td>Khaled Ibrahim</td>
                      <td>Mixed Waste</td>
                      <td>25 kg</td>
                      <td>$8.75</td>
                      <td><span className="task-status completed">Completed</span></td>
                    </tr>
                    <tr>
                      <td>#REQ-2024-1231</td>
                      <td>Dec 21, 2025 - 09:00 AM</td>
                      <td>Nour Ahmed</td>
                      <td>Plastic & Glass</td>
                      <td>12 kg</td>
                      <td>$4.20</td>
                      <td><span className="task-status completed">Completed</span></td>
                    </tr>
                    <tr>
                      <td>#REQ-2024-1230</td>
                      <td>Dec 20, 2025 - 03:45 PM</td>
                      <td>Youssef Hassan</td>
                      <td>Electronics</td>
                      <td>8 kg</td>
                      <td>$5.00</td>
                      <td><span className="task-status completed">Completed</span></td>
                    </tr>
                    <tr>
                      <td>#REQ-2024-1229</td>
                      <td>Dec 20, 2025 - 01:20 PM</td>
                      <td>Mona Sayed</td>
                      <td>Organic Waste</td>
                      <td>30 kg</td>
                      <td>$10.50</td>
                      <td><span className="task-status completed">Completed</span></td>
                    </tr>
                    <tr>
                      <td>#REQ-2024-1228</td>
                      <td>Dec 20, 2025 - 10:30 AM</td>
                      <td>Ali Mostafa</td>
                      <td>Metal & Glass</td>
                      <td>15 kg</td>
                      <td>$5.25</td>
                      <td><span className="task-status completed">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activePage === 'notifications' && (
          <div className="page-content">
            <div className="page-header">
              <h1 className="page-title">Notifications</h1>
              <p className="page-subtitle">Stay updated with real-time alerts</p>
            </div>

            <div className="content-card">
              <h3 className="section-title">
                <i className="bi bi-bell-fill"></i>
                Recent Notifications
              </h3>

              <div className="notification-item">
                <div className="notification-icon new">
                  <i className="bi bi-plus-circle-fill"></i>
                </div>
                <div className="notification-content">
                  <h4>New Pickup Request Assigned</h4>
                  <p>You have been assigned a new pickup at 789 Makram Ebeid St</p>
                  <span className="notification-time">5 minutes ago</span>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-icon update">
                  <i className="bi bi-arrow-repeat"></i>
                </div>
                <div className="notification-content">
                  <h4>Task Updated</h4>
                  <p>Pickup time for Request #REQ-2024-1234 has been changed to 08:30 AM</p>
                  <span className="notification-time">1 hour ago</span>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-icon alert">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <div className="notification-content">
                  <h4>Delay Alert</h4>
                  <p>You are running 15 minutes behind schedule for today's route</p>
                  <span className="notification-time">2 hours ago</span>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-icon new">
                  <i className="bi bi-cash-coin"></i>
                </div>
                <div className="notification-content">
                  <h4>Bonus Earned!</h4>
                  <p>You've earned a $12 bonus for excellent performance this week</p>
                  <span className="notification-time">5 hours ago</span>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-icon update">
                  <i className="bi bi-chat-dots-fill"></i>
                </div>
                <div className="notification-content">
                  <h4>Message from Admin</h4>
                  <p>System maintenance scheduled for tonight at 11:00 PM</p>
                  <span className="notification-time">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === 'settings' && (
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
                  <input type="text" className="form-input" defaultValue="Mohamed Collector" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" defaultValue="mohamed.collector@loop.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" defaultValue="+20 100 123 4567" />
                </div>
                <div className="form-group">
                  <label className="form-label">Worker ID</label>
                  <input type="text" className="form-input" defaultValue="LOOP-W-2024-001" disabled />
                </div>

                <div className="task-actions">
                  <button type="button" className="btn btn-primary" onClick={saveSettings}>
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
                  <input type="password" className="form-input" placeholder="Enter current password" />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" placeholder="Enter new password" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" placeholder="Confirm new password" />
                </div>

                <div className="task-actions">
                  <button type="button" className="btn btn-primary" onClick={changePassword}>
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
        <div className="modal show" onClick={(e) => e.target.className.includes('modal') && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Pickup</h3>
              <button className="close-modal" onClick={closeModal}>&times;</button>
            </div>

            <div>
              <div className="form-group">
                <label className="form-label">Actual Collected Quantity (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter weight in kg"
                  value={formData.actualQuantity}
                  onChange={(e) => setFormData({ ...formData, actualQuantity: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Waste Type</label>
                <select
                  className="form-input"
                  value={formData.wasteType}
                  onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                  required
                >
                  <option value="">Select waste type</option>
                  <option value="plastic">Plastic & Paper</option>
                  <option value="electronics">Electronics</option>
                  <option value="glass">Glass & Metal</option>
                  <option value="organic">Organic Waste</option>
                  <option value="mixed">Mixed Waste</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Upload Photo (Optional)</label>
                <div className="file-upload" onClick={() => document.getElementById('photo-upload').click()}>
                  <i className="bi bi-camera"></i>
                  <p>Click to upload waste photo</p>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                </div>
                {photoPreview && (
                  <div style={{ marginTop: '1rem' }}>
                    <img
                      src={photoPreview}
                      alt="Preview"
                      style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-input"
                  placeholder="Add any additional notes or issues..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="task-actions">
                <button type="button" className="btn btn-primary" onClick={submitPickup}>
                  <i className="bi bi-check-circle-fill"></i>
                  Confirm Pickup
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
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