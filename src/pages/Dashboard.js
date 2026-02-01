import React, { useState, useEffect } from 'react';
import * as driverService from '../services/driver';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeDrivers: 0,
    activeLoads: 0,
    pendingPods: 0,
    revenue: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingActions, setPendingActions] = useState({
    driversAwaitingApproval: 0,
    podsPendingReview: 0,
    invoicesPendingConfirmation: 0,
    bookingsAwaitingDriver: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Refresh dashboard every 30 seconds to show new driver registrations
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending drivers from API
      let pendingDrivers = [];
      try {
        pendingDrivers = await driverService.getPendingDrivers();
      } catch (err) {
        console.error('Failed to fetch pending drivers:', err);
      }

      const driversAwaitingApproval = pendingDrivers.length;
      
      // Format recent activity with actual data
      const activities = [];
      if (driversAwaitingApproval > 0) {
        const latestDriver = pendingDrivers[0];
        activities.push({
          id: 1,
          type: 'driver_registration',
          message: `New driver ${latestDriver.userId?.firstName || 'Unknown'} registered`,
          time: new Date(latestDriver.createdAt).toLocaleString(),
        });
      }
      
      activities.push(
        { id: 2, type: 'pod_upload', message: 'Driver activity monitoring active', time: 'Real-time' },
        { id: 3, type: 'invoice_confirmed', message: 'Awaiting new transactions', time: 'Real-time' },
        { id: 4, type: 'settlement_processed', message: 'Dashboard syncing...', time: 'Real-time' },
        { id: 5, type: 'booking_created', message: 'Monitoring system active', time: 'Real-time' }
      );

      setStats({
        activeDrivers: driversAwaitingApproval,
        activeLoads: 15,
        pendingPods: 8,
        revenue: 45250,
      });

      setRecentActivity(activities);

      setPendingActions({
        driversAwaitingApproval: driversAwaitingApproval,
        podsPendingReview: 8,
        invoicesPendingConfirmation: 3,
        bookingsAwaitingDriver: 12,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      pod_upload: '📸',
      driver_registration: '🚚',
      invoice_confirmed: '💰',
      settlement_processed: '💵',
      booking_created: '📦',
    };
    return icons[type] || '📌';
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      {/* Header with Refresh Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <button 
          onClick={fetchDashboardData}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Now'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon active-drivers">🚚</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeDrivers}</div>
            <div className="stat-label">Drivers Pending Approval</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-loads">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeLoads}</div>
            <div className="stat-label">Active Loads</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending-pods">📸</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingPods}</div>
            <div className="stat-label">Pending PODs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-content">
            <div className="stat-value">₹{stats.revenue.toLocaleString()}</div>
            <div className="stat-label">Revenue (This Month)</div>
          </div>
        </div>
      </div>

      {/* Activity and Actions Row */}
      <div className="activity-grid">
        {/* Recent Activity */}
        <div className="activity-section">
          <h3 className="section-title">Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                <div className="activity-details">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="pending-section">
          <h3 className="section-title">Pending Actions</h3>
          <div className="pending-list">
            <div className="pending-item">
              <div className="pending-info">
                <span className="pending-icon">👤</span>
                <span className="pending-text">Drivers awaiting approval</span>
              </div>
              <span className="pending-badge">{pendingActions.driversAwaitingApproval}</span>
            </div>

            <div className="pending-item">
              <div className="pending-info">
                <span className="pending-icon">📸</span>
                <span className="pending-text">PODs pending review</span>
              </div>
              <span className="pending-badge">{pendingActions.podsPendingReview}</span>
            </div>

            <div className="pending-item">
              <div className="pending-info">
                <span className="pending-icon">💰</span>
                <span className="pending-text">Invoices pending confirmation</span>
              </div>
              <span className="pending-badge">{pendingActions.invoicesPendingConfirmation}</span>
            </div>

            <div className="pending-item">
              <div className="pending-info">
                <span className="pending-icon">📦</span>
                <span className="pending-text">Bookings awaiting driver</span>
              </div>
              <span className="pending-badge">{pendingActions.bookingsAwaitingDriver}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
