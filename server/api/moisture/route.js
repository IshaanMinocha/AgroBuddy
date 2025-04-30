import express from 'express';
import { protect } from '../../middlewares/AuthMiddleware.js';

const router = express.Router();

router.route('/esp').post(protect, getMoisture);

export default router;
