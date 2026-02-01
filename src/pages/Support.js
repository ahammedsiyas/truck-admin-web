import React, { useState, useEffect } from 'react';
import './Support.css';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // Mock data - replace with GET /api/support
      const mockTickets = [
        {
          id: 'SUP-9001',
          user: 'ABC Corporation',
          subject: 'Payment issue for Invoice INV-2003',
          category: 'Billing',
          status: 'open',
          priority: 'high',
          createdDate: '2026-01-10 09:30 AM',
        },
        {
          id: 'SUP-9002',
          user: 'John Doe (Driver)',
          subject: 'GPS not working in app',
          category: 'Technical',
          status: 'in_progress',
          priority: 'medium',
          createdDate: '2026-01-09 02:15 PM',
        },
        {
          id: 'SUP-9003',
          user: 'XYZ Industries',
          subject: 'Need invoice copy',
          category: 'General',
          status: 'resolved',
          priority: 'low',
          createdDate: '2026-01-08 11:00 AM',
        },
      ];
      setTickets(mockTickets);
    } catch (err) {
      console.error('Failed to fetch support tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { label: 'Open', className: 'status-open' },
      in_progress: { label: 'In Progress', className: 'status-progress' },
      resolved: { label: 'Resolved', className: 'status-resolved' },
      closed: { label: 'Closed', className: 'status-closed' },
    };
    const config = statusConfig[status] || { label: status, className: 'status-default' };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { label: 'High', className: 'priority-high' },
      medium: { label: 'Medium', className: 'priority-medium' },
      low: { label: 'Low', className: 'priority-low' },
    };
    const config = priorityConfig[priority] || { label: priority, className: 'priority-default' };
    return <span className={`priority-badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) {
    return <div className="support-loading">Loading support tickets...</div>;
  }

  return (
    <div className="support-page">
      <div className="table-container">
        <table className="support-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>User</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="ticket-id">{ticket.id}</td>
                <td>{ticket.user}</td>
                <td className="subject">{ticket.subject}</td>
                <td>{ticket.category}</td>
                <td>{getPriorityBadge(ticket.priority)}</td>
                <td>{getStatusBadge(ticket.status)}</td>
                <td>{ticket.createdDate}</td>
                <td>
                  <button className="action-btn view-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tickets.length === 0 && (
          <div className="no-data">No support tickets found</div>
        )}
      </div>
    </div>
  );
};

export default Support;
