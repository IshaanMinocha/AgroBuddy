import express from 'express';
import { protect } from '../../middlewares/AuthMiddleware.js';
import { getMoisture } from './controller.js';
import { getMoisture } from './controller.js';

const router = express.Router();

router.route('/esp').get(getMoisture);

export default router;
