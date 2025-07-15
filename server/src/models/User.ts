import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserPreferences } from '../../../shared/types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
    _id: Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userPreferencesSchema = new Schema<UserPreferences>({
    interests: {
        type: [String],
        default: []
    },
    communicationStyle: {
        type: String,
        enum: ['casual', 'formal', 'friendly', 'professional'],
        default: 'friendly'
    },
    relationshipGoals: {
        type: String,
        enum: ['friendship', 'romance', 'networking', 'casual'],
        default: 'friendship'
    },
    ageRange: {
        min: {
            type: Number,
            default: 18
        },
        max: {
            type: Number,
            default: 100
        }
    },
    heightRange: {
        min: {
            type: Number,
            default: 150
        },
        max: {
            type: Number,
            default: 200
        }
    }
});

const userSchema = new Schema<IUserDocument>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true
    },
    height: {
        type: Number,
        required: [true, 'Height is required'],
        min: [100, 'Height must be at least 100cm'],
        max: [250, 'Height cannot exceed 250cm']
    },
    preferences: {
        type: userPreferencesSchema,
        default: () => ({})
    },
    personalityTags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(12);
        if (typeof this.password === 'string') {
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ country: 1 });
userSchema.index({ 'preferences.interests': 1 });
userSchema.index({ personalityTags: 1 });

export const User = mongoose.model<IUserDocument>('User', userSchema); 