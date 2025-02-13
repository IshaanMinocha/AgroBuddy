import express from 'express';
import { sendVoice, processQuery, getVoice } from './controller.js';
import { singleUpload } from '../../middlewares/Multer.js';

const router = express.Router();

router.route('/out').post(singleUpload, sendVoice);
router.route('/process').post(processQuery);
router.route('/in').get(getVoice);

export default router;