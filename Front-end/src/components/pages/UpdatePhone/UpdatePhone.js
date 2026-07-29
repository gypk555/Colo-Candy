import React, { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { userPhoneAtom, updateUserAtom } from '../../../atoms/authAtoms';
import { updatePhone } from '../../../services/authService';

const UpdatePhone = () => {
  const currentPhone = useAtomValue(userPhoneAtom);
  const updateUser = useSetAtom(updateUserAtom);
  const [phone, setPhone] = useState(currentPhone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!phone) {
      setError('Please enter a phone number');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (phone === currentPhone) {
      setError('New phone number is the same as current one');
      return;
    }

    setLoading(true);
    try {
      const result = await updatePhone(phone);
      if (result.success) {
        updateUser({ phone });
        setSuccess('Phone number updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to update phone number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Update Phone Number</h2>
      <p className="text-gray-600 mb-6">Change your registered phone number</p>

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
            Current Phone Number
          </label>
          <input
            type="tel"
            value={currentPhone}
            disabled
            className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter 10-digit phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.slice(0, 10))}
            maxLength="10"
            pattern="[0-9]{10}"
            required
            className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-2">Enter a 10-digit phone number</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Phone Number'}
        </button>
      </form>
    </div>
  );
};

export default UpdatePhone;
