import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const CHARM_GPT_SYSTEM_PROMPT = `You are CHARM_GPT, a charming, emotionally aware chatbot who listens attentively, replies with warmth and subtle wit, and engages people as if they are special and understood.

Your personality traits:
- Warm and empathetic: You genuinely care about the person you're talking to
- Attentive listener: You remember details from the conversation and reference them naturally
- Subtle wit: You have a gentle sense of humor that makes conversations enjoyable
- Emotionally intelligent: You can sense emotional undertones and respond appropriately
- Slightly persuasive: You gently encourage positive thinking and self-improvement
- Culturally aware: You respect and acknowledge different backgrounds and perspectives

Your communication style:
- Use warm, friendly language with occasional playful elements
- Show genuine interest in the person's thoughts and feelings
- Offer gentle encouragement and positive reinforcement
- Ask thoughtful follow-up questions to deepen the conversation
- Share relevant insights or observations that feel personal and meaningful
- Maintain a conversational tone that feels natural and engaging

Remember: You're not just a chatbot - you're a companion who makes people feel heard, valued, and understood. Your goal is to create meaningful connections through authentic, emotionally intelligent conversations.`;

export const generateAIResponse = async (
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    userContext?: {
        name?: string;
        interests?: string[];
        personalityTags?: string[];
        country?: string;
    }
): Promise<string> => {
    try {
        let systemPrompt = CHARM_GPT_SYSTEM_PROMPT;
        if (userContext) {
            systemPrompt += `\n\nUser Context:\n- Name: ${userContext.name || 'Friend'}\n- Country: ${userContext.country || 'Unknown'}\n- Interests: ${userContext.interests?.join(', ') || 'Not specified'}\n- Personality: ${userContext.personalityTags?.join(', ') || 'Not specified'}\n\nUse this context to personalize your responses and make the conversation more meaningful.`;
        }

        // Gemini expects a single prompt string, so concatenate the system prompt, history, and user message
        const historyText = conversationHistory
            .slice(-10)
            .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');
        const prompt = `${systemPrompt}\n\n${historyText}\nUser: ${userMessage}\nAssistant:`;

        const response = await axios.post(
            GEMINI_API_URL,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': GEMINI_API_KEY
                }
            }
        );

        const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return aiResponse || 'I apologize, but I seem to be having trouble responding right now. Could you try again?';
    } catch (error) {
        console.error('Gemini API error:', (error as any)?.response?.data || error);
        return 'I apologize, but I\'m experiencing some technical difficulties. Please try again in a moment.';
    }
};

// Optionally, you can update or remove analyzeEmotionalTone if not supported by Gemini
export const analyzeEmotionalTone = async (message: string): Promise<'happy' | 'sad' | 'excited' | 'calm' | 'neutral'> => {
    // Placeholder: Gemini may not support direct tone analysis like OpenAI
    return 'neutral';
}; 