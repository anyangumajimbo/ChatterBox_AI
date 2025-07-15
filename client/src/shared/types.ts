// User-related types
export interface IUser {
    _id?: string; // Use string for _id in frontend
    name: string;
    email: string;
    password?: string; // Make password optional for delete operator
    country: string;
    height: number;
    preferences: UserPreferences;
    personalityTags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface UserPreferences {
    interests: string[];
    communicationStyle: 'casual' | 'formal' | 'friendly' | 'professional';
    relationshipGoals: 'friendship' | 'romance' | 'networking' | 'casual';
    ageRange: {
        min: number;
        max: number;
    };
    heightRange: {
        min: number;
        max: number;
    };
}

export interface IUserRegistration {
    name: string;
    email: string;
    password: string;
    country: string;
    height: number;
    preferences: UserPreferences;
    personalityTags: string[];
}

export interface IUserLogin {
    email: string;
    password: string;
}

// Message-related types
export interface IMessage {
    _id?: string;
    senderId: string;
    receiverId: string;
    content: string;
    messageType: 'text' | 'ai' | 'system';
    timestamp: Date;
    isRead: boolean;
}

export interface IChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    messageType: 'text' | 'ai' | 'system';
}

// Match-related types
export interface IMatch {
    _id?: string;
    user1Id: string;
    user2Id: string;
    compatibilityScore: number;
    sharedInterests: string[];
    matchDate: Date;
    status: 'pending' | 'accepted' | 'rejected';
}

export interface IMatchRequest {
    targetUserId: string;
    message?: string;
}

// AI Chat types
export interface IAIChatRequest {
    message: string;
    userId: string;
    conversationHistory: IChatMessage[];
}

export interface IAIChatResponse {
    message: string;
    emotionalTone: 'happy' | 'sad' | 'excited' | 'calm' | 'neutral';
    suggestedActions?: string[];
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface AuthResponse {
    user: Omit<IUser, 'password'>;
    token: string;
}

// Matchmaking types
export interface IMatchCriteria {
    country?: string;
    heightRange?: {
        min: number;
        max: number;
    };
    interests?: string[];
    personalityTags?: string[];
    communicationStyle?: string;
    relationshipGoals?: string;
}

export interface IMatchResult {
    user: Omit<IUser, 'password'>;
    compatibilityScore: number;
    sharedInterests: string[];
    matchReasons: string[];
}

// Frontend specific types
export interface ChatState {
    messages: IChatMessage[];
    isLoading: boolean;
    error: string | null;
}

export interface UserState {
    user: Omit<IUser, 'password'> | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface MatchState {
    matches: IMatchResult[];
    isLoading: boolean;
    error: string | null;
}

// Form types
export interface RegistrationFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    country: string;
    height: number;
    interests: string[];
    communicationStyle: string;
    relationshipGoals: string;
    personalityTags: string[];
    ageRange: {
        min: number;
        max: number;
    };
    heightRange: {
        min: number;
        max: number;
    };
}

export interface LoginFormData {
    email: string;
    password: string;
} 