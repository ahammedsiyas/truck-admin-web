import api from './api';

// 🔹 Get all settlements (Admin)
export const getSettlements = async () => {
  const response = await api.get('/settlements');
  return response.data;
};

// 🔹 Approve settlement
export const approveSettlement = async (id) => {
  const response = await api.put(`/settlements/${id}/approve`);
  return response.data;
};

// 🔹 Mark settlement as paid
export const markSettlementPaid = async (id, method, transactionId) => {
  return api.put(`/settlements/${id}/paid`, {
    method,
    transactionId
  });
};

// Generate settlement for driver
export const generateSettlement = async (driverId) => {
  const response = await api.post('/settlements', {
    driverId,
  });
  return response.data;
};