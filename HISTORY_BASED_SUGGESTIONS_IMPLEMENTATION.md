# History-Based Question Suggestions Implementation

## Overview

I've implemented a comprehensive history-based question suggestions system for the Juris AI chat application. This feature analyzes user chat history to provide personalized, contextually relevant legal question suggestions.

## Features Implemented

### 1. Enhanced Suggestions API (`/api/suggestions`)

**File**: `src/app/api/suggestions/route.ts`

- **GET Endpoint**: Fetches personalized suggestions based on:
  - User's chat history (keyword analysis)
  - User's frequently asked questions
  - Popular questions by jurisdiction
  - Fallback to default suggestions
  
- **POST Endpoint**: Tracks suggestion usage for learning user preferences

**Key Features**:
- Intelligent keyword extraction from legal queries
- Relevance scoring based on frequency and recency
- Multi-source suggestion aggregation
- Graceful fallbacks for error scenarios

### 2. Suggestions Hook (`useSuggestions`)

**File**: `src/hooks/useSuggestions.ts`

- Manages suggestion fetching and state
- Handles user authentication states
- Provides suggestion usage tracking
- Automatic refresh capabilities

### 3. Suggestion Chips Component

**File**: `src/components/chat/suggestion-chips.tsx`

- Visual component for displaying suggestions
- Categorizes suggestions by source (history, personal, popular, default)
- Color-coded badges for different suggestion types
- Smooth animations and loading states

### 4. Integration Points

#### Welcome Screen Updates
**File**: `src/components/chat/welcome-screen.tsx`
- Shows personalized suggestions prominently
- Falls back to static examples when no suggestions available
- Tracks suggestion usage for analytics

#### Enhanced Chat Input
**File**: `src/components/chat/enhanced-chat-input.tsx`
- Displays contextual suggestions when input is focused and empty
- Provides quick access to relevant questions
- Integrates with jurisdiction and legal mode settings

## Database Schema

The system leverages existing database tables:

### `user_suggestions` Table
```sql
- id: UUID (Primary Key)
- user_id: UUID (References auth.users)
- query_text: TEXT
- last_used_at: TIMESTAMP
- created_at: TIMESTAMP
- use_count: INTEGER
```

### `popular_suggestions` Table
```sql
- id: UUID (Primary Key)
- jurisdiction: TEXT
- query_text: TEXT
- popularity: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### `chat_messages` Table
Used for history analysis:
```sql
- user_id: UUID
- content: TEXT
- is_user_message: BOOLEAN
- created_at: TIMESTAMP
```

## Keyword Analysis Algorithm

The system uses intelligent keyword extraction:

1. **Legal Keywords Dictionary**: Predefined list of legal terms
2. **Length Filter**: Includes words longer than 5 characters
3. **Frequency Analysis**: Counts keyword occurrences across user messages
4. **Context Generation**: Creates relevant questions based on keyword patterns

### Supported Legal Categories
- Business Law (contracts, corporations, LLCs)
- Employment Law (discrimination, workplace issues)
- Real Estate (tenant rights, property disputes)
- Family Law (divorce, custody, adoption)
- Intellectual Property (copyright, trademark, patents)
- Estate Planning (wills, inheritance, probate)
- And more...

## API Usage Examples

### Get Personalized Suggestions
```javascript
GET /api/suggestions?jurisdiction=us&includeHistory=true&userId=USER_ID
```

**Response**:
```json
{
  "suggestions": [
    {
      "id": "history-tenant",
      "text": "What are my rights regarding property maintenance in us?",
      "source": "history",
      "relevance": 100
    },
    {
      "id": "personal-0",
      "text": "How do I handle workplace discrimination?",
      "source": "personal",
      "relevance": 50
    }
  ],
  "meta": {
    "jurisdiction": "us",
    "userId": "USER_ID",
    "includeHistory": true,
    "totalSuggestions": 6,
    "sources": ["history", "personal", "popular"]
  }
}
```

### Track Suggestion Usage
```javascript
POST /api/suggestions
Content-Type: application/json

{
  "userId": "USER_ID",
  "queryText": "What are my tenant rights?"
}
```

## Suggestion Sources & Prioritization

1. **History-based** (Highest Priority)
   - Analyzed from user's recent chat messages
   - Based on keyword frequency and patterns
   - Jurisdiction-specific question generation

2. **Personal** (High Priority)
   - User's frequently used queries
   - Sorted by usage count and recency

3. **Popular** (Medium Priority)
   - Trending questions in user's jurisdiction
   - Community-driven suggestions

4. **Default** (Fallback)
   - Static jurisdiction-specific examples
   - Ensures UI always has content

## Integration Flow

1. User opens chat interface
2. `useSuggestions` hook fetches personalized suggestions
3. `SuggestionChips` component displays categorized suggestions
4. User clicks a suggestion
5. Suggestion usage is tracked via POST API
6. Chat input is populated with selected question
7. System learns from usage patterns for future suggestions

## Benefits

- **Personalized Experience**: Suggestions based on user's actual legal interests
- **Improved Efficiency**: Quick access to relevant questions
- **Learning System**: Becomes more accurate over time
- **Contextual Relevance**: Jurisdiction-aware suggestions
- **Graceful Degradation**: Always provides useful suggestions

## Security & Privacy

- Row Level Security (RLS) policies ensure users only see their own suggestions
- No sensitive personal information stored in suggestions
- Keyword analysis is performed on anonymized content patterns
- Popular suggestions are aggregated without personal identifiers

## Performance Optimizations

- Efficient database queries with proper indexing
- Client-side caching of suggestions
- Lazy loading of suggestion components
- Debounced API calls to prevent excessive requests

## Future Enhancements

Potential improvements for the suggestion system:

1. **Machine Learning Integration**: More sophisticated NLP for better keyword extraction
2. **Semantic Analysis**: Understanding question intent beyond keywords
3. **Collaborative Filtering**: Suggestions based on similar users' patterns
4. **Time-based Weighting**: Recent queries weighted more heavily
5. **Category-based Grouping**: Organize suggestions by legal practice areas
6. **Multi-language Support**: Keyword extraction for different languages

## Testing

The system includes comprehensive error handling and fallbacks:
- Network failures gracefully degrade to default suggestions
- Database errors don't break the UI
- Invalid user states are handled appropriately
- Build process validates TypeScript types and API contracts

This implementation provides a solid foundation for intelligent, history-based question suggestions that enhance the user experience while learning from user behavior patterns.