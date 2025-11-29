import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { isLoggedInAtom, userAtom } from '../../../atoms/authAtoms';
import UpdatePhone from '../UpdatePhone/UpdatePhone';
import UpdateEmail from '../UpdateEmail/UpdateEmail';
import ChangePassword from '../ChangePassword/ChangePassword';
import UpdateAddress from '../UpdateAddress/UpdateAddress';
import ProfilePictureUpload from '../ProfilePictureUpload/ProfilePictureUpload';

const Settings = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const [activeTab, setActiveTab] = useState('profile'); // profile, phone, email, password, address

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Profile Picture', icon: '📷' },
    { id: 'phone', label: 'Phone Number', icon: '📞' },
    { id: 'email', label: 'Email Address', icon: '📧' },
    { id: 'password', label: 'Change Password', icon: '🔒' },
    { id: 'address', label: 'Save Address', icon: '📍' }
  ];

  return (
    <div className="flex flex-col min-h-[80vh] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline text-sm mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your profile and account preferences</p>
        </div>
      </div>

      {/* Settings content */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-6">
        <div className="flex gap-6">
          {/* Sidebar - Tabs */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 font-semibold border-r-4 border-r-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {activeTab === 'profile' && <ProfilePictureUpload />}
            {activeTab === 'phone' && <UpdatePhone />}
            {activeTab === 'email' && <UpdateEmail />}
            {activeTab === 'password' && <ChangePassword />}
            {activeTab === 'address' && <UpdateAddress />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
