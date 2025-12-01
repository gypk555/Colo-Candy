import React, { useState } from 'react';
import { changePassword } from '../../../services/authService';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (oldPassword === newPassword) {
      setError('New password must be different from the old one');
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword(oldPassword, newPassword);
      if (result.success) {
        setSuccess('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Change Password</h2>
      <p className="text-gray-600 mb-6">Update your password to keep your account secure</p>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.old ? 'text' : 'password'}
              placeholder="Enter your current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('old')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.old ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              placeholder="Enter your new password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.new ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">At least 6 characters</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
