import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { getCurrentUsername } = useAuth();
  const [username, setUsername] = useState(getCurrentUsername() || '');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setEmail(res.data.email || '');
        setAddress(res.data.address || '');
        setPhone(res.data.phone || '');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch profile data.');
      }
    };
    fetchUserProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.put('/users/profile', { username, email, address, phone });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(newPassword)) {
      setError('New password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      await api.put('/users/change-password', { oldPassword, newPassword });
      setMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      // Optionally redirect after a short delay
      setTimeout(() => history.push('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to change password.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>User Profile</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Update Profile Information</h3>
      <form onSubmit={handleProfileUpdate}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input type="text" value={username} readOnly style={{ width: '100%', padding: '8px', boxSizing: 'border-box', backgroundColor: '#f0f0f0' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Phone:</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Update Profile
        </button>
      </form>

      <h3 style={{ marginTop: '30px' }}>Change Password</h3>
      <form onSubmit={handleChangePassword}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Old Password:</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Confirm New Password:</label>
          <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
        </div>
        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Change Password
        </button>
      </form>
    </div>
  );
}

export default Profile;