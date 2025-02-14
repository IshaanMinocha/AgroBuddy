import express from 'express';
import { sendVoice, processQuery, getVoice, getUserTranscriptions, getAllTranscriptions } from './controller.js';
import { singleUpload } from '../../middlewares/Multer.js';
import { adminOnly, protect } from '../../middlewares/AuthMiddleware.js';

const router = express.Router();

router.route('/transciptions').get(protect, getUserTranscriptions);
router.route('/getAllTranscriptions').get(protect, adminOnly, getAllTranscriptions);
router.route('/out').post(protect, singleUpload, sendVoice);
router.route('/process').post(protect, processQuery);
router.route('/in').post(protect, getVoice);

export default router;