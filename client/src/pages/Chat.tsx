import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { IChatMessage } from '../shared/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Chat: React.FC = () => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages, isLoading, error, sendMessage, loadChatHistory } = useChatStore();

    // AI user ID (replace with your actual AI bot ObjectId from the database)
    const AI_USER_ID = '68766140561e840133d6b7ef';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Load chat history when component mounts
        loadChatHistory(AI_USER_ID).catch(console.error);
    }, [loadChatHistory]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const trimmedMessage = message.trim();
        setMessage('');
        setIsTyping(true);

        try {
            await sendMessage(trimmedMessage, AI_USER_ID);
            toast.success('Message sent!');
        } catch (error) {
            toast.error('Failed to send message');
            console.error('Send message error:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const formatTime = (timestamp: Date) => {
        return format(new Date(timestamp), 'HH:mm');
    };

    const renderMessage = (msg: IChatMessage) => {
        const isUser = msg.sender === 'user';

        return (
            <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
                <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
                    {!isUser && (
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot size={16} className="text-white" />
                        </div>
                    )}
                    <div className={`message-bubble ${isUser ? 'message-user' : 'message-ai'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isUser ? 'text-primary-100' : 'text-gray-500'}`}>
                            {formatTime(msg.timestamp)}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                </div>
                <div className="ml-3">
                    <h2 className="text-lg font-semibold text-gray-900">CHARM_GPT</h2>
                    <p className="text-sm text-gray-500">Your AI companion</p>
                </div>
                <div className="ml-auto">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-500">Online</span>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && !isLoading && (
                    <div className="text-center py-8">
                        <Bot size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to ChatterBox AI!</h3>
                        <p className="text-gray-500">
                            I'm CHARM_GPT, your emotionally intelligent AI companion.
                            Let's start a conversation!
                        </p>
                    </div>
                )}

                {messages.map((msg: IChatMessage) => renderMessage(msg))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start mb-4">
                        <div className="flex items-end space-x-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div className="message-ai">
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 input"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!message.trim() || isLoading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat; 