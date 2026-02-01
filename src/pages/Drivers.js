import React, { useEffect, useState, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import * as driverService from '../services/driver';
import getErrorMessage from '../utils/errorHandler';
import './Drivers.css';

const API_BASE_URL = 'http://localhost:5000';

// Table component for reuse (must be outside main component)
function DriverTable({ drivers, actionLoading, handleViewDocuments, handleApprove, handleReject, getStatusBadge }) {
  if (!drivers || drivers.length === 0) return <div className="no-data">No drivers found</div>;
  return (
    <div className="table-container">
      <table className="drivers-table">
        <thead>
          <tr>
            <th>Driver Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Vehicle Details</th>
            <th>Documents</th>
            <th>Status</th>
            <th>Registered</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver._id}>
              <td className="driver-name">
                {driver.userId?.firstName} {driver.userId?.lastName}
              </td>
              <td>{driver.userId?.email}</td>
              <td>{driver.userId?.phone}</td>
              <td>
                <div className="vehicle-info">
                  <div>{driver.vehicleNumber || 'N/A'}</div>
                  <div className="vehicle-detail">
                    {driver.vehicleType} - {driver.vehicleCapacity}
                  </div>
                </div>
              </td>
              <td>
                {driver.licenseImageUrl && driver.rcImageUrl ? (
                  <span className="docs-status uploaded">✓ Uploaded</span>
                ) : (
                  <span className="docs-status missing">✗ Missing</span>
                )}
              </td>
              <td>{getStatusBadge(driver.approvalStatus)}</td>
              <td>{new Date(driver.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleViewDocuments(driver)}
                  >
                    View
                  </button>
                  {handleApprove && handleReject && driver.approvalStatus === 'pending' && (
                    <>
                      <button 
                        className="action-btn approve-btn"
                        onClick={() => handleApprove(driver._id)}
                        disabled={actionLoading === driver._id}
                      >
                        Approve
                      </button>
                      <button 
                        className="action-btn reject-btn"
                        onClick={() => handleReject(driver._id)}
                        disabled={actionLoading === driver._id}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      let pending = [], approved = [], rejected = [];
      if (activeTab === 'all') {
        pending = await driverService.getPendingDrivers();
        approved = await driverService.getApprovedDrivers();
        rejected = await driverService.getRejectedDrivers();
        setDrivers({ pending, approved, rejected });
      } else if (activeTab === 'pending') {
        pending = await driverService.getPendingDrivers();
        setDrivers({ pending });
      } else if (activeTab === 'approved') {
        approved = await driverService.getApprovedDrivers();
        setDrivers({ approved });
      } else if (activeTab === 'rejected') {
        rejected = await driverService.getRejectedDrivers();
        setDrivers({ rejected });
      } else {
        setDrivers({});
      }
    } catch (err) {
      const friendlyError = getErrorMessage(err);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleApprove = async (driverId) => {
    setConfirmAction({ type: 'approve', driverId });
    setShowConfirmModal(true);
  };

  const handleViewDocuments = (driver) => {
    setSelectedDriver(driver);
    setShowDocModal(true);
  };

  const handleReject = async (driverId) => {
    setConfirmAction({ type: 'reject', driverId });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    setActionLoading(confirmAction.driverId);
    try {
      if (confirmAction.type === 'approve') {
        await driverService.approveDriver(confirmAction.driverId);
        setShowDocModal(false);
        fetchDrivers();
        toast.success('Driver Approved!', {
          description: 'The driver can now start accepting bookings.',
          duration: 4000,
          position: 'top-right'
        });
      } else if (confirmAction.type === 'reject') {
        await driverService.rejectDriver(confirmAction.driverId);
        setShowDocModal(false);
        fetchDrivers();
        toast.error('Driver Rejected', {
          description: 'The driver has been rejected and will be notified.',
          duration: 4000,
          position: 'top-right'
        });
      }
    } catch (err) {
      const friendlyError = getErrorMessage(err);
      if (confirmAction.type === 'approve') {
        toast.error('Approval Failed', {
          description: friendlyError,
          duration: 4000,
          position: 'top-right'
        });
      } else {
        toast.error('Rejection Failed', {
          description: friendlyError,
          duration: 4000,
          position: 'top-right'
        });
      }
    } finally {
      setActionLoading(null);
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'status-pending' },
      approved: { label: 'Approved', className: 'status-approved' },
      rejected: { label: 'Rejected', className: 'status-rejected' },
      incomplete: { label: 'Incomplete', className: 'status-incomplete' },
    };
    const config = statusConfig[status] || { label: status, className: 'status-default' };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const tabs = [
    { id: 'all', label: 'All Drivers' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="drivers-page">
      <Toaster position="top-right" richColors />
      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading drivers...</div>
      ) : activeTab === 'all' ? (
        <>
          <h3>Pending Drivers</h3>
          <DriverTable drivers={drivers.pending || []} actionLoading={actionLoading} handleViewDocuments={handleViewDocuments} handleApprove={handleApprove} handleReject={handleReject} getStatusBadge={getStatusBadge} />
          <h3>Approved Drivers</h3>
          <DriverTable drivers={drivers.approved || []} actionLoading={actionLoading} handleViewDocuments={handleViewDocuments} getStatusBadge={getStatusBadge} />
          <h3>Rejected Drivers</h3>
          <DriverTable drivers={drivers.rejected || []} actionLoading={actionLoading} handleViewDocuments={handleViewDocuments} getStatusBadge={getStatusBadge} />
        </>
      ) : activeTab === 'pending' ? (
        <DriverTable drivers={drivers.pending || []} actionLoading={actionLoading} handleViewDocuments={handleViewDocuments} handleApprove={handleApprove} handleReject={handleReject} getStatusBadge={getStatusBadge} />
      ) : activeTab === 'approved' ? (
        <DriverTable drivers={drivers.approved || []} actionLoading={actionLoading} handleViewDocuments={handleViewDocuments} getStatusBadge={getStatusBadge} />
      ) : activeTab === 'rejected' ? (
        <DriverTable drivers={drivers.rejected || []} actionLoading={actionLoading} handleViewDocuments={handleViewDocuments} getStatusBadge={getStatusBadge} />
      ) : (
        <div className="no-data">No drivers found</div>
      )}


      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && (
        <div className="modal-overlay" onClick={handleConfirmCancel}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`confirm-icon ${confirmAction.type === 'approve' ? 'approve-icon' : 'reject-icon'}`}>
              {confirmAction.type === 'approve' ? '✓' : '!'}
            </div>
            <h2>
              {confirmAction.type === 'approve' ? 'Approve Driver?' : 'Reject Driver?'}
            </h2>
            <p>
              {confirmAction.type === 'approve'
                ? 'Are you sure you want to approve this driver? They will be able to start accepting bookings immediately.'
                : 'Are you sure you want to reject this driver? They will be notified of the rejection.'}
            </p>
            <div className="confirm-actions">
              <button
                className="confirm-btn cancel-btn"
                onClick={handleConfirmCancel}
                disabled={actionLoading === confirmAction.driverId}
              >
                Cancel
              </button>
              <button
                className={`confirm-btn action-btn ${
                  confirmAction.type === 'approve' ? 'approve-action-btn' : 'reject-action-btn'
                }`}
                onClick={handleConfirmAction}
                disabled={actionLoading === confirmAction.driverId}
              >
                {actionLoading === confirmAction.driverId ? 'Processing...' : 'Yes, Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocModal && selectedDriver && (
        <div className="modal-overlay" onClick={() => setShowDocModal(false)}>
          <div className="modal-content doc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Driver Documents - {selectedDriver.userId?.firstName} {selectedDriver.userId?.lastName}</h2>
              <button className="close-btn" onClick={() => setShowDocModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="driver-details">
                <div className="detail-row">
                  <strong>License Number:</strong> {selectedDriver.licenseNumber || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>License Expiry:</strong> {selectedDriver.licenseExpiry ? new Date(selectedDriver.licenseExpiry).toLocaleDateString() : 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Vehicle Number:</strong> {selectedDriver.vehicleNumber || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Vehicle Type:</strong> {selectedDriver.vehicleType || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Vehicle Capacity:</strong> {selectedDriver.vehicleCapacity || 'N/A'}
                </div>
              </div>

              <div className="documents-grid">
                <div className="document-item">
                  <h3>License Document</h3>
                  {selectedDriver.licenseImageUrl ? (
                    <img 
                      src={`${API_BASE_URL}/${selectedDriver.licenseImageUrl}`} 
                      alt="License" 
                      className="document-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  {!selectedDriver.licenseImageUrl && (
                    <div className="no-document">No license document uploaded</div>
                  )}
                  <div className="image-error" style={{display: 'none'}}>Failed to load image</div>
                </div>

                <div className="document-item">
                  <h3>RC Document</h3>
                  {selectedDriver.rcImageUrl ? (
                    <img 
                      src={`${API_BASE_URL}/${selectedDriver.rcImageUrl}`} 
                      alt="RC" 
                      className="document-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  {!selectedDriver.rcImageUrl && (
                    <div className="no-document">No RC document uploaded</div>
                  )}
                  <div className="image-error" style={{display: 'none'}}>Failed to load image</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedDriver.approvalStatus === 'pending' && (
                <>
                  <button 
                    className="modal-btn approve-modal-btn"
                    onClick={() => handleApprove(selectedDriver._id)}
                    disabled={actionLoading === selectedDriver._id}
                  >
                    ✓ Approve Driver
                  </button>
                  <button 
                    className="modal-btn reject-modal-btn"
                    onClick={() => handleReject(selectedDriver._id)}
                    disabled={actionLoading === selectedDriver._id}
                  >
                    ✗ Reject Driver
                  </button>
                </>
              )}
              <button className="modal-btn close-modal-btn" onClick={() => setShowDocModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
