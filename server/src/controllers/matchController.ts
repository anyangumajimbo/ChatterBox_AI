import { Request, Response } from 'express';
import { User } from '../models/User';
import { Match } from '../models/Match';
import { IMatchCriteria, IMatchResult, ApiResponse } from '../../../shared/types';

// Calculate compatibility score between two users
const calculateCompatibilityScore = (user1: any, user2: any): number => {
    let score = 0;
    let totalFactors = 0;

    // Country match (30 points)
    if (user1.country === user2.country) {
        score += 30;
    }
    totalFactors += 30;

    // Height compatibility (20 points)
    const heightDiff = Math.abs(user1.height - user2.height);
    if (heightDiff <= 10) {
        score += 20;
    } else if (heightDiff <= 20) {
        score += 15;
    } else if (heightDiff <= 30) {
        score += 10;
    }
    totalFactors += 20;

    // Shared interests (25 points)
    const sharedInterests = user1.preferences.interests.filter((interest: string) =>
        user2.preferences.interests.includes(interest)
    );
    const interestScore = Math.min(25, (sharedInterests.length / Math.max(user1.preferences.interests.length, 1)) * 25);
    score += interestScore;
    totalFactors += 25;

    // Communication style compatibility (15 points)
    if (user1.preferences.communicationStyle === user2.preferences.communicationStyle) {
        score += 15;
    } else if (
        (user1.preferences.communicationStyle === 'friendly' && user2.preferences.communicationStyle === 'casual') ||
        (user1.preferences.communicationStyle === 'casual' && user2.preferences.communicationStyle === 'friendly')
    ) {
        score += 10;
    }
    totalFactors += 15;

    // Relationship goals compatibility (10 points)
    if (user1.preferences.relationshipGoals === user2.preferences.relationshipGoals) {
        score += 10;
    }
    totalFactors += 10;

    return Math.round((score / totalFactors) * 100);
};

// Get shared interests between two users
const getSharedInterests = (user1: any, user2: any): string[] => {
    return user1.preferences.interests.filter((interest: string) =>
        user2.preferences.interests.includes(interest)
    );
};

// Generate match reasons
const generateMatchReasons = (user1: any, user2: any, sharedInterests: string[]): string[] => {
    const reasons = [];

    if (user1.country === user2.country) {
        reasons.push(`Both from ${user1.country}`);
    }

    if (sharedInterests.length > 0) {
        reasons.push(`Shared interests: ${sharedInterests.slice(0, 3).join(', ')}`);
    }

    if (user1.preferences.communicationStyle === user2.preferences.communicationStyle) {
        reasons.push(`Similar communication style: ${user1.preferences.communicationStyle}`);
    }

    if (user1.preferences.relationshipGoals === user2.preferences.relationshipGoals) {
        reasons.push(`Same relationship goals: ${user1.preferences.relationshipGoals}`);
    }

    return reasons;
};

export const findMatches = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const { limit = 10 } = req.query;

        // Get current user
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            } as ApiResponse<null>);
            return;
        }

        // Build match criteria
        const matchCriteria: any = {
            _id: { $ne: userId } // Exclude current user
        };

        // Country preference
        if (currentUser.preferences.heightRange) {
            matchCriteria.height = {
                $gte: currentUser.preferences.heightRange.min,
                $lte: currentUser.preferences.heightRange.max
            };
        }

        // Find potential matches
        const potentialMatches = await User.find(matchCriteria)
            .limit(Number(limit) * 2) // Get more to filter
            .select('-password');

        // Calculate compatibility scores and filter
        const matchesWithScores: IMatchResult[] = potentialMatches
            .map(potentialMatch => {
                const compatibilityScore = calculateCompatibilityScore(currentUser, potentialMatch);
                const sharedInterests = getSharedInterests(currentUser, potentialMatch);
                const matchReasons = generateMatchReasons(currentUser, potentialMatch, sharedInterests);

                return {
                    user: {
                        _id: potentialMatch._id,
                        name: potentialMatch.name,
                        email: potentialMatch.email,
                        country: potentialMatch.country,
                        height: potentialMatch.height,
                        preferences: potentialMatch.preferences,
                        personalityTags: potentialMatch.personalityTags,
                        createdAt: potentialMatch.createdAt,
                        updatedAt: potentialMatch.updatedAt
                    },
                    compatibilityScore,
                    sharedInterests,
                    matchReasons
                };
            })
            .filter(match => match.compatibilityScore >= 50) // Only show matches with 50%+ compatibility
            .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
            .slice(0, Number(limit));

        res.status(200).json({
            success: true,
            data: matchesWithScores,
            message: 'Matches found successfully'
        } as ApiResponse<IMatchResult[]>);
    } catch (error) {
        console.error('Find matches error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while finding matches'
        } as ApiResponse<null>);
    }
};

export const sendMatchRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const { targetUserId, message } = req.body;

        // Check if match already exists
        const existingMatch = await Match.findOne({
            $or: [
                { user1Id: userId, user2Id: targetUserId },
                { user1Id: targetUserId, user2Id: userId }
            ]
        });

        if (existingMatch) {
            res.status(400).json({
                success: false,
                error: 'Match request already exists'
            } as ApiResponse<null>);
            return;
        }

        // Get both users for compatibility calculation
        const [currentUser, targetUser] = await Promise.all([
            User.findById(userId),
            User.findById(targetUserId)
        ]);

        if (!currentUser || !targetUser) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            } as ApiResponse<null>);
            return;
        }

        const compatibilityScore = calculateCompatibilityScore(currentUser, targetUser);
        const sharedInterests = getSharedInterests(currentUser, targetUser);

        // Create match
        const match = new Match({
            user1Id: userId,
            user2Id: targetUserId,
            compatibilityScore,
            sharedInterests,
            status: 'pending'
        });

        await match.save();

        res.status(201).json({
            success: true,
            data: match,
            message: 'Match request sent successfully'
        } as ApiResponse<any>);
    } catch (error) {
        console.error('Send match request error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while sending match request'
        } as ApiResponse<null>);
    }
};

export const respondToMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const { matchId } = req.params;
        const { status } = req.body; // 'accepted' or 'rejected'

        const match = await Match.findOne({
            _id: matchId,
            user2Id: userId, // Only the recipient can respond
            status: 'pending'
        });

        if (!match) {
            res.status(404).json({
                success: false,
                error: 'Match request not found'
            } as ApiResponse<null>);
            return;
        }

        match.status = status;
        await match.save();

        res.status(200).json({
            success: true,
            data: match,
            message: `Match ${status} successfully`
        } as ApiResponse<any>);
    } catch (error) {
        console.error('Respond to match error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while responding to match'
        } as ApiResponse<null>);
    }
};

export const getMyMatches = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const { status } = req.query;

        const query: any = {
            $or: [
                { user1Id: userId },
                { user2Id: userId }
            ]
        };

        if (status) {
            query.status = status;
        }

        const matches = await Match.find(query)
            .populate('user1Id', 'name email country height preferences personalityTags')
            .populate('user2Id', 'name email country height preferences personalityTags')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: matches,
            message: 'Matches retrieved successfully'
        } as ApiResponse<any>);
    } catch (error) {
        console.error('Get my matches error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while retrieving matches'
        } as ApiResponse<null>);
    }
}; 