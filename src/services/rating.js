import api from './api';

export const getRatings = async () => {
  const res = await api.get('/ratings/admin');
  return res.data;
};