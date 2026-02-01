import React, { useState, useEffect } from 'react';
import './Settlements.css';

const Settlements = () => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      // Mock data - replace with GET /api/settlements
      const mockSettlements = [
        {
          id: 'SET-3001',
          driver: 'Sarah Smith',
          amount: 156000,
          invoiceCount: 3,
          adminStatus: 'pending',
          paymentStatus: 'unpaid',
          createdDate: '2026-01-10',
        },
        {
          id: 'SET-3002',
          driver: 'John Doe',
          amount: 98000,
          invoiceCount: 2,
          adminStatus: 'approved',
          paymentStatus: 'unpaid',
          createdDate: '2026-01-09',
        },
        {
          id: 'SET-3003',
          driver: 'Mike Johnson',
          amount: 125000,
          invoiceCount: 4,
          adminStatus: 'approved',
          paymentStatus: 'paid',
          createdDate: '2026-01-08',
        },
      ];
      setSettlements(mockSettlements);
    } catch (err) {
      console.error('Failed to fetch settlements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSettlement = async (settlementId) => {
    if (!window.confirm('Approve this settlement? All invoices must be confirmed.')) return;
    
    try {
      // API: PUT /api/settlements/:id/approve
      console.log('Approving settlement:', settlementId);
      alert('Settlement approved');
      fetchSettlements();
    } catch (err) {
      console.error('Failed to approve settlement:', err);
      alert('Failed to approve settlement');
    }
  };

  const handleMarkAsPaid = async (settlementId) => {
    if (!window.confirm('Mark this settlement as paid?')) return;
    
    try {
      // API: PUT /api/settlements/:id/pay
      console.log('Marking settlement as paid:', settlementId);
      alert('Settlement marked as paid');
      fetchSettlements();
    } catch (err) {
      console.error('Failed to mark settlement as paid:', err);
      alert('Failed to update payment status');
    }
  };

  const getAdminStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending Review', className: 'admin-status-pending' },
      approved: { label: 'Approved', className: 'admin-status-approved' },
    };
    const config = statusConfig[status] || { label: status, className: 'admin-status-default' };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      unpaid: { label: 'Unpaid', className: 'payment-status-unpaid' },
      paid: { label: 'Paid', className: 'payment-status-paid' },
    };
    const config = statusConfig[status] || { label: status, className: 'payment-status-default' };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) {
    return <div className="settlements-loading">Loading settlements...</div>;
  }

  return (
    <div className="settlements-page">
      <div className="table-container">
        <table className="settlements-table">
          <thead>
            <tr>
              <th>Settlement ID</th>
              <th>Driver</th>
              <th>Amount</th>
              <th>Invoice Count</th>
              <th>Admin Status</th>
              <th>Payment Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map((settlement) => (
              <tr key={settlement.id}>
                <td className="settlement-id">{settlement.id}</td>
                <td>{settlement.driver}</td>
                <td className="amount">₹{settlement.amount.toLocaleString()}</td>
                <td>
                  <span className="invoice-count-badge">{settlement.invoiceCount}</span>
                </td>
                <td>{getAdminStatusBadge(settlement.adminStatus)}</td>
                <td>{getPaymentStatusBadge(settlement.paymentStatus)}</td>
                <td>{new Date(settlement.createdDate).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    {settlement.adminStatus === 'pending' && (
                      <button 
                        className="action-btn approve-btn"
                        onClick={() => handleApproveSettlement(settlement.id)}
                      >
                        Approve
                      </button>
                    )}
                    {settlement.adminStatus === 'approved' && settlement.paymentStatus === 'unpaid' && (
                      <button 
                        className="action-btn pay-btn"
                        onClick={() => handleMarkAsPaid(settlement.id)}
                      >
                        Mark Paid
                      </button>
                    )}
                    <button className="action-btn view-btn">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {settlements.length === 0 && (
          <div className="no-data">No settlements found</div>
        )}
      </div>
    </div>
  );
};

export default Settlements;
