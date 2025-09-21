import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Default suggestions to use if no user-specific or server-side suggestions are available
const defaultSuggestions = [
  { id: 'tenant', text: "What are my tenant rights regarding property repairs?" },
  { id: 'inheritance', text: "How do I contest a will in probate court?" },
  { id: 'contract', text: "Can I void a contract signed under false pretenses?" },
];

// Jurisdiction-specific suggestions
const jurisdictionSuggestions: Record<string, Array<{id: string, text: string}>> = {
  'us': [
    { id: 'us-bankruptcy', text: "How do I file for bankruptcy protection?" },
    { id: 'us-will', text: "What are the requirements for a valid will?" },
    { id: 'us-discrimination', text: "Can I sue my employer for discrimination?" },
  ],
  'uk': [
    { id: 'uk-tenant', text: "What are my rights as a tenant in the UK?" },
    { id: 'uk-parking', text: "How do I appeal a parking fine in London?" },
    { id: 'uk-divorce', text: "What is the process for divorce in England?" },
  ],
  'ca': [
    { id: 'ca-leave', text: "How does parental leave work in Canada?" },
    { id: 'ca-traffic', text: "What are my rights in a traffic stop?" },
    { id: 'ca-will', text: "How do I contest a will in Canada?" },
  ],
  'au': [
    { id: 'au-defamation', text: "What are the defamation laws in Australia?" },
    { id: 'au-dismissal', text: "How do I fight an unfair dismissal?" },
    { id: 'au-tenant', text: "What are my rights as a tenant in Sydney?" },
  ],
  'in': [
    { id: 'in-rti', text: "How do I file an RTI application?" },
    { id: 'in-property', text: "What are the steps to fight a property dispute?" },
    { id: 'in-bail', text: "How does the bail process work in India?" },
  ],
  'np': [
    { id: 'np-inheritance', text: "What are property inheritance laws in Nepal?" },
    { id: 'np-company', text: "How do I register a company in Nepal?" },
    { id: 'np-labor', text: "What are labor laws for foreign employment?" },
  ],
  'cn': [
    { id: 'cn-business', text: "What are the business registration requirements?" },
    { id: 'cn-ip', text: "How do intellectual property rights work in China?" },
    { id: 'cn-labor', text: "What is the process for labor dispute resolution?" },
  ],
  'eu': [
    { id: 'eu-gdpr', text: "What are my GDPR rights as a consumer?" },
    { id: 'eu-consumer', text: "How do EU consumer protection laws work?" },
    { id: 'eu-employment', text: "What should I know about EU employment contracts?" },
  ]
};

// Helper function to extract keywords from text
function extractKeywords(text: string): string[] {
  const legalKeywords = [
    'contract', 'tenant', 'landlord', 'employment', 'discrimination', 'divorce', 'will', 'inheritance',
    'bankruptcy', 'copyright', 'trademark', 'patent', 'business', 'company', 'corporation', 'LLC',
    'tax', 'property', 'real estate', 'personal injury', 'medical malpractice', 'criminal', 'civil',
    'litigation', 'lawsuit', 'court', 'judge', 'jury', 'settlement', 'damages', 'liability',
    'insurance', 'workers compensation', 'social security', 'disability', 'immigration', 'visa',
    'green card', 'citizenship', 'deportation', 'asylum', 'refugee', 'family law', 'custody',
    'adoption', 'domestic violence', 'restraining order', 'probate', 'estate', 'trust', 'guardian'
  ];
  
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  return words.filter(word => 
    legalKeywords.includes(word) || 
    word.length > 5 // Include longer words that might be domain-specific
  );
}

// Helper function to generate related questions based on chat history
function generateRelatedQuestions(messages: any[], jurisdiction: string): Array<{id: string, text: string, relevance: number}> {
  const questions: Array<{id: string, text: string, relevance: number}> = [];
  const keywordCount: Record<string, number> = {};
  
  // Extract keywords from user messages
  messages.forEach(msg => {
    if (msg.is_user_message) {
      const keywords = extractKeywords(msg.content);
      keywords.forEach(keyword => {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      });
    }
  });
  
  // Generate suggestions based on keyword patterns
  const topKeywords = Object.entries(keywordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([keyword]) => keyword);
  
  topKeywords.forEach((keyword, index) => {
    const relevance = 100 - (index * 10); // Higher relevance for more frequent keywords
    
    switch (keyword) {
      case 'tenant':
      case 'landlord':
      case 'rent':
        questions.push({
          id: `tenant-${keyword}`,
          text: `What are my rights regarding ${keyword === 'rent' ? 'rent increases' : 'property maintenance'} in ${jurisdiction}?`,
          relevance
        });
        break;
      case 'employment':
      case 'workplace':
      case 'discrimination':
        questions.push({
          id: `employment-${keyword}`,
          text: `How do I handle ${keyword === 'discrimination' ? 'workplace discrimination' : 'employment disputes'} in ${jurisdiction}?`,
          relevance
        });
        break;
      case 'contract':
        questions.push({
          id: `contract-${keyword}`,
          text: `What makes a contract legally binding in ${jurisdiction}?`,
          relevance
        });
        break;
      case 'business':
      case 'company':
      case 'corporation':
        questions.push({
          id: `business-${keyword}`,
          text: `What are the requirements for starting a business in ${jurisdiction}?`,
          relevance
        });
        break;
      case 'divorce':
      case 'custody':
        questions.push({
          id: `family-${keyword}`,
          text: `What is the ${keyword} process in ${jurisdiction}?`,
          relevance
        });
        break;
      case 'will':
      case 'inheritance':
      case 'estate':
        questions.push({
          id: `estate-${keyword}`,
          text: `How do ${keyword === 'will' ? 'wills and probate' : 'inheritance laws'} work in ${jurisdiction}?`,
          relevance
        });
        break;
      case 'copyright':
      case 'trademark':
      case 'patent':
        questions.push({
          id: `ip-${keyword}`,
          text: `How do I protect my ${keyword} in ${jurisdiction}?`,
          relevance
        });
        break;
      default:
        questions.push({
          id: `general-${keyword}`,
          text: `Tell me more about ${keyword} law in ${jurisdiction}`,
          relevance: relevance * 0.7 // Lower relevance for general terms
        });
    }
  });
  
  return questions.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const jurisdiction = url.searchParams.get('jurisdiction') || 'general';
    const userId = url.searchParams.get('userId');
    const includeHistory = url.searchParams.get('includeHistory') === 'true';
    
    const supabase = await createClient();
    
    let suggestions: Array<{id: string, text: string, source?: string, relevance?: number}> = [];
    
    // If user is specified and history analysis is requested
    if (userId && includeHistory) {
      try {
        // Get user's recent chat history (last 50 messages)
        const { data: chatHistory, error: chatError } = await supabase
          .from('chat_messages')
          .select('content, is_user_message, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (!chatError && chatHistory && chatHistory.length > 0) {
          // Generate personalized suggestions based on chat history
          const historySuggestions = generateRelatedQuestions(chatHistory, jurisdiction);
          suggestions.push(...historySuggestions.map(s => ({
            ...s,
            source: 'history'
          })));
        }
        
        // Get user's personal suggestions (frequently used queries)
        const { data: userSuggestions, error: userError } = await supabase
          .from('user_suggestions')
          .select('query_text, use_count, last_used_at')
          .eq('user_id', userId)
          .order('use_count', { ascending: false })
          .limit(3);
        
        if (!userError && userSuggestions && userSuggestions.length > 0) {
          suggestions.push(...userSuggestions.map((s, index) => ({
            id: `user-${index}`,
            text: s.query_text,
            source: 'personal',
            relevance: s.use_count * 10
          })));
        }
      } catch (error) {
        console.error('Error fetching user-specific suggestions:', error);
      }
    }
    
    // Get popular suggestions for the jurisdiction
    try {
      const { data: popularSuggestions, error: popularError } = await supabase
        .from('popular_suggestions')
        .select('query_text, popularity')
        .eq('jurisdiction', jurisdiction)
        .order('popularity', { ascending: false })
        .limit(3);
      
      if (!popularError && popularSuggestions && popularSuggestions.length > 0) {
        suggestions.push(...popularSuggestions.map((s, index) => ({
          id: `popular-${index}`,
          text: s.query_text,
          source: 'popular',
          relevance: s.popularity
        })));
      }
    } catch (error) {
      console.error('Error fetching popular suggestions:', error);
    }
    
    // If we don't have enough suggestions, add jurisdiction-specific defaults
    if (suggestions.length < 3) {
      const defaultJurisdictionSuggestions = jurisdictionSuggestions[jurisdiction] || jurisdictionSuggestions['us'] || defaultSuggestions;
      suggestions.push(...defaultJurisdictionSuggestions.map(s => ({
        ...s,
        source: 'default',
        relevance: 50
      })));
    }
    
    // Remove duplicates and sort by relevance
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.text.toLowerCase() === suggestion.text.toLowerCase())
      )
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
      .slice(0, 6); // Limit to 6 suggestions
    
    return NextResponse.json({
      suggestions: uniqueSuggestions,
      meta: {
        jurisdiction,
        userId,
        includeHistory,
        totalSuggestions: uniqueSuggestions.length,
        sources: Array.from(new Set(uniqueSuggestions.map(s => s.source)))
      }
    });
    
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    
    // Fallback to default suggestions
    const jurisdiction = new URL(request.url).searchParams.get('jurisdiction') || 'us';
    return NextResponse.json({
      suggestions: (jurisdictionSuggestions[jurisdiction] || defaultSuggestions).map(s => ({
        ...s,
        source: 'fallback'
      })),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// POST endpoint to save user suggestion usage
export async function POST(request: Request) {
  try {
    const { userId, queryText } = await request.json();
    
    if (!userId || !queryText) {
      return NextResponse.json({ error: 'Missing userId or queryText' }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    // Check if this suggestion already exists for the user
    const { data: existingSuggestion, error: selectError } = await supabase
      .from('user_suggestions')
      .select('id, use_count')
      .eq('user_id', userId)
      .eq('query_text', queryText)
      .single();
    
    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw selectError;
    }
    
    if (existingSuggestion) {
      // Update existing suggestion
      const { error: updateError } = await supabase
        .from('user_suggestions')
        .update({
          use_count: existingSuggestion.use_count + 1,
          last_used_at: new Date().toISOString()
        })
        .eq('id', existingSuggestion.id);
      
      if (updateError) throw updateError;
    } else {
      // Create new suggestion
      const { error: insertError } = await supabase
        .from('user_suggestions')
        .insert({
          user_id: userId,
          query_text: queryText,
          use_count: 1,
          last_used_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error saving suggestion usage:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
