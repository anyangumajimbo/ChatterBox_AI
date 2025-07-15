import { Request, Response } from 'express';
import { User, IUserDocument } from '../models/User';
import { generateToken } from '../middleware/auth';
import { IUserRegistration, IUserLogin, AuthResponse, ApiResponse } from '../../../shared/types';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData: IUserRegistration = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User with this email already exists'
            } as ApiResponse<null>);
            return;
        }

        // Create new user
        const user = new User(userData);
        await user.save();
        console.log('✅ New user registered:', user.email); // <-- Added log

        // Generate token
        const token = generateToken(user._id.toString());

        const response: AuthResponse = {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                country: user.country,
                height: user.height,
                preferences: user.preferences,
                personalityTags: user.personalityTags,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token
        };

        res.status(201).json({
            success: true,
            data: response,
            message: 'User registered successfully'
        } as ApiResponse<AuthResponse>);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during registration'
        } as ApiResponse<null>);
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: IUserLogin = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            } as ApiResponse<null>);
            return;
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            } as ApiResponse<null>);
            return;
        }

        // Generate token
        const token = generateToken(user._id.toString());

        const response: AuthResponse = {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                country: user.country,
                height: user.height,
                preferences: user.preferences,
                personalityTags: user.personalityTags,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token
        };

        res.status(200).json({
            success: true,
            data: response,
            message: 'Login successful'
        } as ApiResponse<AuthResponse>);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during login'
        } as ApiResponse<null>);
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;

        res.status(200).json({
            success: true,
            data: user,
            message: 'Profile retrieved successfully'
        } as ApiResponse<Omit<IUserDocument, 'password'>>);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while retrieving profile'
        } as ApiResponse<null>);
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const updateData = req.body;

        // Remove sensitive fields from update
        delete updateData.password;
        delete updateData.email; // Email updates should be handled separately

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            } as ApiResponse<null>);
            return;
        }

        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'Profile updated successfully'
        } as ApiResponse<Omit<IUserDocument, 'password'>>);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while updating profile'
        } as ApiResponse<null>);
    }
}; 