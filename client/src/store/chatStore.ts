import { create } from 'zustand';
import { ChatState, IChatMessage } from '../shared/types';
import apiService from '../services/api';

interface ChatStore extends ChatState {
    sendMessage: (content: string, receiverId: string) => Promise<void>;
    loadChatHistory: (receiverId: string) => Promise<void>;
    addMessage: (message: IChatMessage) => void;
    clearMessages: () => void;
    clearError: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    isLoading: false,
    error: null,

    sendMessage: async (content: string, receiverId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiService.sendMessage(content, receiverId);

            // Add both user and AI messages to the chat
            set(state => ({
                messages: [...state.messages, response.userMessage, response.aiMessage],
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.error || 'Failed to send message'
            });
            throw error;
        }
    },

    loadChatHistory: async (receiverId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiService.getChatHistory(receiverId);
            set({
                messages: response.messages,
                isLoading: false,
                error: null
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.error || 'Failed to load chat history'
            });
            throw error;
        }
    },

    addMessage: (message: IChatMessage) => {
        set(state => ({
            messages: [...state.messages, message]
        }));
    },

    clearMessages: () => {
        set({ messages: [] });
    },

    clearError: () => {
        set({ error: null });
    }
})); 