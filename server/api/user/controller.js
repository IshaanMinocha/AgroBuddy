import User from './model.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '30d',
    });
};

const registerUser = asyncHandler(async (req, res) => {
    console.log("Hello")
    const { mobile, password, name } = req.body;
    const userExists = await User.findOne({ mobile });

    if (userExists) {
        res.status(400).json({
            message: 'User already exists',
            success: false
        });
    }

    const user = await User.create({ mobile, password, name });

    if (user) {
        res.status(201).json({
            user: user,
            token: generateToken(user._id),
            success: true,
            message: "User created successfully"
        });

    } else {
        res.status(400).json({
            message: 'Invalid user data',
            success: false
        })
    }
});

const loginUser = asyncHandler(async (req, res) => {

    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });

    if (!user) {
        res.status(401).json({
            message: 'User not found',
            success: false
        });
    }

    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            user: user,
            token: generateToken(user._id),
            success: true,
            message: "Logged in successfully"
        });

    } else {
        res.status(401).json({
            message: 'Invalid mobile number or password',
            success: false
        }
        )
    }
});

const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
        res.status(404).json({
            message: 'User not found',
            success: false
        });
    }

    if (user) {
        res.status(200).json({
            user,
            message: "Profile retrieved successfully",
            success: true
        });
    }

});

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            users,
        });
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving users',
        });
    }
});

export { registerUser, loginUser, getUserProfile, getAllUsers };
