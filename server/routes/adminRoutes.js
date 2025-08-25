import express from 'express';
import { getUserData, addUserData, delete_UserData, update_UserData, getStats } from "../controllers/adminController.js";

import { middlewareToProtect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();


// Authenticated route to get user data
router.get("/stats", middlewareToProtect, getStats);
router.get('/getUserData', middlewareToProtect, isAdmin, getUserData)
router.post('/addUserData', middlewareToProtect, isAdmin, addUserData)
router.delete('/deleteUserData/:id', middlewareToProtect, isAdmin, delete_UserData)
router.put('/updateUserData/:id', middlewareToProtect, isAdmin, update_UserData)


export default router;