import express from 'express';
import { registerUser, loginUser, getUserProfile, getAllUsers } from './UserController.js';
import { adminOnly, protect } from '../../middlewares/AuthMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/all').get(protect, adminOnly, getAllUsers);

export default router;
