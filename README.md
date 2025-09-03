# Juris.AI v2.1 🚀

A cutting-edge AI-powered legal assistance platform built with Next.js, providing intelligent legal research, analysis, and conversation management capabilities.

🌐 **Live Demo**: [https://jurisailawyer.netlify.app/](https://jurisailawyer.netlify.app/)

## ✨ What's New in v2.1

### 🎨 **Enhanced Chat Interface**
- **Modern Message Bubbles**: Beautiful gradient-styled message bubbles with user/AI avatars
- **Enhanced Input Area**: Professional input field with character count and keyboard shortcuts
- **Read More Functionality**: Expandable messages for long responses with smooth animations
- **Improved Typography**: Better text rendering and spacing for enhanced readability

### 🔄 **Regenerate Response Feature**
- **One-Click Regeneration**: Regenerate AI responses when unsatisfied with the answer
- **Visual Feedback**: Loading animations and status indicators during regeneration
- **Context Preservation**: Maintains conversation flow and settings during regeneration
- **Error Handling**: Graceful fallback for failed regeneration attempts

### 📚 **Advanced Chat History Management**
- **Continue Conversations**: Resume any previous conversation with a single click
- **Delete Sessions**: Remove unwanted chat sessions with confirmation dialogs
- **Enhanced Organization**: Messages grouped by date with message counts
- **Professional UI**: Modern cards with action buttons and hover effects

### 🎯 **User Experience Improvements**
- **Responsive Design**: Optimized for all device sizes (mobile, tablet, desktop)
- **Accessibility**: Full keyboard navigation and screen reader support
- **Loading States**: Professional loading animations and progress indicators
- **Error Recovery**: Robust error handling with user-friendly messages

## 🚀 Features

### 🤖 **AI-Powered Legal Research**
- **Multi-Model Support**: Choose between Gemini and Mistral AI for varied perspectives
- **Legal Mode**: Specialized legal analysis with jurisdiction-specific insights
- **Smart Responses**: Context-aware responses with legal citations and references
- **Real-time Processing**: Instant AI responses with typing indicators

### 💬 **Advanced Chat System**
- **Message Actions**: Copy, regenerate, like/dislike, and reaction system
- **Conversation Threading**: Maintain context across multiple exchanges
- **Session Management**: Continue previous conversations seamlessly
- **History Search**: Easy access to past legal discussions

### 🔐 **Security & Authentication**
- **Secure Login**: Supabase-powered authentication system
- **User Profiles**: Personalized experience with user preferences
- **Data Privacy**: Secure storage of conversations and user data
- **API Key Management**: User-controlled AI service configurations

### 📱 **Modern Interface**
- **Dark/Light Mode**: Automatic theme switching with system preference
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Professional Design**: Clean, modern interface suitable for legal professionals
- **Smooth Animations**: Framer Motion powered transitions and interactions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components, Framer Motion
- **Backend**: Supabase (Database, Authentication, Real-time)
- **AI Integration**: Google Gemini Pro, Mistral AI
- **UI Components**: Radix UI primitives with custom styling
- **Deployment**: Netlify with automatic deployments

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- AI API keys (Gemini, Mistral)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/juris-ai.git
cd juris-ai
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### 🎯 **Getting Started**
1. **Sign Up/Login**: Create an account or login to access the platform
2. **Explore Demo**: Check out the chat demo at `/chat-demo` to see the interface
3. **Start Chatting**: Use the main chat interface at `/chat` for legal assistance

### 💬 **Using the Chat Interface**
1. **Ask Questions**: Type your legal questions in the enhanced input area
2. **Choose AI Model**: Select between Gemini or Mistral for different perspectives
3. **Enable Legal Mode**: Get specialized legal analysis with case law references
4. **Manage Responses**: Use regenerate, copy, and reaction features
5. **Continue Conversations**: Resume previous discussions from chat history

### 📚 **Managing Chat History**
1. **View History**: Access all your conversations at `/chat/history`
2. **Continue Chats**: Click "Continue Chat" to resume any conversation
3. **Delete Sessions**: Remove unwanted conversations with confirmation
4. **Organize**: Messages are automatically grouped by date

## 🎨 UI Components

### 🔧 **Enhanced Components**
- **MessageBubble**: Modern message display with actions and animations
- **EnhancedChatInput**: Professional input area with features
- **WelcomeScreen**: Engaging welcome interface for new users
- **AlertDialog**: Professional confirmation dialogs

### 🎭 **Design System**
- **Consistent Theming**: Unified color scheme and typography
- **Responsive Breakpoints**: Mobile-first responsive design
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance**: Optimized animations and lazy loading

## 🔧 API Integration

### 🤖 **AI Services**
- **Gemini Pro**: Google's advanced language model
- **Mistral AI**: Open-source AI with strong reasoning capabilities
- **Legal Service**: Specialized legal analysis with case law integration
- **Error Handling**: Robust fallback mechanisms

### 💾 **Database Schema**
- **Users**: Authentication and profile management
- **Chat Messages**: Conversation storage with metadata
- **User Preferences**: Customizable settings and API keys
- **Session Management**: Conversation threading and history

## 🚀 Deployment

### 🌐 **Live Deployment**
The application is deployed on Netlify with automatic deployments from the main branch.

**Live URL**: [https://jurisailawyer.netlify.app/](https://jurisailawyer.netlify.app/)

### 📦 **Build Process**
```bash
npm run build
npm run start
```

### 🔄 **CI/CD Pipeline**
- Automatic deployments on push to main branch
- Build optimization and static generation
- Environment variable management
- Performance monitoring

## 📊 Performance

### ⚡ **Optimizations**
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Bundle Analysis**: Optimized bundle size and tree shaking
- **Caching**: Efficient caching strategies for API calls

### 📈 **Metrics**
- **Lighthouse Score**: 95+ performance score
- **Core Web Vitals**: Excellent LCP, FID, and CLS scores
- **Bundle Size**: Optimized for fast loading
- **Accessibility**: 100% accessibility score

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### 📋 **Development Guidelines**
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Update documentation for API changes
- Follow semantic versioning for releases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Email**: ititsaddy7@gmail.com
- **Website**: [https://jurisailawyer.netlify.app/](https://jurisailawyer.netlify.app/)
- **GitHub**: [https://github.com/yourusername/juris-ai](https://github.com/yourusername/juris-ai)
- **Issues**: Report bugs and request features via GitHub Issues

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Supabase**: For the backend infrastructure
- **Tailwind CSS**: For the utility-first CSS framework
- **shadcn/ui**: For the beautiful UI components
- **Framer Motion**: For smooth animations
- **AI Providers**: Google Gemini and Mistral AI for powerful language models

---

**Built with ❤️ for the legal community**
