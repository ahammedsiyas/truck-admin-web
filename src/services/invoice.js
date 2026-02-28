import api from './api';

// Get all invoices
export const getInvoices = async () => {
  const response = await api.get('/invoices');
  return response.data;
};

// Confirm bank transfer
export const confirmBankTransfer = async (invoiceId) => {
  const response = await api.put(
    `/invoices/${invoiceId}/confirm-bank-transfer`
  );
  return response.data;
};

// Reject bank transfer
export const rejectBankTransfer = async (invoiceId) => {
  const response = await api.put(
    `/invoices/${invoiceId}/reject-bank-transfer`
  );
  return response.data;
};