import express from 'express';
import { espAction } from './controller';

const router = express.Router();

router.route("/esp-action").post(espAction);

export default router;