import React, { useState, useEffect } from 'react';
import './Invoices.css';
import {
  getInvoices,
  confirmBankTransfer,
  rejectBankTransfer
} from '../services/invoice';
const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await getInvoices();

      setInvoices(data);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (invoiceId) => {
    if (!window.confirm('Mark this invoice as paid?')) return;

    try {
      await confirmBankTransfer(invoiceId);
      alert('Invoice marked as paid');
      fetchInvoices();
    } catch (err) {
      console.error(err);
      alert('Failed to mark as paid');
    }
  };

  const handleRejectPayment = async (invoiceId) => {
    if (!window.confirm('Reject this bank transfer?')) return;

    try {
      await rejectBankTransfer(invoiceId);
      alert('Invoice rejected');
      fetchInvoices();
    } catch (err) {
      console.error(err);
      alert('Failed to reject payment');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      admin_reviewing: { label: 'Admin Reviewing', className: 'status-reviewing' },
      confirmed: { label: 'Confirmed', className: 'status-confirmed' },
      paid: { label: 'Paid', className: 'status-paid' },
    };
    const config = statusConfig[status] || { label: status, className: 'status-default' };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) {
    return <div className="invoices-loading">Loading invoices...</div>;
  }

  return (
    <div className="invoices-page">
      <div className="table-container">
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Load ID</th>
              <th>Driver</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                
                  <td>{invoice._id.slice(0, 8)}</td>

                  <td>{invoice.trip?._id?.slice(0, 8)}</td>

                  <td>{invoice.driver?.name || invoice.driver?.vehicleNumber}</td>

                  <td>${invoice.totalAmount?.toLocaleString()}</td>

                  <td>{getStatusBadge(invoice.status)}</td>

                  <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view-btn">View</button>
                    {invoice.status === 'awaiting_bank_transfer' && (
                      <>
                        <button
                          className="action-btn confirm-btn"
                          onClick={() => handleMarkPaid(invoice._id)}
                        >
                          Mark Paid
                        </button>

                        <button
                          className="action-btn reject-btn"
                          onClick={() => handleRejectPayment(invoice._id)}
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

        {invoices.length === 0 && (
          <div className="no-data">No invoices found</div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
