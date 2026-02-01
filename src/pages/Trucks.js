import React, { useState, useEffect } from 'react';
import './Trucks.css';

const Trucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      // Mock data - replace with GET /api/trucks
      const mockTrucks = [
        {
          id: 'TRK-7001',
          vehicleNumber: 'MH-01-AB-1234',
          driver: 'John Doe',
          vehicleType: '20 Ton Truck',
          capacity: '20000 kg',
          status: 'available',
          lastService: '2026-01-05',
        },
        {
          id: 'TRK-7002',
          vehicleNumber: 'MH-02-CD-5678',
          driver: 'Sarah Smith',
          vehicleType: '15 Ton Truck',
          capacity: '15000 kg',
          status: 'on_trip',
          lastService: '2025-12-20',
        },
        {
          id: 'TRK-7003',
          vehicleNumber: 'KA-03-EF-9012',
          driver: 'Mike Johnson',
          vehicleType: '25 Ton Truck',
          capacity: '25000 kg',
          status: 'maintenance',
          lastService: '2026-01-08',
        },
      ];
      setTrucks(mockTrucks);
    } catch (err) {
      console.error('Failed to fetch trucks:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: 'Available', className: 'status-available' },
      on_trip: { label: 'On Trip', className: 'status-on-trip' },
      maintenance: { label: 'Maintenance', className: 'status-maintenance' },
      offline: { label: 'Offline', className: 'status-offline' },
    };
    const config = statusConfig[status] || { label: status, className: 'status-default' };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) {
    return <div className="trucks-loading">Loading trucks...</div>;
  }

  return (
    <div className="trucks-page">
      <div className="table-container">
        <table className="trucks-table">
          <thead>
            <tr>
              <th>Truck ID</th>
              <th>Vehicle Number</th>
              <th>Driver</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Last Service</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck) => (
              <tr key={truck.id}>
                <td className="truck-id">{truck.id}</td>
                <td className="vehicle-number">{truck.vehicleNumber}</td>
                <td>{truck.driver}</td>
                <td>{truck.vehicleType}</td>
                <td className="capacity">{truck.capacity}</td>
                <td>{getStatusBadge(truck.status)}</td>
                <td>{new Date(truck.lastService).toLocaleDateString()}</td>
                <td>
                  <button className="action-btn view-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {trucks.length === 0 && (
          <div className="no-data">No trucks found</div>
        )}
      </div>
    </div>
  );
};

export default Trucks;
