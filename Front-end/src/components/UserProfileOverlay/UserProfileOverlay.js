import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { userProfileImageAtom, userFullNameAtom, logoutAtom } from '../../atoms/authAtoms';
import { cartAtom, cartDirtyAtom } from '../../atoms/cartAtoms';
import { syncCartToBackend } from '../../services/cartSyncService';
import axios from 'axios';

const UserProfileOverlay = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const profileImageUrl = useAtomValue(userProfileImageAtom);
  const fullName = useAtomValue(userFullNameAtom);
  const logout = useSetAtom(logoutAtom);
  const cart = useAtomValue(cartAtom);
  const [isDirty, setIsDirty] = useAtom(cartDirtyAtom);

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      // Sync cart before logout
      if (isDirty) {
        await syncCartToBackend(cart);
        setIsDirty(false);
      }

      await axios.post(process.env.REACT_APP_LOGOUT_URL, {}, { withCredentials: true });
      logout();
      navigate('/');
      onClose();
    } catch (error) {
      logout();
      navigate('/');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay background */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Profile menu */}
      <div
        ref={overlayRef}
        className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200"
      >
        {/* Profile header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
          <div className="flex items-center gap-3">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 text-lg font-bold">
                👤
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{fullName || 'User'}</p>
              <p className="text-xs text-blue-100">Manage Account</p>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="py-2">
          {/* Settings */}
          <button
            onClick={() => handleNavigation('/settings')}
            className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3 border-b border-gray-100"
          >
            <span className="text-lg">⚙️</span>
            <span className="font-medium text-sm">Settings</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => handleNavigation('/orders')}
            className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3 border-b border-gray-100"
          >
            <span className="text-lg">📦</span>
            <span className="font-medium text-sm">Orders</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
          >
            <span className="text-lg">🚪</span>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfileOverlay;
