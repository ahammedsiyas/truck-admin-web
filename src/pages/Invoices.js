import React, { useState, useEffect } from 'react';
import './Invoices.css';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      // Mock data - replace with GET /api/invoices
      const mockInvoices = [
        {
          id: 'INV-2001',
          loadId: 'BK-1003',
          driver: 'Sarah Smith',
          amount: 52000,
          status: 'admin_reviewing',
          createdDate: '2026-01-10',
        },
        {
          id: 'INV-2002',
          loadId: 'BK-1005',
          driver: 'John Doe',
          amount: 38000,
          status: 'confirmed',
          createdDate: '2026-01-09',
        },
        {
          id: 'INV-2003',
          loadId: 'BK-1007',
          driver: 'Mike Johnson',
          amount: 45000,
          status: 'paid',
          createdDate: '2026-01-08',
        },
      ];
      setInvoices(mockInvoices);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmInvoice = async (invoiceId) => {
    if (!window.confirm('Confirm this invoice? Driver will be able to request payment.')) return;
    
    try {
      // API: PUT /api/invoices/:id/confirm
      console.log('Confirming invoice:', invoiceId);
      alert('Invoice confirmed successfully');
      fetchInvoices();
    } catch (err) {
      console.error('Failed to confirm invoice:', err);
      alert('Failed to confirm invoice');
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
              <tr key={invoice.id}>
                <td className="invoice-id">{invoice.id}</td>
                <td>{invoice.loadId}</td>
                <td>{invoice.driver}</td>
                <td className="amount">₹{invoice.amount.toLocaleString()}</td>
                <td>{getStatusBadge(invoice.status)}</td>
                <td>{new Date(invoice.createdDate).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view-btn">View</button>
                    {invoice.status === 'admin_reviewing' && (
                      <button 
                        className="action-btn confirm-btn"
                        onClick={() => handleConfirmInvoice(invoice.id)}
                      >
                        Confirm
                      </button>
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
