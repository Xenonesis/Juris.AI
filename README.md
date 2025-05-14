# Law Advisor - AI-Powered Legal Assistant (Beta 0.2)

A modern, user-friendly application that leverages multiple AI models to provide comprehensive legal advice, case studies, and win probability estimations.

## Features

- **Multiple AI Model Analysis**: Compares legal advice from GPT-4, Claude, Gemini, and Mistral
- **Model Comparison**: Toggle between different AI models' outputs to get diverse perspectives
- **Case Studies**: Displays relevant legal case studies based on your query
- **Win Estimation**: Estimates the probability of winning a case using AI analysis
- **Jurisdiction Selection**: Localizes legal advice based on selected jurisdiction
- **Modern UI**: Built with Tailwind CSS and ShadCN UI for a responsive, mobile-first design
- **Dark Mode Support**: Easily switch between light and dark themes

## Tech Stack

- **Frontend**: Next.js 15.3
- **UI Framework**: Tailwind CSS 4
- **Component Library**: ShadCN UI
- **AI Integration**: Ready for OpenAI, Anthropic, Google AI, and Mistral

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

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

## Usage

1. Select your jurisdiction from the dropdown in the top-right corner
2. Enter your legal question or describe your situation in the text area
3. Click "Get Legal Advice" to analyze your query
4. View the results in the different tabs:
   - **Model Comparison**: Compare advice from different AI models
   - **Case Studies**: Review relevant legal precedents
   - **Win Estimation**: See the estimated probability of winning your case
   - **Documents**: (Coming soon) Access relevant legal documents

## Design

### UI/UX Design Principles

- **User-Centric Approach**: Designed with legal professionals and laypeople in mind
- **Accessibility**: WCAG 2.1 AA compliant design for inclusive user experience
- **Minimalist Interface**: Clean, distraction-free workspace focusing on the legal content
- **Intuitive Navigation**: Logical information architecture with clear user flows
- **Visual Hierarchy**: Important information is emphasized through typography and spacing

### Design System

- **Color Palette**: Professional color scheme with accessible contrast ratios
- **Typography**: Clear hierarchical type system using modern sans-serif fonts
- **Component Library**: Consistent UI elements through ShadCN UI
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Dark Mode**: Carefully crafted dark theme for reduced eye strain

## Version History

- **Beta 0.2** (Current): Enhanced design system implementation and UI improvements
- **Beta 0.1**: Initial release with core functionality and UI

## Disclaimer

The information provided by Law Advisor is not a substitute for professional legal advice. Always consult with a qualified attorney for your specific legal needs.

## License

[MIT](LICENSE)
