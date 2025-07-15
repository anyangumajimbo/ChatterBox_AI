import mongoose, { Document, Schema, Types } from 'mongoose';
import { IMessage } from '../../../shared/types';

export interface IMessageDocument extends Omit<IMessage, '_id'>, Document {
    _id: Types.ObjectId;
}

const messageSchema = new Schema<IMessageDocument>({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Message content is required'],
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    messageType: {
        type: String,
        enum: ['text', 'ai', 'system'],
        default: 'text'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ timestamp: -1 });
messageSchema.index({ isRead: 1 });

// Virtual for conversation ID (for grouping messages between two users)
messageSchema.virtual('conversationId').get(function () {
    const ids = [this.get('senderId').toString(), this.get('receiverId').toString()].sort();
    return `${ids[0]}-${ids[1]}`;
});

messageSchema.set('toJSON', { virtuals: true });

export const Message = mongoose.model<IMessageDocument>('Message', messageSchema); 