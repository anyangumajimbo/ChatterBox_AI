import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';

interface AuthRequest extends Request {
    user?: Omit<IUserDocument, 'password'>;
}

export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access token required'
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
};

export const generateToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET as Secret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );
}; 