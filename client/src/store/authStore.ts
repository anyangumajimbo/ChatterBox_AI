import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState } from '../shared/types';
import apiService from '../services/api';

interface AuthStore extends UserState {
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    updateProfile: (profileData: any) => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await apiService.login({ email, password });
                    localStorage.setItem('token', response.token);
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.response?.data?.error || 'Login failed'
                    });
                    throw error;
                }
            },

            register: async (userData: any) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await apiService.register(userData);
                    localStorage.setItem('token', response.token);
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.response?.data?.error || 'Registration failed'
                    });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                });
            },

            updateProfile: async (profileData: any) => {
                set({ isLoading: true, error: null });
                try {
                    const updatedUser = await apiService.updateProfile(profileData);
                    set({
                        user: updatedUser,
                        isLoading: false,
                        error: null
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.response?.data?.error || 'Profile update failed'
                    });
                    throw error;
                }
            },

            clearError: () => {
                set({ error: null });
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
); 