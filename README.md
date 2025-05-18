# Juris.AI - AI-Powered Legal Assistant (1.3 Beta)

A cutting-edge legal assistant that combines multiple AI models with an intuitive interface to deliver comprehensive legal insights, case analysis, and strategic recommendations.

## 🚀 Features

### 🤖 AI-Powered Insights
- **Multi-Model Analysis**: Compare legal perspectives from GPT-4, Claude, Gemini, and Mistral
- **Smart Comparison**: Side-by-side model outputs with visual highlighting of key differences
- **Case Law Database**: Access to relevant case studies and legal precedents
- **Win Probability**: AI-powered case outcome predictions with confidence scoring
- **Jurisdiction-Aware**: Contextual advice based on selected legal jurisdiction

### 🎨 Enhanced UI/UX
- **Modern, Clean Interface**: Redesigned with a focus on clarity and ease of use
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Interactive Elements**: Hover states, loading animations, and smooth transitions
- **Dark/Light Mode**: Automatic theme switching with system preference detection
- **Keyboard Navigation**: Full keyboard accessibility and shortcuts
- **Loading States**: Improved visual feedback during AI processing

### ⚡ Productivity Tools
- **Chat Interface**: Natural language interaction with AI legal assistants
- **Document Analysis**: Upload and analyze legal documents (PDF, DOCX)
- **Citation Generator**: Automatically format legal citations
- **Search Functionality**: Quick access to previous queries and results
- **Export Options**: Save or share analysis in multiple formats (PDF, DOCX, TXT)

## 🛠 Tech Stack

### 💻 Core Technologies
- **<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original-wordmark.svg" width="16" height="16" alt="Next.js"> Next.js 14** - React framework with App Router and Server Components
- **<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="16" height="16" alt="TypeScript"> TypeScript** - Type-safe JavaScript for better developer experience
- **<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg" width="16" height="16" alt="Tailwind CSS"> Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **<img src="https://ui.shadcn.com/favicon.ico" width="16" height="16" alt="ShadCN"> ShadCN/UI** - Beautifully designed, accessible components
- **<img src="https://www.framer.com/favicon.ico" width="16" height="16" alt="Framer Motion"> Framer Motion** - Smooth animations and transitions

### 🧠 AI & Backend
- **<img src="https://openai.com/favicon.ico" width="16" height="16" alt="OpenAI"> OpenAI API** - GPT-4 for advanced natural language understanding
- **<img src="https://www.anthropic.com/favicon.ico" width="16" height="16" alt="Anthropic"> Anthropic Claude** - Alternative AI perspective for legal analysis
- **<img src="https://www.gstatic.com/lamda/images/favicon_v1_150160cddffa5e56.png" width="16" height="16" alt="Google Gemini"> Google Gemini** - Multimodal AI capabilities
- **<img src="https://mistral.ai/favicon.ico" width="16" height="16" alt="Mistral"> Mistral** - Open-weight model for comparison
- **<img src="https://vercel.com/favicon.ico" width="16" height="16" alt="Vercel"> Vercel AI SDK** - Streamlined AI integration

### 🔧 Development Tools
- **<img src="https://eslint.org/favicon.ico" width="16" height="16" alt="ESLint"> ESLint** & **<img src="https://prettier.io/favicon.ico" width="16" height="16" alt="Prettier"> Prettier** - Code quality and formatting
- **<img src="https://typicode.github.io/husky/logo.png" width="16" height="16" alt="Husky"> Husky** - Git hooks for pre-commit checks
- **<img src="https://commitizen-tools.github.io/commitizen/logo.png" width="16" height="16" alt="Commitizen"> Commitizen** - Consistent commit messages
- **<img src="https://jestjs.io/img/favicon/favicon.ico" width="16" height="16" alt="Jest"> Jest** & **<img src="https://testing-library.com/img/octopus-64x64.png" width="16" height="16" alt="Testing Library"> React Testing Library** - Comprehensive test coverage


## 🚀 Getting Started

### 📋 Prerequisites

- Node.js 18+ and npm

### ⚙️ Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/law-advisor.git
   cd law-advisor
   ```

2. Install dependencies
   ```bash
   npm install --legacy-peer-deps
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💡 Usage

1. Select your jurisdiction from the dropdown in the top-right corner
2. Enter your legal question or describe your situation in the text area
3. Click "Get Legal Advice" to analyze your query
4. View the results in the different tabs:
   - **Model Comparison**: Compare advice from different AI models
   - **Case Studies**: Review relevant legal precedents
   - **Win Estimation**: See the estimated probability of winning your case
   - **Documents**: (Coming soon) Access relevant legal documents

## 🎨 Design Philosophy

### 🎯 Core Design Principles

1. **Clarity First**
   - Clean, uncluttered interface that prioritizes content
   - Clear visual hierarchy with consistent spacing and typography
   - Intuitive navigation with predictable interactions

2. **Accessibility**
   - WCAG 2.1 AA compliant
   - Keyboard navigable interface
   - Sufficient color contrast and text sizing
   - Screen reader optimized components

3. **Responsive & Adaptive**
   - Mobile-first approach
   - Fluid layouts that adapt to any screen size
   - Optimized touch targets for mobile devices

### 🎨 Design System

#### 🎨 Color Palette
- **Primary**: `#2563EB` (Confident, trustworthy blue)
- **Secondary**: `#7C3AED` (Creative purple)
- **Accent**: `#F59E0B` (Attention-grabbing amber)
- **Success**: `#10B981` (Positive green)
- **Danger**: `#EF4444` (Warning red)
- **Neutrals**: Scale from `#F8FAFC` to `#0F172A`

#### ✍️ Typography
- **Headings**: `Inter` (600-700 weight)
- **Body**: `Inter` (400-500 weight)
- **Code/Mono**: `JetBrains Mono` (for legal citations and code)

#### 🧩 Components
- Built with ShadCN/UI for consistency
- Custom animations with Framer Motion
- Responsive design patterns
- Dark/light theme support

#### 🎬 Motion
- Subtle animations for state changes
- Meaningful transitions between views
- Performance-optimized animations
- Reduced motion preferences respected

### 📱 Page Designs

- **Landing Page**: Clean, professional layout with clear value proposition and CTA
- **Auth Pages**: Streamlined login/signup flow with social authentication options
- **Chat Interface**: Intuitive conversation design with AI response formatting
- **Profile Dashboard**: User-friendly profile management with settings and history
- **Legal Analysis**: Interactive displays for multi-model comparisons and case citations
- **Results Visualization**: Clear presentation of win probability with supporting evidence

## 📜 Version History

### 🚀 Current Version
- **1.3 (Beta)**
  - Complete UI/UX overhaul with modern design language
  - Enhanced chat interface with markdown support
  - Improved mobile responsiveness
  - Advanced theme customization options
  - Performance optimizations
  - Updated AI model integrations
  - Additional bug fixes and minor improvements

### ⏮️ Previous Versions
- **1.2 (Beta)**
  - Added document analysis features
  - Implemented citation generator
  - Enhanced search functionality
  - Improved accessibility features

- **1.1 (Beta)**
  - Initial public beta release
  - Multi-model AI analysis
  - Case law database integration
  - Win probability estimation
  - Jurisdiction-aware responses

- **1.0 (Alpha)**
  - Core chat functionality
  - Basic AI integration
  - Initial UI components
  - Theme system foundation

## Disclaimer

The information provided by Law Advisor is not a substitute for professional legal advice. Always consult with a qualified attorney for your specific legal needs.

## License

[MIT](LICENSE)
