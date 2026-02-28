import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Trips from './pages/Trips';
import Users from './pages/Users';
import Drivers from './pages/Drivers';
import Trucks from './pages/Trucks';
import PODs from './pages/PODs';
import Invoices from './pages/Invoices';
import Settlements from './pages/Settlements';
import Ratings from './pages/Ratings';
import Support from './pages/Support';
import AdminProfileSettings from './pages/AdminProfileSettings';
import Layout from './components/Layout';
import * as authService from './services/auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        try {
          const verified = await authService.getMe();
          if (verified.role === 'admin') {
            setUser(verified);
          } else {
            authService.logout();
          }
        } catch (err) {
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'bookings':
        return <Bookings />;
      case 'trips':
        return <Trips />;
      case 'users':
        return <Users />;
      case 'drivers':
        return <Drivers />;
      case 'trucks':
        return <Trucks />;
      case 'pods':
        console.log('current',currentPage);
        
        return <PODs />;
      case 'invoices':
        return <Invoices />;
      case 'settlements':
        return <Settlements />;
      case 'ratings':
        return <Ratings />;
      case 'support':
        return <Support />;
      case 'settings':
        return <AdminProfileSettings />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return <div className="loading-page">Loading...</div>;
  }

  return (
    <div className="App">
      {!user ? (
        <Login onLoginSuccess={setUser} />
      ) : (
        <Layout 
          user={user} 
          onLogout={handleLogout}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        >
          {renderPage()}
        </Layout>
      )}
    </div>
  );
}

export default App;
