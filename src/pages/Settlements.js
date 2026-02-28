import React, { useEffect, useState } from 'react';
import { FiUser, FiCheckCircle, FiCreditCard } from 'react-icons/fi';
import * as settlementService from '../services/settlement';
import * as driverService from '../services/driver';
import './Settlements.css';

const Settlements = () => {
  const [settlements, setSettlements] = useState([]);
  const [approvedDrivers, setApprovedDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('NEFT');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await settlementService.getSettlements();
    const driversRes = await driverService.getApprovedDrivers();
    setApprovedDrivers(driversRes);
    setSettlements(data);
    setLoading(false);
  };

  const filteredSettlements = selectedDriver
    ? settlements.filter(s => s.driver?._id === selectedDriver)
    : settlements;

  const handleDriverSelect = (driverId) => {
    setSelectedDriver(driverId);
    const driver = approvedDrivers.find(d => d._id === driverId);
    if (!driver) return setPreview(null);

    const total = driver.unsettledAmount || 0;
    const percentage = driver.planPercentage || 10;
    const platformFee = total * (percentage / 100);
    const payout = total - platformFee;

    setPreview({
      total,
      percentage,
      platformFee,
      payout,
      invoiceCount: driver.unpaidInvoiceCount || 0,
    });
  };

  const handleGenerate = async () => {
    if (!selectedDriver) return;
    await settlementService.generateSettlement(selectedDriver);
    setPreview(null);
    setSelectedDriver('');
    fetchData();
  };

  const handleApprove = async (id) => {
    await settlementService.approveSettlement(id);
    fetchData();
  };

  const handleMarkPaid = async () => {
    if (!selectedSettlement) return;
    await settlementService.markSettlementPaid(
      selectedSettlement._id,
      paymentMethod,
      transactionId
    );
    setSelectedSettlement(null);
    setTransactionId('');
    fetchData();
  };

  if (loading) return <div className="settlements-loading">Loading settlements...</div>;

  return (
    <div className="settlements-page">

      {/* ===== Generate Settlement Card ===== */}
      <div className="card">
        <div className="card-header">
          <FiUser />
          <h3>Generate Settlement</h3>
        </div>

        <div className="generator-row">
          <select
            className="premium-select"
            value={selectedDriver}
            onChange={(e) => handleDriverSelect(e.target.value)}
          >
            <option value="">Select Driver</option>
            {approvedDrivers.map(driver => (
              <option key={driver._id} value={driver._id}>
                {driver.userId.firstName} {driver.userId.lastName}
              </option>
            ))}
          </select>
        </div>

        {preview && (
          <div className="preview-box">
            <div className="preview-grid">
              <div>
                <span>Total</span>
                <strong>₹{preview.total.toLocaleString()}</strong>
              </div>
              <div>
                <span>Invoices</span>
                <strong>{preview.invoiceCount}</strong>
              </div>
              <div>
                <span>Platform Fee</span>
                <strong>₹{preview.platformFee.toLocaleString()}</strong>
              </div>
              <div>
                <span>Payout</span>
                <strong className="highlight">
                  ₹{preview.payout.toLocaleString()}
                </strong>
              </div>
            </div>

            <button className="primary-btn" onClick={handleGenerate}>
              Generate Settlement
            </button>
          </div>
        )}
      </div>

      {/* ===== Existing Settlements ===== */}
      <div className="card">
        <div className="card-header">
          <FiCreditCard />
          <h3>Existing Settlements</h3>
        </div>

        <div className="table-container">
          <table className="settlements-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Driver</th>
                <th>Invoices</th>
                <th>Gross</th>
                <th>Platform Fee</th>
                <th>Payout</th>
                <th>Bank</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSettlements.map(settlement => (
                <tr key={settlement._id}>
                  <td>{new Date(settlement.createdAt).toLocaleDateString()}</td>
                  <td>{settlement.driver.userId.firstName}</td>
                  <td>{settlement.invoices?.length || 0}</td>
                  <td>₹{settlement.totalInvoiceAmount?.toLocaleString()}</td>
                  <td>₹{settlement.totalPlatformFee?.toLocaleString()}</td>
                  <td className="payout-cell">
                    ₹{settlement.totalDriverPayout?.toLocaleString()}
                  </td>
                  <td>{settlement.driver.bankDetails?.bankName || 'Not Added'}</td>
                  <td>
                    <span className={`status-badge ${settlement.status}`}>
                      {settlement.status}
                    </span>
                  </td>
                  <td>
                    {settlement.status === 'pending' && (
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(settlement._id)}
                      >
                        Approve
                      </button>
                    )}
                    {settlement.status === 'approved' && (
                      <button
                        className="pay-btn"
                        onClick={() => setSelectedSettlement(settlement)}
                      >
                        Process
                      </button>
                    )}
                    {settlement.status === 'paid' && (
                      <span className="completed-text">
                        <FiCheckCircle /> Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Modal ===== */}
      {selectedSettlement && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Process Payout</h3>

            <div className="modal-details">
              <p><strong>Driver:</strong> {selectedSettlement.driver.userId.firstName}</p>
              <p><strong>Amount:</strong> ₹{selectedSettlement.totalDriverPayout}</p>
              <p><strong>Bank:</strong> {selectedSettlement.driver.bankDetails?.bankName}</p>
            </div>

            <select
              className="premium-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="ZELLES">ZELLES</option>
              <option value="WIRE TRANSFER">WIRE TRANSFER</option>
              
            </select>

            <input
              className="premium-input"
              type="text"
              placeholder="Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />

            <div className="modal-actions">
              <button className="primary-btn" onClick={handleMarkPaid}>
                Confirm Payment
              </button>
              <button
                className="secondary-btn"
                onClick={() => setSelectedSettlement(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settlements;