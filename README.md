# ChatterBox AI - AI-Powered Chatbot with Matchmaking

A full-stack AI-powered chatbot web application with matchmaking features built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with TypeScript.

## 🌟 Features

### AI Chatbot
- **Emotionally Intelligent AI**: Powered by OpenAI GPT-4 with custom prompt engineering
- **CHARM_GPT Personality**: Warm, empathetic, and context-aware conversations
- **Real-time Chat**: Message bubbles, typing indicators, and smooth animations
- **Conversation Memory**: Maintains context across chat sessions

### User Authentication & Profiles
- **Secure Registration/Login**: JWT-based authentication with bcrypt password hashing
- **Comprehensive Profiles**: Name, email, country, height, interests, and personality traits
- **Profile Management**: Edit preferences, interests, and personal information

### Smart Matchmaking
- **Compatibility Algorithm**: Multi-factor matching based on shared interests, location, and preferences
- **Match Discovery**: Find users with similar characteristics and goals
- **Match Requests**: Send and respond to match requests
- **Compatibility Scoring**: Percentage-based compatibility ratings

### Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Tailwind CSS**: Beautiful, modern styling with custom components
- **Real-time Feedback**: Toast notifications and loading states
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Tech Stack

### Backend
- **Node.js** with **Express.js** and **TypeScript**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **OpenAI API** for AI chat functionality
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **helmet** and **cors** for security

### Frontend
- **React.js** with **TypeScript**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API communication
- **React Hook Form** for form handling
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Development Tools
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code formatting
- **Nodemon** for development server
- **Concurrently** for running multiple processes

## 📁 Project Structure

```
ChatterBox_AI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand stores
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Database and AI configuration
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth and validation
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── shared/                 # Shared TypeScript types
│   └── types.ts
├── package.json            # Root package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ChatterBox_AI
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

#### Server Environment
Create `server/.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/chatterbox_ai

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

#### Client Environment
Create `client/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the Application

#### Development Mode
```bash
# From root directory
npm run dev
```

This will start both the server (port 5000) and client (port 3000) concurrently.

#### Production Mode
```bash
# Build the client
cd client
npm run build

# Start the server
cd ../server
npm start
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Chat
- `POST /api/chat/send` - Send message to AI
- `GET /api/chat/history/:receiverId` - Get chat history
- `PUT /api/chat/read/:messageId` - Mark message as read
- `GET /api/chat/unread-count` - Get unread message count

### Matchmaking
- `GET /api/match/find` - Find potential matches
- `POST /api/match/request` - Send match request
- `PUT /api/match/respond/:matchId` - Respond to match request
- `GET /api/match/my-matches` - Get user's matches

## 🎯 Key Features Explained

### AI Chatbot (CHARM_GPT)
The AI chatbot is designed with emotional intelligence and personality:

```typescript
// System prompt for emotionally intelligent chatbot
export const CHARM_GPT_SYSTEM_PROMPT = `You are CHARM_GPT, a charming, emotionally aware chatbot who listens attentively, replies with warmth and subtle wit, and engages people as if they are special and understood.

Your personality traits:
- Warm and empathetic: You genuinely care about the person you're talking to
- Attentive listener: You remember details from the conversation and reference them naturally
- Subtle wit: You have a gentle sense of humor that makes conversations enjoyable
- Emotionally intelligent: You can sense emotional undertones and respond appropriately
- Slightly persuasive: You gently encourage positive thinking and self-improvement
- Culturally aware: You respect and acknowledge different backgrounds and perspectives
`;
```

### Matchmaking Algorithm
The matchmaking system uses a multi-factor compatibility algorithm:

1. **Country Match** (30 points): Users from the same country
2. **Height Compatibility** (20 points): Height difference within acceptable range
3. **Shared Interests** (25 points): Common interests and hobbies
4. **Communication Style** (15 points): Similar communication preferences
5. **Relationship Goals** (10 points): Compatible relationship objectives

### Security Features
- JWT-based authentication with secure token storage
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration for security
- Helmet.js for security headers

## 🚀 Deployment

### Backend Deployment (Heroku/Netlify)
1. Set up MongoDB Atlas database
2. Configure environment variables
3. Deploy to your preferred platform

### Frontend Deployment (Vercel/Netlify)
1. Build the React application
2. Configure environment variables
3. Deploy to your preferred platform

## 🔮 Future Enhancements

- **Voice Interaction**: Speech-to-text and text-to-speech capabilities
- **Multimedia Messaging**: Image and file sharing
- **Video Chat**: Real-time video communication
- **Advanced Matching**: Machine learning-based compatibility scoring
- **Group Chats**: Multi-user conversations
- **Push Notifications**: Real-time message notifications
- **Analytics Dashboard**: User engagement and matching statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ using the MERN stack and TypeScript** 