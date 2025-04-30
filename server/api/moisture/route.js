import express from 'express';
import { getMoisture } from './controller.js';

const router = express.Router();

router.route('/esp').get(getMoisture);

export default router;
