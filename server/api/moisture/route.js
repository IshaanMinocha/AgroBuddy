import express from 'express';
import { getMoisture } from './controller.js';

const router = express.Router();

router.route("/get").get(getMoisture);

export default router;