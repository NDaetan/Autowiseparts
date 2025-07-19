import api from './api';

export const register = async (username, password) => {
  const res = await api.post('/users/register', { username, password });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

export const login = async (username, password) => {
  try {
    const res = await api.post('/users/login', { username, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
    }
    return res.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const getCurrentUsername = () => {
  return localStorage.getItem('username');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

export const getCurrentUser = () => {
  return localStorage.getItem('token');
};