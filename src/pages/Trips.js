import React, { useState, useEffect } from 'react';
import './Trips.css';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://172.20.10.6:5000/api/trips', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }

      const data = await response.json();
      setTrips(data);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      assigned: { label: 'Assigned', className: 'status-assigned' },
      accepted: { label: 'Accepted', className: 'status-accepted' },
      going_to_pickup: { label: 'Going to Pickup', className: 'status-enroute' },
      arrived_at_pickup: { label: 'Arrived at Pickup', className: 'status-loading' },
      loading: { label: 'Loading', className: 'status-loading' },
      loaded: { label: 'Loaded', className: 'status-loading' },
      in_transit: { label: 'In Transit', className: 'status-transit' },
      arrived_at_drop: { label: 'Arrived at Drop', className: 'status-arrived' },
      delivered: { label: 'Delivered', className: 'status-delivered' },
      completed: { label: 'Completed', className: 'status-delivered' },
      rejected: { label: 'Rejected', className: 'status-rejected' },
    };
    const config = statusConfig[status] || { label: status, className: 'status-default' };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) {
    return <div className="trips-loading">Loading trips...</div>;
  }

  return (
    <div className="trips-page">
      <div className="trips-header">
        <h1>Active Trips</h1>
        <button onClick={fetchTrips} className="refresh-btn">Refresh</button>
      </div>
      
      <div className="table-container">
        <table className="trips-table">
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Booking</th>
              <th>Driver</th>
              <th>Route</th>
              <th>Status</th>
              <th>Started</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id}>
                <td className="trip-id">#{trip._id.slice(-6)}</td>
                <td>#{trip.bookingId?._id?.slice(-6) || 'N/A'}</td>
                <td>
                  <div className="driver-info">
                    <div className="driver-name">
                      {trip.driverId?.userId 
                        ? `${trip.driverId.userId.firstName} ${trip.driverId.userId.lastName}`
                        : 'N/A'}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="route-cell">
                    <div className="route-from">
                      📍 {trip.bookingId?.pickupLocation?.address || 'N/A'}
                    </div>
                    <div className="route-to">
                      📌 {trip.bookingId?.deliveryLocation?.address || 'N/A'}
                    </div>
                  </div>
                </td>
                <td>{getStatusBadge(trip.status)}</td>
                <td>
                  {trip.startedAt 
                    ? new Date(trip.startedAt).toLocaleDateString()
                    : '-'}
                </td>
                <td>
                  {new Date(trip.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {trips.length === 0 && (
          <div className="no-data">No active trips found</div>
        )}
      </div>
    </div>
  );
};

export default Trips;
