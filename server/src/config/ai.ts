import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';

// System prompt for emotionally intelligent chatbot
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
        // Build context-aware system prompt
        let systemPrompt = CHARM_GPT_SYSTEM_PROMPT;

        if (userContext) {
            systemPrompt += `\n\nUser Context:
- Name: ${userContext.name || 'Friend'}
- Country: ${userContext.country || 'Unknown'}
- Interests: ${userContext.interests?.join(', ') || 'Not specified'}
- Personality: ${userContext.personalityTags?.join(', ') || 'Not specified'}

Use this context to personalize your responses and make the conversation more meaningful.`;
        }

        const messages = [
            { role: 'system' as const, content: systemPrompt },
            ...conversationHistory.slice(-10), // Keep last 10 messages for context
            { role: 'user' as const, content: userMessage }
        ];

        const completion = await openai.chat.completions.create({
            model: AI_MODEL,
            messages,
            max_tokens: 300,
            temperature: 0.8,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
        });

        return completion.choices[0]?.message?.content || 'I apologize, but I seem to be having trouble responding right now. Could you try again?';
    } catch (error) {
        console.error('OpenAI API error:', error);
        return 'I apologize, but I\'m experiencing some technical difficulties. Please try again in a moment.';
    }
};

export const analyzeEmotionalTone = async (message: string): Promise<'happy' | 'sad' | 'excited' | 'calm' | 'neutral'> => {
    try {
        const completion = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'Analyze the emotional tone of the following message and respond with only one word: happy, sad, excited, calm, or neutral.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 10,
            temperature: 0.3,
        });

        const tone = completion.choices[0]?.message?.content?.toLowerCase().trim();

        if (tone && ['happy', 'sad', 'excited', 'calm', 'neutral'].includes(tone)) {
            return tone as 'happy' | 'sad' | 'excited' | 'calm' | 'neutral';
        }

        return 'neutral';
    } catch (error) {
        console.error('Emotional tone analysis error:', error);
        return 'neutral';
    }
}; 