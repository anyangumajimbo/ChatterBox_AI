import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array()
        });
        return;
    }
    next();
};

export const validateRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('country')
        .trim()
        .notEmpty()
        .withMessage('Country is required'),

    body('height')
        .isInt({ min: 100, max: 250 })
        .withMessage('Height must be between 100 and 250 cm'),

    body('preferences.interests')
        .optional()
        .isArray()
        .withMessage('Interests must be an array'),

    body('preferences.communicationStyle')
        .optional()
        .isIn(['casual', 'formal', 'friendly', 'professional'])
        .withMessage('Invalid communication style'),

    body('preferences.relationshipGoals')
        .optional()
        .isIn(['friendship', 'romance', 'networking', 'casual'])
        .withMessage('Invalid relationship goal'),

    body('personalityTags')
        .optional()
        .isArray()
        .withMessage('Personality tags must be an array'),

    handleValidationErrors
];

export const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleValidationErrors
];

export const validateMessage = [
    body('content')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Message must be between 1 and 1000 characters'),

    body('receiverId')
        .isMongoId()
        .withMessage('Invalid receiver ID'),

    handleValidationErrors
];

export const validateMatchRequest = [
    body('targetUserId')
        .isMongoId()
        .withMessage('Invalid target user ID'),

    body('message')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Message must not exceed 500 characters'),

    handleValidationErrors
]; 