import React, { useState, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { userProfileImageAtom, updateUserAtom } from '../../../atoms/authAtoms';
import { uploadProfileImage } from '../../../services/authService';

const ProfilePictureUpload = () => {
  const currentProfileImage = useAtomValue(userProfileImageAtom);
  const updateUser = useSetAtom(updateUserAtom);
  const fileInputRef = useRef(null);

  const [previewImage, setPreviewImage] = useState(currentProfileImage || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await uploadProfileImage(selectedFile);
      if (result.success) {
        updateUser({ profileImage: result.profileImage });
        setSuccess('Profile picture updated successfully!');
        setSelectedFile(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Profile Picture</h2>
      <p className="text-gray-600 mb-6">Upload or change your profile picture</p>

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

      <div className="max-w-md">
        {/* Image Preview */}
        <div className="mb-6 flex justify-center">
          <div className="w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <span className="text-5xl mb-2">📷</span>
                <p className="text-sm text-gray-500">No image selected</p>
              </div>
            )}
          </div>
        </div>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="profile-image-input"
        />

        {/* File Selection Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded font-semibold cursor-pointer hover:border-blue-600 hover:text-blue-600 transition-colors mb-4"
        >
          Choose Image
        </button>

        {/* File Info */}
        {selectedFile && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-900">
              <strong>Selected:</strong> {selectedFile.name}
            </p>
            <p className="text-xs text-blue-700">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {selectedFile && (
            <>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="flex-1 p-3 border border-gray-300 text-gray-700 rounded font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                className="flex-1 p-3 bg-blue-600 text-white rounded font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </>
          )}
          {!selectedFile && currentProfileImage && (
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="w-full p-3 border border-gray-300 text-gray-700 rounded font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
            >
              Change Picture
            </button>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-semibold text-sm text-gray-900 mb-2">Requirements:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Format: JPG, PNG, GIF, WebP</li>
            <li>• Size: Maximum 5MB</li>
            <li>• Recommended: Square image (1:1 ratio)</li>
            <li>• Minimum: 200x200 pixels</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
