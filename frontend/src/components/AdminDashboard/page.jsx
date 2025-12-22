import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate data fetch
    const mockBookings = [
      {
        id: '1',
        user_id: 'user1',
        pickup_date: '2025-01-15',
        pickup_time: '10:00 AM',
        address: '123 Main St, New York, NY',
        materials: ['metal', 'paper', 'plastic'],
        status: 'scheduled',
        notes: 'Please ring doorbell',
        created_at: '2025-01-10T08:30:00Z'
      },
      {
        id: '2',
        user_id: 'user2',
        pickup_date: '2025-01-16',
        pickup_time: '2:00 PM',
        address: '456 Oak Ave, Brooklyn, NY',
        materials: ['electronics', 'glass'],
        status: 'in-progress',
        notes: null,
        created_at: '2025-01-11T14:20:00Z'
      },
      {
        id: '3',
        user_id: 'user3',
        pickup_date: '2025-01-14',
        pickup_time: '11:30 AM',
        address: '789 Pine Rd, Queens, NY',
        materials: ['textiles', 'paper'],
        status: 'completed',
        notes: 'Large items',
        created_at: '2025-01-09T09:15:00Z'
      }
    ];
    
    setTimeout(() => {
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = bookings;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.address.toLowerCase().includes(query) ||
        b.materials.some(m => m.toLowerCase().includes(query))
      );
    }
    
    setFilteredBookings(filtered);
  }, [searchQuery, statusFilter, bookings]);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    // Simulate status update
    setTimeout(() => {
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));
      setUpdatingId(null);
      setActiveDropdown(null);
    }, 500);
  };

  // const handleRefresh = () => {
  //   setLoading(true);
  //   setTimeout(() => setLoading(false), 1000);
  // };

  // Calculate stats
  const stats = {
    totalBookings: bookings.length,
    scheduledBookings: bookings.filter(b => b.status === 'scheduled').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    uniqueUsers: new Set(bookings.map(b => b.user_id)).size
  };

  // Materials data
  const materialsCount = {};
  bookings.forEach(booking => {
    booking.materials.forEach(material => {
      materialsCount[material] = (materialsCount[material] || 0) + 1;
    });
  });

  const materialsData = Object.entries(materialsCount).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    percentage: Math.round((value / bookings.length) * 100)
  }));

  // Status data
  const statusCount = {};
  bookings.forEach(booking => {
    statusCount[booking.status] = (statusCount[booking.status] || 0) + 1;
  });

  const statusData = Object.entries(statusCount).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
    value
  }));

  const materialEmojis = {
    metal: '🔩',
    paper: '📄',
    plastic: '♻️',
    electronics: '📱',
    glass: '🫙',
    textiles: '👕'
  };

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
     

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Stats Cards */}
          <section className="stats-section">
            <div className="stat-card stat-card-primary">
              <div className="stat-bg-gradient"></div>
              <div className="stat-decoration"></div>
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label-admin">Total Bookings</p>
                  <div className="stat-value-row-admin">
                    <span className="stat-value-admin">{stats.totalBookings}</span>
                    <span className="stat-trend stat-trend-up">
                      <svg className="trend-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
                      </svg>
                      +12%
                    </span>
                  </div>
                </div>
                <div className="stat-icon-box stat-icon-primary">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </div>
              </div>
              <div className="stat-progress">
                <div className="stat-progress-bar" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="stat-card stat-card-blue">
              <div className="stat-bg-gradient"></div>
              <div className="stat-decoration"></div>
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label-admin">Scheduled</p>
                  <div className="stat-value-row-admin">
                    <span className="stat-value-admin">{stats.scheduledBookings}</span>
                    <span className="stat-trend stat-trend-up">
                      <svg className="trend-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
                      </svg>
                      +5%
                    </span>
                  </div>
                </div>
                <div className="stat-icon-box stat-icon-blue">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>
              <div className="stat-progress">
                <div className="stat-progress-bar" style={{ width: `${Math.min((stats.scheduledBookings / stats.totalBookings) * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className="stat-card stat-card-green">
              <div className="stat-bg-gradient"></div>
              <div className="stat-decoration"></div>
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label-admin">Completed</p>
                  <div className="stat-value-row-admin">
                    <span className="stat-value-admin">{stats.completedBookings}</span>
                    <span className="stat-trend stat-trend-up">
                      <svg className="trend-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
                      </svg>
                      +18%
                    </span>
                  </div>
                </div>
                <div className="stat-icon-box stat-icon-green">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>
              <div className="stat-progress">
                <div className="stat-progress-bar" style={{ width: `${Math.min((stats.completedBookings / stats.totalBookings) * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className="stat-card stat-card-purple">
              <div className="stat-bg-gradient"></div>
              <div className="stat-decoration"></div>
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label-admin">Active Users</p>
                  <div className="stat-value-row-admin">
                    <span className="stat-value-admin">{stats.uniqueUsers}</span>
                    <span className="stat-trend stat-trend-up">
                      <svg className="trend-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
                      </svg>
                      +8%
                    </span>
                  </div>
                </div>
                <div className="stat-icon-box stat-icon-purple">
                  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </div>
              <div className="stat-progress">
                <div className="stat-progress-bar" style={{ width: `${Math.min((stats.uniqueUsers / stats.totalBookings) * 100, 100)}%` }}></div>
              </div>
            </div>
          </section>

          {/* Charts Grid */}
          <section className="charts-grid">
            {/* Materials Chart */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg className="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                  Materials Collected
                </h3>
              </div>
              <div className="card-content">
                {materialsData.length === 0 ? (
                  <div className="empty-state">No materials data available</div>
                ) : (
                  <div className="materials-chart">
                    <div className="pie-chart">
                      <div className="pie-center">
                        <span className="pie-total">{bookings.length}</span>
                        <span className="pie-label">Total</span>
                      </div>
                    </div>
                    <div className="materials-legend">
                      {materialsData.map((item, index) => (
                        <div key={index} className="legend-item">
                          <div className="legend-header">
                            <div className="legend-dot" style={{ backgroundColor: getMaterialColor(item.name.toLowerCase()) }}></div>
                            <span className="legend-name">{item.name}</span>
                            <span className="legend-value">{item.value}</span>
                          </div>
                          <div className="legend-bar">
                            <div className="legend-bar-fill" style={{ width: `${item.percentage}%`, backgroundColor: getMaterialColor(item.name.toLowerCase()) }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Chart */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Booking Status</h3>
              </div>
              <div className="card-content">
                {statusData.length === 0 ? (
                  <div className="empty-state">No status data available</div>
                ) : (
                  <div className="status-chart">
                    {statusData.map((item, index) => (
                      <div key={index} className="status-bar-item">
                        <span className="status-name">{item.name}</span>
                        <div className="status-bar-container">
                          <div className="status-bar-fill" style={{ width: `${(item.value / stats.totalBookings) * 100}%`, backgroundColor: getStatusColor(item.name.toLowerCase().replace(' ', '-')) }}>
                            <span className="status-bar-value">{item.value}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <svg className="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Recent Activity
                </h3>
              </div>
              <div className="card-content">
                {bookings.length === 0 ? (
                  <div className="empty-state">No recent activity</div>
                ) : (
                  <div className="activity-list">
                    {bookings.slice(0, 5).map((booking, index) => (
                      <div key={booking.id} className="activity-item">
                        {index < bookings.slice(0, 5).length - 1 && <div className="activity-line"></div>}
                        <div className="activity-dot"></div>
                        <div className="activity-content">
                          <div className="activity-header">
                            <span className={`activity-badge status-${booking.status}`}>
                              {booking.status.toUpperCase()}
                            </span>
                            <span className="activity-time">{formatTimeAgo(booking.created_at)}</span>
                          </div>
                          <div className="activity-address">
                            <svg className="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {booking.address}
                          </div>
                          <div className="activity-materials">
                            <svg className="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                            {booking.materials.slice(0, 3).map((material, i) => (
                              <span key={i} className="material-emoji">{materialEmojis[material] || '📦'}</span>
                            ))}
                            {booking.materials.length > 3 && (
                              <span className="materials-more">+{booking.materials.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Bookings Table */}
          <section className="bookings-section">
            <div className="card">
              <div className="card-header card-header-bookings">
                <div className="bookings-header-left">
                  <div className="bookings-icon-box">
                    <svg className="bookings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="card-title">All Bookings</h3>
                    <p className="bookings-count">{filteredBookings.length} of {bookings.length} bookings</p>
                  </div>
                </div>
                <div className="bookings-header-right">
                  <div className="filter-tabs">
                    {['all', 'scheduled', 'in-progress', 'completed', 'cancelled'].map(status => (
                      <button
                        key={status}
                        className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
                        onClick={() => setStatusFilter(status)}
                      >
                        {status === 'all' ? 'All' : status === 'in-progress' ? 'Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="search-box">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search address, materials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="card-content card-content-table">
                {loading ? (
                  <div className="loading-state">
                    <svg className="loading-icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    <p>Loading bookings...</p>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <h3>No bookings found</h3>
                    <p>Bookings will appear here once users schedule pickups</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>
                            <div className="th-content">
                              <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              Date & Time
                            </div>
                          </th>
                          <th>
                            <div className="th-content">
                              <svg className="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              Address
                            </div>
                          </th>
                          <th>Materials</th>
                          <th>Status</th>
                          <th>Notes</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td>
                              <div className="date-cell">
                                <div className="date-value">{formatDate(booking.pickup_date)}</div>
                                <div className="time-value">
                                  <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                  </svg>
                                  {booking.pickup_time}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="address-cell">{booking.address}</div>
                            </td>
                            <td>
                              <div className="materials-cell">
                                {booking.materials.map((material, i) => (
                                  <span key={i} className={`material-badge material-${material}`}>
                                    <span className="material-emoji">{materialEmojis[material] || '📦'}</span>
                                    {material.charAt(0).toUpperCase() + material.slice(1)}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge status-${booking.status}`}>
                                {booking.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </span>
                            </td>
                            <td>
                              <div className="notes-cell">{booking.notes || '—'}</div>
                            </td>
                            <td>
                              <div className="actions-cell">
                                <button
                                  className="action-button"
                                  onClick={() => setActiveDropdown(activeDropdown === booking.id ? null : booking.id)}
                                  disabled={updatingId === booking.id}
                                >
                                  <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </button>
                                {activeDropdown === booking.id && (
                                  <div className="dropdown-menu">
                                    {statusOptions.map(option => (
                                      <button
                                        key={option.value}
                                        className={`dropdown-item ${booking.status === option.value ? 'disabled' : ''}`}
                                        onClick={() => handleStatusChange(booking.id, option.value)}
                                        disabled={booking.status === option.value}
                                      >
                                        <div className={`status-dot status-${option.value}`}></div>
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// Helper functions
const getMaterialColor = (material) => {
  const colors = {
    metal: '#10b981',
    paper: '#3b82f6',
    plastic: '#f59e0b',
    electronics: '#8b5cf6',
    glass: '#0ea5e9',
    textiles: '#ec4899'
  };
  return colors[material] || '#64748b';
};

const getStatusColor = (status) => {
  const colors = {
    scheduled: '#3b82f6',
    'in-progress': '#f59e0b',
    completed: '#10b981',
    cancelled: '#ef4444'
  };
  return colors[status] || '#64748b';
};

export default AdminDashboard;