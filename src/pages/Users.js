import React, { useState, useEffect } from 'react';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Mock data - replace with GET /api/users?role=user
      const mockUsers = [
        {
          id: 'USR-6001',
          firstName: 'ABC',
          lastName: 'Corporation',
          email: 'contact@abc.com',
          phone: '+91 98765 43210',
          companyName: 'ABC Corporation',
          totalBookings: 15,
          activeBookings: 3,
          registeredDate: '2025-12-01',
        },
        {
          id: 'USR-6002',
          firstName: 'XYZ',
          lastName: 'Industries',
          email: 'info@xyz.com',
          phone: '+91 98765 43211',
          companyName: 'XYZ Industries',
          totalBookings: 23,
          activeBookings: 5,
          registeredDate: '2025-11-15',
        },
      ];
      setUsers(mockUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
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
                  <button className="action-btn view-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-data">No users found</div>
        )}
      </div>
    </div>
  );
};

export default Users;
