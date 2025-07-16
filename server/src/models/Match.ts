import mongoose, { Document, Schema, Types } from 'mongoose';
import { IMatch } from '../shared/types';

export interface IMatchDocument extends Omit<IMatch, '_id'>, Document {
    _id: Types.ObjectId;
}

const matchSchema = new Schema<IMatchDocument>({
    user1Id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2Id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    compatibilityScore: {
        type: Number,
        required: true,
        min: [0, 'Compatibility score cannot be negative'],
        max: [100, 'Compatibility score cannot exceed 100']
    },
    sharedInterests: {
        type: [String],
        default: []
    },
    matchDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Ensure unique matches between users
matchSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });
matchSchema.index({ status: 1 });
matchSchema.index({ compatibilityScore: -1 });
matchSchema.index({ matchDate: -1 });

// Virtual for getting the other user in a match
matchSchema.virtual('otherUser', {
    ref: 'User',
    localField: 'user2Id',
    foreignField: '_id',
    justOne: true
});

matchSchema.set('toJSON', { virtuals: true });

export const Match = mongoose.model<IMatchDocument>('Match', matchSchema); 