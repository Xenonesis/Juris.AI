import { NextResponse } from 'next/server';

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

export async function GET(request: Request) {
  try {
    // Parse URL to get any query parameters
    const url = new URL(request.url);
    const jurisdiction = url.searchParams.get('jurisdiction') || 'us';

    // For local development with no Supabase, use our hardcoded jurisdiction-specific suggestions
    if (jurisdictionSuggestions[jurisdiction]) {
      return NextResponse.json({
        source: 'server',
        suggestions: jurisdictionSuggestions[jurisdiction]
      });
    }
    
    // If we don't have suggestions for this jurisdiction, use US or default
    return NextResponse.json({
      source: 'default',
      suggestions: jurisdictionSuggestions['us'] || defaultSuggestions
    });
    
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    
    // Even if there's an error, return default suggestions so the UI doesn't break
    return NextResponse.json({
      source: 'default',
      error: error instanceof Error ? error.message : 'Unknown error',
      suggestions: defaultSuggestions
    });
  }
}
