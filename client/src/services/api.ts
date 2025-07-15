import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
    AuthResponse,
    ApiResponse,
    IChatMessage,
    IMatchResult,
    IUserRegistration,
    IUserLogin,
    RegistrationFormData,
    LoginFormData
} from '../shared/types';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor to handle errors
        this.api.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async register(userData: RegistrationFormData): Promise<AuthResponse> {
        const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
        return response.data.data!;
    }

    async login(credentials: LoginFormData): Promise<AuthResponse> {
        const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        return response.data.data!;
    }

    async getProfile(): Promise<any> {
        const response = await this.api.get<ApiResponse<any>>('/auth/profile');
        return response.data.data!;
    }

    async updateProfile(profileData: Partial<any>): Promise<any> {
        const response = await this.api.put<ApiResponse<any>>('/auth/profile', profileData);
        return response.data.data!;
    }

    // Chat endpoints
    async sendMessage(content: string, receiverId: string): Promise<any> {
        const response = await this.api.post<ApiResponse<any>>('/chat/send', {
            content,
            receiverId
        });
        return response.data.data!;
    }

    async getChatHistory(receiverId: string, page = 1, limit = 50): Promise<{
        messages: IChatMessage[];
        pagination: any;
    }> {
        const response = await this.api.get<ApiResponse<{
            messages: IChatMessage[];
            pagination: any;
        }>>(`/chat/history/${receiverId}?page=${page}&limit=${limit}`);
        return response.data.data!;
    }

    async markMessageAsRead(messageId: string): Promise<any> {
        const response = await this.api.put<ApiResponse<any>>(`/chat/read/${messageId}`);
        return response.data.data!;
    }

    async getUnreadCount(): Promise<{ unreadCount: number }> {
        const response = await this.api.get<ApiResponse<{ unreadCount: number }>>('/chat/unread-count');
        return response.data.data!;
    }

    // Match endpoints
    async findMatches(limit = 10): Promise<IMatchResult[]> {
        const response = await this.api.get<ApiResponse<IMatchResult[]>>(`/match/find?limit=${limit}`);
        return response.data.data!;
    }

    async sendMatchRequest(targetUserId: string, message?: string): Promise<any> {
        const response = await this.api.post<ApiResponse<any>>('/match/request', {
            targetUserId,
            message
        });
        return response.data.data!;
    }

    async respondToMatch(matchId: string, status: 'accepted' | 'rejected'): Promise<any> {
        const response = await this.api.put<ApiResponse<any>>(`/match/respond/${matchId}`, {
            status
        });
        return response.data.data!;
    }

    async getMyMatches(status?: string): Promise<any[]> {
        const url = status ? `/match/my-matches?status=${status}` : '/match/my-matches';
        const response = await this.api.get<ApiResponse<any[]>>(url);
        return response.data.data!;
    }

    // Health check
    async healthCheck(): Promise<any> {
        const response = await this.api.get('/health');
        return response.data;
    }
}

export const apiService = new ApiService();
export default apiService; 