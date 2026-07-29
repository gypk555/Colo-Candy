import React, { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAddressAtom, updateUserAtom } from '../../../atoms/authAtoms';
import { saveAddress } from '../../../services/authService';

const UpdateAddress = () => {
  const currentAddress = useAtomValue(userAddressAtom);
  const updateUser = useSetAtom(updateUserAtom);

  const [address, setAddress] = useState({
    fullName: currentAddress?.fullName || '',
    phoneNumber: currentAddress?.phoneNumber || '',
    street: currentAddress?.street || '',
    city: currentAddress?.city || '',
    state: currentAddress?.state || '',
    zipCode: currentAddress?.zipCode || '',
    country: currentAddress?.country || 'India',
    type: currentAddress?.type || 'home' // home, work, other
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!address.fullName || !address.phoneNumber || !address.street || !address.city || !address.state || !address.zipCode) {
      setError('Please fill in all fields');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(address.phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    const zipCodeRegex = /^[0-9]{6}$/;
    if (!zipCodeRegex.test(address.zipCode)) {
      setError('Please enter a valid 6-digit zip code');
      return;
    }

    setLoading(true);
    try {
      const result = await saveAddress(address);
      if (result.success) {
        updateUser({ address: result.address });
        setSuccess('Address saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Save or Update Address</h2>
      <p className="text-gray-600 mb-6">Add or update your delivery address</p>

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

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter recipient's full name"
            value={address.fullName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Enter 10-digit phone number"
            value={address.phoneNumber}
            onChange={(e) => setAddress(prev => ({
              ...prev,
              phoneNumber: e.target.value.slice(0, 10)
            }))}
            maxLength="10"
            pattern="[0-9]{10}"
            required
            className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Street Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address
          </label>
          <input
            type="text"
            name="street"
            placeholder="Enter street address (house no., building name)"
            value={address.street}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* City and State */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={address.city}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={address.state}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Zip Code and Country */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code
            </label>
            <input
              type="text"
              name="zipCode"
              placeholder="Enter 6-digit zip code"
              value={address.zipCode}
              onChange={(e) => setAddress(prev => ({
                ...prev,
                zipCode: e.target.value.slice(0, 6)
              }))}
              maxLength="6"
              pattern="[0-9]{6}"
              required
              className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={address.country}
              disabled
              className="w-full p-3 border border-gray-300 rounded bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Address Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Type
          </label>
          <div className="flex gap-4">
            {['home', 'work', 'other'].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={address.type === type}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700 capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Address'}
        </button>
      </form>
    </div>
  );
};

export default UpdateAddress;
