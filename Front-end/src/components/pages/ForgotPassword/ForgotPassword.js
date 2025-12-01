import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordResetOTP, verifyPasswordResetOTP, resetPassword } from '../../../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await requestPasswordResetOTP(email);
      if (result.success) {
        setSuccess('OTP sent to your email. Please check your inbox.');
        setStep(2);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await verifyPasswordResetOTP(email, otp);
      if (result.success) {
        setResetToken(result.token);
        setSuccess('OTP verified successfully.');
        setStep(3);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('Please enter your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await resetPassword(email, otp, newPassword, resetToken);
      if (result.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/login');
    } else {
      setStep(step - 1);
      setError('');
      setSuccess('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-5">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
          <p className="text-gray-600 text-sm">
            {step === 1 && 'Enter your email to receive a password reset code'}
            {step === 2 && 'Enter the OTP sent to your email'}
            {step === 3 && 'Create your new password'}
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm mb-2 ${
                  step >= stepNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {stepNum}
              </div>
              <p className="text-xs text-gray-600">
                {stepNum === 1 && 'Email'}
                {stepNum === 2 && 'OTP'}
                {stepNum === 3 && 'New Password'}
              </p>
            </div>
          ))}
        </div>

        {/* Error and Success messages */}
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

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Email Address:</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2.5 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="p-2.5 bg-blue-600 text-white rounded font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Enter OTP:</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                maxLength="6"
                required
                className="p-2.5 border border-gray-300 rounded text-center text-2xl tracking-widest outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Check your email for the OTP code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="p-2.5 bg-blue-600 text-white rounded font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-blue-600 hover:underline"
            >
              Didn't receive OTP? Go back
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">New Password:</label>
              <input
                type="password"
                placeholder="Enter new password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="p-2.5 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Confirm Password:</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="p-2.5 border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="p-2.5 bg-blue-600 text-white rounded font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Back button */}
        <button
          onClick={handleBack}
          className="mt-6 w-full text-center text-blue-600 hover:underline text-sm"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
