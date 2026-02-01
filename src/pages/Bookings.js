import React, { useState, useEffect, useCallback } from 'react';
import './Bookings.css';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
=======
  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [quoteLoading, setQuoteLoading] = useState(false);
>>>>>>> e60aef4 (Initial admin web commit)

  const tabs = [
    { id: 'all', label: 'All', count: 45 },
    { id: 'pending', label: 'Pending', count: 12 },
    { id: 'confirmed', label: 'Confirmed', count: 8 },
    { id: 'assigned', label: 'Assigned', count: 15 },
    { id: 'in_progress', label: 'In Progress', count: 10 },
  ];

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://172.20.10.6:5000/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const allBookings = await response.json();

      // Transform backend data to UI format
      const transformedBookings = allBookings.map(booking => ({
        id: booking._id,
        user: booking.userId ? `${booking.userId.firstName} ${booking.userId.lastName}` : 'Unknown User',
        fromLocation: booking.pickupLocation?.address || 'N/A',
        toLocation: booking.deliveryLocation?.address || 'N/A',
        pickupDate: booking.pickupDate ? new Date(booking.pickupDate).toISOString().split('T')[0] : 'N/A',
        truckType: booking.truckType || 'N/A',
        loadWeight: booking.loadDetails?.weight ? `${booking.loadDetails.weight} kg` : 'N/A',
        amount: booking.loadDetails?.weight ? booking.loadDetails.weight * 5 : 0,
        status: booking.status || 'pending',
        assignedDriver: booking.driverId?.userId ? `${booking.driverId.userId.firstName} ${booking.driverId.userId.lastName}` : null,
        driverId: booking.driverId?._id || null
      }));

      setBookings(transformedBookings.filter(b => activeTab === 'all' || b.status === activeTab));
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

<<<<<<< HEAD
  const openAssignModal = async (booking) => {
    setSelectedBooking(booking);
    setShowAssignModal(true);
    
    // Fetch approved drivers
    const token = localStorage.getItem('adminToken');
    try {
      const driversRes = await fetch('http://172.20.10.6:5000/api/admin/drivers/approved', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const driversData = await driversRes.json();
      setDrivers(driversData.drivers || []);
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
      alert('Failed to load drivers');
    }
  };

  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      alert('Please select a driver');
      return;
    }

    setAssignLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://172.20.10.6:5000/api/admin/bookings/${selectedBooking.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          driverId: selectedDriver
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign driver');
      }

      alert('✓ Driver assigned successfully!');
      setShowAssignModal(false);
      setSelectedBooking(null);
      setSelectedDriver('');
      fetchBookings(); // Refresh list
    } catch (err) {
      alert('❌ ' + err.message);
    } finally {
      setAssignLoading(false);
=======
  const openQuotesModal = async (booking) => {
    setSelectedBooking(booking);
    setShowQuotesModal(true);
    setQuoteLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://172.20.10.6:5000/api/quotations/for-booking/${booking.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setQuotations(data.quotations || []);
    } catch (err) {
      alert('Failed to load quotations');
      setQuotations([]);
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleSelectQuote = async (quoteId) => {
    setQuoteLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://172.20.10.6:5000/api/quotations/${quoteId}/select`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to select quotation');
      alert('Quotation selected!');
      setShowQuotesModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      alert('Failed to select quotation');
    } finally {
      setQuoteLoading(false);
>>>>>>> e60aef4 (Initial admin web commit)
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'status-pending' },
      confirmed: { label: 'Confirmed', className: 'status-confirmed' },
      assigned: { label: 'Assigned', className: 'status-assigned' },
      in_progress: { label: 'In Progress', className: 'status-progress' },
      completed: { label: 'Completed', className: 'status-completed' },
    };
    const config = statusConfig[status] || { label: status, className: 'status-default' };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) {
    return <div className="bookings-loading">Loading bookings...</div>;
  }

  return (
    <div className="bookings-page">
      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Route</th>
              <th>Pickup Date</th>
              <th>Truck Type</th>
              <th>Load Weight</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Assigned Driver</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="booking-id">{booking.id}</td>
                <td>{booking.user}</td>
                <td>
                  <div className="route-cell">
                    <span className="route-from">{booking.fromLocation}</span>
                    <span className="route-arrow">→</span>
                    <span className="route-to">{booking.toLocation}</span>
                  </div>
                </td>
                <td>{new Date(booking.pickupDate).toLocaleDateString()}</td>
                <td>{booking.truckType}</td>
                <td>{booking.loadWeight}</td>
                <td className="amount">₹{booking.amount.toLocaleString()}</td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>
                  {booking.assignedDriver ? (
                    <div>{booking.assignedDriver}</div>
                  ) : (
                    <span className="no-driver">Not assigned</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => console.log('View booking:', booking)}
                    >
                      View
                    </button>
<<<<<<< HEAD
                    {(booking.status === 'pending' || booking.status === 'confirmed') && !booking.driverId && (
                      <button 
                        className="action-btn assign-btn"
                        onClick={() => openAssignModal(booking)}
                      >
                        Assign Driver
                      </button>
                    )}
=======
                    <button 
                      className="action-btn view-btn"
                      onClick={() => openQuotesModal(booking)}
                    >
                      View Quotations
                    </button>
>>>>>>> e60aef4 (Initial admin web commit)
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="no-data">No bookings found for this category</div>
        )}
      </div>

<<<<<<< HEAD
      {/* Assign Driver Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Assign Driver</h2>
            <p className="modal-booking-info">
              Booking: {selectedBooking?.fromLocation} → {selectedBooking?.toLocation}
            </p>

            <div className="modal-form">
              <div className="form-group">
                <label>Select Driver *</label>
                <select 
                  value={selectedDriver} 
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  disabled={assignLoading}
                >
                  <option value="">-- Select Driver --</option>
                  {drivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.userId.firstName} {driver.userId.lastName} - {driver.vehicleType || 'N/A'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn btn-cancel" 
                  onClick={() => setShowAssignModal(false)}
                  disabled={assignLoading}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-confirm" 
                  onClick={handleAssignDriver}
                  disabled={assignLoading || !selectedDriver}
                >
                  {assignLoading ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
=======
      {/* Quotations Modal */}
      {showQuotesModal && (
        <div className="modal-overlay" onClick={() => setShowQuotesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Quotations</h2>
            <p className="modal-booking-info">
              Booking: {selectedBooking?.fromLocation} → {selectedBooking?.toLocation}
            </p>
            {quoteLoading ? (
              <div>Loading quotations...</div>
            ) : quotations.length === 0 ? (
              <div>No quotations yet.</div>
            ) : (
              <table className="quotes-table">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Price</th>
                    <th>Notes</th>
                    <th>Selected</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map(q => (
                    <tr key={q._id}>
                      <td>{q.driverId ? `${q.driverId.firstName} ${q.driverId.lastName}` : 'N/A'}</td>
                      <td>₹{q.price}</td>
                      <td>{q.notes}</td>
                      <td>{q.selected ? '✓' : ''}</td>
                      <td>
                        {!q.selected && (
                          <button className="btn btn-confirm" onClick={() => handleSelectQuote(q._id)} disabled={quoteLoading}>
                            Select
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowQuotesModal(false)} disabled={quoteLoading}>
                Close
              </button>
>>>>>>> e60aef4 (Initial admin web commit)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
