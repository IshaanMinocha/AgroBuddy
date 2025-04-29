import express from 'express';
import { espAction } from './controller.js';

const router = express.Router();

router.route("/post-action").post(espAction);

export default router;