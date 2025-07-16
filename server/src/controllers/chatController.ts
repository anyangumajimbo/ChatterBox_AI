import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { generateAIResponse, analyzeEmotionalTone } from '../config/ai';
import { IChatMessage, IAIChatRequest, ApiResponse } from '../shared/types';

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const { content, receiverId } = req.body;

        // Create user message
        const userMessage = new Message({
            senderId: userId,
            receiverId,
            content,
            messageType: 'text'
        });

        await userMessage.save();

        // Get conversation history for AI context
        const conversationHistory = await Message.find({
            $or: [
                { senderId: userId, receiverId },
                { senderId: receiverId, receiverId: userId }
            ]
        })
            .sort({ timestamp: 1 })
            .limit(20);

        // Convert to AI format
        const aiConversationHistory = conversationHistory.map(msg => ({
            role: (msg.senderId.toString() === userId ? 'user' : 'assistant') as 'user' | 'assistant',
            content: msg.content
        }));

        // Get user context for AI
        const user = await User.findById(userId);
        const userContext = {
            name: user?.name,
            interests: user?.preferences.interests,
            personalityTags: user?.personalityTags,
            country: user?.country
        };

        // Generate AI response
        const aiResponse = await generateAIResponse(content, aiConversationHistory, userContext);

        // Create AI message
        const aiMessage = new Message({
            senderId: receiverId, // AI user ID (you might want to create a special AI user)
            receiverId: userId,
            content: aiResponse,
            messageType: 'ai'
        });

        await aiMessage.save();

        // Analyze emotional tone
        const emotionalTone = await analyzeEmotionalTone(aiResponse);

        const response = {
            userMessage: {
                id: userMessage._id.toString(),
                content: userMessage.content,
                sender: 'user' as const,
                timestamp: userMessage.timestamp,
                messageType: userMessage.messageType
            },
            aiMessage: {
                id: aiMessage._id.toString(),
                content: aiMessage.content,
                sender: 'ai' as const,
                timestamp: aiMessage.timestamp,
                messageType: aiMessage.messageType,
                emotionalTone
            }
        };

        res.status(200).json({
            success: true,
            data: response,
            message: 'Message sent successfully'
        } as ApiResponse<typeof response>);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while sending message'
        } as ApiResponse<null>);
    }
};

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const { receiverId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId },
                { senderId: receiverId, receiverId: userId }
            ]
        })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('senderId', 'name')
            .populate('receiverId', 'name');

        const chatMessages: IChatMessage[] = messages.reverse().map(msg => ({
            id: msg._id.toString(),
            content: msg.content,
            sender: msg.senderId.toString() === userId ? 'user' : 'ai',
            timestamp: msg.timestamp,
            messageType: msg.messageType
        }));

        res.status(200).json({
            success: true,
            data: {
                messages: chatMessages,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: await Message.countDocuments({
                        $or: [
                            { senderId: userId, receiverId },
                            { senderId: receiverId, receiverId: userId }
                        ]
                    })
                }
            },
            message: 'Chat history retrieved successfully'
        } as ApiResponse<{ messages: IChatMessage[]; pagination: any }>);
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while retrieving chat history'
        } as ApiResponse<null>);
    }
};

export const markMessageAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const { messageId } = req.params;

        const message = await Message.findOneAndUpdate(
            {
                _id: messageId,
                receiverId: userId,
                isRead: false
            },
            { isRead: true },
            { new: true }
        );

        if (!message) {
            res.status(404).json({
                success: false,
                error: 'Message not found or already read'
            } as ApiResponse<null>);
            return;
        }

        res.status(200).json({
            success: true,
            data: message,
            message: 'Message marked as read'
        } as ApiResponse<any>);
    } catch (error) {
        console.error('Mark message as read error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while marking message as read'
        } as ApiResponse<null>);
    }
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;

        const unreadCount = await Message.countDocuments({
            receiverId: userId,
            isRead: false
        });

        res.status(200).json({
            success: true,
            data: { unreadCount },
            message: 'Unread count retrieved successfully'
        } as ApiResponse<{ unreadCount: number }>);
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while retrieving unread count'
        } as ApiResponse<null>);
    }
}; 