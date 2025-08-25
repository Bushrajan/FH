import express from 'express';
import { upload_image_contoller } from '../controllers/uploadController.js';

const router = express.Router();
router.post('/', upload_image_contoller);
export default router;
