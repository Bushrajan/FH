import express from 'express';
import { getAllHijabStyles } from './hijabGallController.js'; 

const router = express.Router();

// 🔹 GET all hijab styles
router.get('/', getAllHijabStyles);

export default router;