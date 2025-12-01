import React, { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { userEmailAtom, updateUserAtom } from '../../../atoms/authAtoms';
import { updateEmail } from '../../../services/authService';

const UpdateEmail = () => {
  const currentEmail = useAtomValue(userEmailAtom);
  const updateUser = useSetAtom(updateUserAtom);
  const [email, setEmail] = useState(currentEmail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (email === currentEmail) {
      setError('New email is the same as current one');
      return;
    }

    setLoading(true);
    try {
      const result = await updateEmail(email);
      if (result.success) {
        updateUser({ email });
        setSuccess('Email address updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to update email address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Update Email Address</h2>
      <p className="text-gray-600 mb-6">Change your registered email address</p>

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
            Current Email Address
          </label>
          <input
            type="email"
            value={currentEmail}
            disabled
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your new email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-2">We'll send a confirmation to your new email</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Email Address'}
        </button>
      </form>
    </div>
  );
};

export default UpdateEmail;
