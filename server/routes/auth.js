import express from 'express';
import { register, login, verifyOTP, forgetPassword, resetPassword } from '../controllers/authController.js';

import { middlewareToProtect } from '../middleware/authMiddleware.js';
import { profile } from '../controllers/userController.js';
import { upload_image_contoller } from '../controllers/uploadController.js';

const router = express.Router();


// Register route
router.post('/register', register)

// Login route
router.post('/login', login)

// Verify OTP route
router.post('/verify-otp', verifyOTP)

// Login route
router.get("/profile", middlewareToProtect, profile);

// Verify OTP route
router.post('/forgetPassword', forgetPassword)

// Reset-password route
router.post("/resetPassword/:token", resetPassword);


// ye just image upload ke liye hai
router.post("/", upload_image_contoller);


export default router;