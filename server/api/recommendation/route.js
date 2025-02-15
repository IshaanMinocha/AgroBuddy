import express from 'express';

import { protect } from '../../middlewares/AuthMiddleware.js';
import { chatCompletion } from './controller.js';

const router = express.Router();

router.route('/chat').post(protect, chatCompletion);

export default router;