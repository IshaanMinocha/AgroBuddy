import express from 'express'
import { getWeatherData } from './controller.js';

const router = express.Router();

router.route("/").get(getWeatherData)

export default router;