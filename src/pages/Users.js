
import React, { useState, useEffect } from 'react';
import './Users.css';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch all users with role=user (shippers)
      const res = await api.get('/admin/users?role=user');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="users-loading">Loading users...</div>;
  }

  return (
    <div className="users-page">
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Bookings</th>
              <th>Active Bookings</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="user-id">{user.id}</td>
                <td className="user-name">
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.companyName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td className="total-bookings">{user.totalBookings}</td>
                <td className="active-bookings">{user.activeBookings}</td>
                <td>{new Date(user.registeredDate).toLocaleDateString()}</td>
                <td>
                  <button className="action-btn view-btn" onClick={() => setSelectedUser(user)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-data">No users found</div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>User Details</h2>
            <table className="user-detail-table">
              <tbody>
                <tr><td><b>User ID:</b></td><td>{selectedUser.id}</td></tr>
                <tr><td><b>Name:</b></td><td>{selectedUser.firstName} {selectedUser.lastName}</td></tr>
                <tr><td><b>Company:</b></td><td>{selectedUser.companyName}</td></tr>
                <tr><td><b>Email:</b></td><td>{selectedUser.email}</td></tr>
                <tr><td><b>Phone:</b></td><td>{selectedUser.phone}</td></tr>
                <tr><td><b>Total Bookings:</b></td><td>{selectedUser.totalBookings}</td></tr>
                <tr><td><b>Active Bookings:</b></td><td>{selectedUser.activeBookings}</td></tr>
                <tr><td><b>Registered:</b></td><td>{new Date(selectedUser.registeredDate).toLocaleString()}</td></tr>
              </tbody>
            </table>
            <button className="action-btn close-btn" onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
