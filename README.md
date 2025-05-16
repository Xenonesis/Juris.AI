# Law Advisor - AI-Powered Legal Assistant (Beta 0.8)

A modern, user-friendly application that leverages multiple AI models to provide comprehensive legal advice, case studies, and win probability estimations.

## Features

- **Multiple AI Model Analysis**: Compares legal advice from GPT-4, Claude, Gemini, and Mistral
- **Model Comparison**: Toggle between different AI models' outputs to get diverse perspectives
- **Case Studies**: Displays relevant legal case studies based on your query
- **Win Estimation**: Estimates the probability of winning a case using AI analysis
- **Jurisdiction Selection**: Localizes legal advice based on selected jurisdiction
- **Modern UI**: Built with Tailwind CSS and ShadCN UI for a responsive, mobile-first design
- **Advanced Theme Management**: 
    - Easily switch between light, dark, and system themes.
    - Option to sync with the operating system's theme preference.
    - Remembers the last used theme when system sync is disabled.

## Tech Stack

| Technology       | Logo                  | Version | Description                                      |
|-----------------|-----------------------|---------|--------------------------------------------------|
| Next.js          | ![Next.js](public/next.svg) | 15.3    | React framework for building web applications     |
| Tailwind CSS     | ![Tailwind CSS](public/file.svg) | 4       | Utility-first CSS framework                      |
| ShadCN UI        | ![ShadCN UI](public/file.svg) |         | Component library for building user interfaces |
| AI Integrations  | ![AI](public/globe.svg)     | Various  | OpenAI, Anthropic, Google AI, and Mistral ready |


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

- **User-Centric Approach**: Designed with legal professionals and laypeople in mind, ensuring an intuitive and efficient experience.
- **Accessibility**: Adherence to WCAG 2.1 AA guidelines to provide an inclusive user experience for all users.
- **Minimalist Interface**: A clean, distraction-free workspace that prioritizes legal content and ease of use.
- **Intuitive Navigation**: Logical information architecture and clear user flows for seamless interaction.
- **Visual Hierarchy**: Strategic use of typography, spacing, and color to emphasize important information and guide user attention.
- **Contextual Help**: Embedded tooltips and guidance throughout the interface to assist users.
- **Responsive Design**: A mobile-first approach ensuring a consistent and optimal experience across all devices.
- **Theming**: Comprehensive theme management allowing users to select light, dark, or system-synchronized themes for personalized comfort and reduced eye strain.

### Design System

- **Color Palette**: Professional color scheme with accessible contrast ratios
  - Primary: Deep blue (#1E40AF) represents trust and professionalism
  - Secondary: Light blue (#60A5FA) for interactive elements
  - Accent: Gold (#FCD34D) for highlights and important information
  - Neutrals: Slate grays for text and backgrounds
- **Typography**: Clear hierarchical type system using modern sans-serif fonts
  - Headings: Inter (600 weight)
  - Body: Inter (400 weight)
  - Legal citations: Roboto Mono
- **Component Library**: Consistent UI elements through ShadCN UI
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Dark Mode**: Carefully crafted dark theme for reduced eye strain
- **Animation**: Subtle micro-interactions to enhance user experience

### Page Designs

- **Landing Page**: Clean, professional layout with clear value proposition and CTA
- **Auth Pages**: Streamlined login/signup flow with social authentication options
- **Chat Interface**: Intuitive conversation design with AI response formatting
- **Profile Dashboard**: User-friendly profile management with settings and history
- **Legal Analysis**: Interactive displays for multi-model comparisons and case citations
- **Results Visualization**: Clear presentation of win probability with supporting evidence

## Version History

- **Beta 0.8** (Current): Implemented advanced theme management with light, dark, and system sync options. Enhanced UI/UX for profile settings.
- **Beta 0.75**: Improved UI/UX, enhanced model accuracy, and added advanced case citation features
- **Beta 0.7**: Improved UI/UX, enhanced model accuracy, and added advanced case citation features
- **Beta 0.6**: Improved UI/UX, enhanced model accuracy, and added advanced case citation features
- **Beta 0.5**: Updated all pages, enhanced GitHub integration, expanded design documentation
- **Beta 0.4**: GitHub integration and comprehensive documentation updates
- **Beta 0.3**: Expanded design system documentation and UI refinements
- **Beta 0.2**: Enhanced design system implementation and UI improvements
- **Beta 0.1**: Initial release with core functionality and UI

## Disclaimer

The information provided by Law Advisor is not a substitute for professional legal advice. Always consult with a qualified attorney for your specific legal needs.

## License

[MIT](LICENSE)
