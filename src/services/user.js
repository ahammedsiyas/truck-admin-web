import api from './api';

export const getAdminProfile = async () => {
  const res = await api.get('/users/profile/admin');
  return res.data?.data || {};
};

export const updateAdminProfile = async (data) => {
  const res = await api.put('/users/profile/admin', data);
  return res.data?.data || {};
};
