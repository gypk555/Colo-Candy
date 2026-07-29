import express from 'express';
import multer from 'multer';
import {
  getUserProfile,
  updatePhone,
  updateEmail,
  saveAddress,
  uploadProfileImage
} from '../controllers/userProfileController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// User profile routes
router.get('/profile', getUserProfile);
router.put('/phone', updatePhone);
router.put('/email', updateEmail);
router.post('/address', saveAddress);
router.post('/upload-profile-image', upload.single('profileImage'), uploadProfileImage);

export default router;
