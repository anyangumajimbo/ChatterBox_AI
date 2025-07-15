import { create } from 'zustand';
import { MatchState } from '../shared/types';
import apiService from '../services/api';

interface MatchStore extends MatchState {
    findMatches: (limit?: number) => Promise<void>;
    sendMatchRequest: (targetUserId: string, message?: string) => Promise<void>;
    respondToMatch: (matchId: string, status: 'accepted' | 'rejected') => Promise<void>;
    getMyMatches: (status?: string) => Promise<void>;
    clearMatches: () => void;
    clearError: () => void;
}

export const useMatchStore = create<MatchStore>((set, get) => ({
    matches: [],
    isLoading: false,
    error: null,

    findMatches: async (limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const matches = await apiService.findMatches(limit);
            set({
                matches,
                isLoading: false,
                error: null
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.error || 'Failed to find matches'
            });
            throw error;
        }
    },

    sendMatchRequest: async (targetUserId: string, message?: string) => {
        set({ isLoading: true, error: null });
        try {
            await apiService.sendMatchRequest(targetUserId, message);
            set({
                isLoading: false,
                error: null
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.error || 'Failed to send match request'
            });
            throw error;
        }
    },

    respondToMatch: async (matchId: string, status: 'accepted' | 'rejected') => {
        set({ isLoading: true, error: null });
        try {
            await apiService.respondToMatch(matchId, status);
            set({
                isLoading: false,
                error: null
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.error || 'Failed to respond to match'
            });
            throw error;
        }
    },

    getMyMatches: async (status?: string) => {
        set({ isLoading: true, error: null });
        try {
            const matches = await apiService.getMyMatches(status);
            set({
                matches: matches.map((match: any) => ({
                    user: match.user1Id || match.user2Id,
                    compatibilityScore: match.compatibilityScore,
                    sharedInterests: match.sharedInterests,
                    matchReasons: [],
                    status: match.status
                })),
                isLoading: false,
                error: null
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.error || 'Failed to get matches'
            });
            throw error;
        }
    },

    clearMatches: () => {
        set({ matches: [] });
    },

    clearError: () => {
        set({ error: null });
    }
})); 