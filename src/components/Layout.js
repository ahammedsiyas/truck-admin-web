import React, { useState } from 'react';
import './Layout.css';

const Layout = ({ children, user, onLogout, currentPage, onNavigate }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📦' },
    { id: 'trips', label: 'Trips', icon: '🧭' },
    { id: 'users', label: 'Users (Shippers)', icon: '👥' },
    { id: 'drivers', label: 'Drivers', icon: '🚚' },
    { id: 'trucks', label: 'Trucks', icon: '🚛' },
    { id: 'pods', label: 'POD Review', icon: '📸' },
    { id: 'invoices', label: 'Invoices', icon: '💰' },
    { id: 'settlements', label: 'Settlements', icon: '💵' },
    { id: 'ratings', label: 'Ratings', icon: '⭐' },
    { id: 'support', label: 'Support', icon: '💬' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{sidebarCollapsed ? '🚛' : '🚛 VCG Admin'}</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-container">
        <header className="top-header">
          <h1 className="page-title">{menuItems.find(i => i.id === currentPage)?.label || 'Dashboard'}</h1>
          <div className="header-actions">
            <div className="admin-info">
              <span className="admin-name">{user?.firstName} {user?.lastName}</span>
              <span className="admin-role">Admin</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
