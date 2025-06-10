# Services Page

This directory contains the comprehensive services page for Juris.AI, showcasing all available legal AI services.

## Structure

```
src/app/services/
├── page.tsx                    # Main services page
├── components/
│   ├── index.ts               # Component exports
│   ├── ServiceCard.tsx        # Individual service cards
│   ├── PricingCard.tsx        # Pricing plan cards
│   ├── FeatureHighlight.tsx   # Feature highlight components
│   ├── FAQSection.tsx         # Frequently asked questions
│   ├── TestimonialsSection.tsx # User testimonials
│   └── ServiceComparison.tsx  # Service comparison table
└── README.md                  # This file
```

## Features

### Main Services
- **AI Legal Consultation** - Multi-model AI comparison for legal advice
- **Document Analysis** - AI-powered contract and document review
- **Case Law Research** - Comprehensive legal precedent search
- **Legal Research Tools** - Statute lookup and legal definitions
- **Case Win Estimation** - AI-powered success probability analysis
- **Multi-Model AI Comparison** - Compare responses from different AI models

### Page Sections
1. **Hero Section** - Introduction and quick stats
2. **Services Grid** - Main service offerings
3. **Why Choose Us** - Key benefits and features
4. **Service Comparison** - Detailed feature comparison table
5. **Pricing Plans** - Free, Professional, and Enterprise tiers
6. **Testimonials** - User reviews and feedback
7. **FAQ** - Common questions and answers
8. **Call to Action** - Sign-up and contact options

## Components

### ServiceCard
Displays individual services with:
- Icon and title
- Description
- Feature list
- Call-to-action button
- Hover effects and animations

### PricingCard
Shows pricing plans with:
- Plan name and price
- Feature list with included/excluded indicators
- Popular plan highlighting
- Action buttons

### FeatureHighlight
Highlights key benefits:
- Icon representation
- Title and description
- Consistent styling

### ServiceComparison
Comprehensive comparison table:
- Feature-by-feature comparison
- Visual indicators for included features
- Responsive design

### FAQSection
Interactive FAQ with:
- Expandable questions
- Smooth animations
- Comprehensive answers

### TestimonialsSection
User testimonials featuring:
- Star ratings
- User details and companies
- Quote formatting

## Styling

- Responsive design for all screen sizes
- Dark/light mode compatibility
- Consistent with overall Juris.AI design system
- Smooth animations and hover effects
- Professional gradient backgrounds

## Navigation

The services page is accessible via:
- Navigation bar "Services" link
- Direct URL: `/services`
- Updated from previous `#services` anchor link

## Future Enhancements

- Integration with actual pricing API
- Dynamic testimonials from database
- Interactive service demos
- Live chat integration
- Service booking system
