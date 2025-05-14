/**
 * Legal API integrations
 * 
 * This file contains adapters for real-world legal APIs like Casetext, LexisNexis, and Westlaw.
 * You can replace the mock implementations with real API calls by obtaining API keys.
 */

// API Constants
const CASETEXT_API_KEY = process.env.NEXT_PUBLIC_CASETEXT_API_KEY || 'demo_key_casetext';
const LEXISNEXIS_API_KEY = process.env.NEXT_PUBLIC_LEXISNEXIS_API_KEY || 'demo_key_lexisnexis';
const WESTLAW_API_KEY = process.env.NEXT_PUBLIC_WESTLAW_API_KEY || 'demo_key_westlaw';

// Common types
export interface LegalCase {
  id: string;
  name: string;
  citation: string;
  court: string;
  decision_date: string;
  jurisdiction: string;
  summary?: string;
  full_text_url?: string;
  relevance: number;
}

export interface Statute {
  id: string;
  title: string;
  code: string;
  section: string;
  jurisdiction: string;
  content: string;
  effective_date?: string;
  relevance: number;
}

/**
 * Casetext Parallel Search API Adapter
 * https://casetext.com/parallel-search/
 */
export async function searchCasetextParallel(
  query: string, 
  jurisdiction: string = 'us',
  limit: number = 3
): Promise<LegalCase[]> {
  try {
    // In a real implementation, this would call the actual API
    // For demo purposes, we'll simulate a response based on the query
    
    // If this was real, it would be:
    // const response = await fetch('https://api.casetext.com/v1/search', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${CASETEXT_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     query: query,
    //     jurisdiction: jurisdiction,
    //     limit: limit
    //   })
    // });
    // const data = await response.json();
    // return data.results;
    
    // Instead, we'll return mock data that looks like the actual Casetext response
    const mockCases: LegalCase[] = generateMockCases(query, jurisdiction, limit);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockCases;
  } catch (error) {
    console.error('Casetext API error:', error);
    return [];
  }
}

/**
 * LexisNexis API Adapter
 */
export async function searchLexisNexis(
  query: string,
  jurisdiction: string = 'us',
  limit: number = 3
): Promise<{cases: LegalCase[], statutes: Statute[]}> {
  try {
    // Mock implementation
    const mockCases = generateMockCases(query, jurisdiction, limit);
    const mockStatutes = generateMockStatutes(query, jurisdiction, limit);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      cases: mockCases,
      statutes: mockStatutes
    };
  } catch (error) {
    console.error('LexisNexis API error:', error);
    return {cases: [], statutes: []};
  }
}

/**
 * Westlaw API Adapter
 */
export async function searchWestlaw(
  query: string,
  jurisdiction: string = 'us',
  limit: number = 3
): Promise<{cases: LegalCase[], statutes: Statute[]}> {
  try {
    // Mock implementation
    const mockCases = generateMockCases(query, jurisdiction, limit);
    const mockStatutes = generateMockStatutes(query, jurisdiction, limit);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      cases: mockCases,
      statutes: mockStatutes
    };
  } catch (error) {
    console.error('Westlaw API error:', error);
    return {cases: [], statutes: []};
  }
}

// Helper functions to generate realistic mock data
function generateMockCases(query: string, jurisdiction: string, limit: number): LegalCase[] {
  const lowerQuery = query.toLowerCase();
  const cases: LegalCase[] = [];
  
  // Parse query for key terms
  const terms = lowerQuery.split(/\s+/).filter(term => term.length > 3);
  
  // Map jurisdiction codes to court names
  const courtMap: {[key: string]: string[]} = {
    'us': ['Supreme Court of the United States', 'U.S. Court of Appeals', 'U.S. District Court'],
    'uk': ['UK Supreme Court', 'Court of Appeal', 'High Court of Justice'],
    'canada': ['Supreme Court of Canada', 'Federal Court of Canada', 'Ontario Court of Appeal'],
    'australia': ['High Court of Australia', 'Federal Court of Australia', 'Supreme Court of New South Wales'],
    'eu': ['European Court of Justice', 'European Court of Human Rights', 'General Court'],
    'in': ['Supreme Court of India', 'High Court of Delhi', 'High Court of Mumbai'],
    'np': ['Supreme Court of Nepal', 'High Court of Nepal', 'District Court of Kathmandu'],
    'cn': ['Supreme People\'s Court', 'High People\'s Court', 'Intermediate People\'s Court']
  };
  
  // Get courts for the jurisdiction or default to US
  const courts = courtMap[jurisdiction] || courtMap['us'];
  
  // Common case name patterns
  const plaintiffs = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Miller', 'Moore', 'Taylor', 'Anderson', 'Thomas'];
  const defendants = ['State', 'City of New York', 'United States', 'Jones Corp', 'ABC Company', 'Department of Justice', 'Microsoft', 'Apple Inc.', 'Facebook', 'Google'];
  
  // Legal topics based on terms in the query
  const legalTopics: {[key: string]: {p: string[], d: string[]}} = {
    'eviction': {
      p: ['Tenant', 'Renter', 'Leaseholder'],
      d: ['Landlord', 'Property Management', 'Housing Authority']
    },
    'divorce': {
      p: plaintiffs,
      d: plaintiffs
    },
    'contract': {
      p: plaintiffs.concat(['Consumer', 'Customer', 'Client']),
      d: ['Contractor', 'Service Provider', 'Seller', 'Manufacturer'].concat(defendants)
    },
    'injury': {
      p: ['Patient', 'Victim', 'Injured Party'].concat(plaintiffs),
      d: ['Hospital', 'Doctor', 'Surgeon', 'Employer', 'Manufacturer'].concat(defendants)
    },
    'employment': {
      p: ['Employee', 'Worker', 'Staff Member'].concat(plaintiffs),
      d: ['Employer', 'Corporation', 'Company', 'Business'].concat(defendants)
    },
    'criminal': {
      p: ['State', 'United States', 'People', 'Commonwealth', 'Prosecution'],
      d: plaintiffs
    }
  };
  
  // Identify case type
  let caseType = 'general';
  for (const topic of Object.keys(legalTopics)) {
    if (lowerQuery.includes(topic)) {
      caseType = topic;
      break;
    }
  }
  
  // Get appropriate parties
  const partySet = legalTopics[caseType] || {p: plaintiffs, d: defendants};
  
  // Generate cases
  for (let i = 0; i < limit; i++) {
    // Select random elements
    const plaintiff = partySet.p[Math.floor(Math.random() * partySet.p.length)];
    const defendant = partySet.d[Math.floor(Math.random() * partySet.d.length)];
    const court = courts[Math.floor(Math.random() * courts.length)];
    
    // Generate a recent date
    const year = 2015 + Math.floor(Math.random() * 8);
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    // Generate a citation
    const volume = 100 + Math.floor(Math.random() * 900);
    const reporter = jurisdiction === 'us' ? 'U.S.' : (jurisdiction === 'uk' ? 'UKSC' : 'F.Supp.3d');
    const page = 100 + Math.floor(Math.random() * 900);
    
    // Calculate relevance with highest relevance for first result
    const relevance = Math.max(0.99 - (i * 0.1), 0.7);
    
    cases.push({
      id: `case_${jurisdiction}_${year}_${i}`,
      name: `${plaintiff} v. ${defendant}`,
      citation: `${volume} ${reporter} ${page} (${year})`,
      court: court,
      decision_date: date,
      jurisdiction: jurisdiction,
      summary: `This case involves ${terms.join(', ')} in the context of ${caseType} law.`,
      full_text_url: `https://example.com/cases/${jurisdiction}/${year}/${plaintiff.toLowerCase()}-v-${defendant.toLowerCase().replace(/\s+/g, '-')}`,
      relevance: relevance
    });
  }
  
  return cases;
}

function generateMockStatutes(query: string, jurisdiction: string, limit: number): Statute[] {
  const lowerQuery = query.toLowerCase();
  const statutes: Statute[] = [];
  
  // Map jurisdiction to legal codes
  const codeMap: {[key: string]: string[]} = {
    'us': ['U.S. Code', 'Code of Federal Regulations', 'Uniform Commercial Code'],
    'uk': ['UK Public General Acts', 'UK Statutory Instruments', 'Consumer Rights Act'],
    'canada': ['Canadian Criminal Code', 'Charter of Rights and Freedoms', 'Civil Code of Quebec'],
    'australia': ['Commonwealth Consolidated Acts', 'Competition and Consumer Act', 'Criminal Code Act'],
    'eu': ['EU Treaties', 'EU Directives', 'EU Regulations'],
    'in': ['Indian Penal Code', 'Constitution of India', 'Indian Contract Act'],
    'np': ['Constitution of Nepal', 'Civil Code of Nepal', 'Criminal Code of Nepal'],
    'cn': ['Civil Code of China', 'Criminal Law of China', 'Constitutional Law of China']
  };
  
  // Get codes for the jurisdiction or default to US
  const codes = codeMap[jurisdiction] || codeMap['us'];
  
  // Common statute patterns based on query topics
  const statutePatterns: {[key: string]: {titles: string[], content: string[]}} = {
    'eviction': {
      titles: ['Residential Tenancies Act', 'Housing and Urban Development Act', 'Property Law Act'],
      content: [
        'A landlord shall not evict a tenant without proper notice as specified in this section.',
        'Tenants have the right to quiet enjoyment of their rental property without unreasonable disturbance.',
        'Procedures for lawful eviction must follow the process outlined in subsections (a) through (e).'
      ]
    },
    'contract': {
      titles: ['Contract Law Reform Act', 'Unfair Contract Terms Act', 'Consumer Protection Act'],
      content: [
        'A contract requires offer, acceptance, consideration, and intention to create legal relations.',
        'Unfair terms in consumer contracts shall not be binding on the consumer.',
        'Parties to a contract must perform their obligations in good faith.'
      ]
    },
    'injury': {
      titles: ['Personal Injury Compensation Act', 'Health and Safety at Work Act', 'Liability Reform Act'],
      content: [
        'A person who suffers personal injury due to negligence may claim damages as specified herein.',
        'Employers must provide a safe working environment for all employees.',
        'Compensation may include economic and non-economic damages as defined in section 12.'
      ]
    },
    'employment': {
      titles: ['Fair Labor Standards Act', 'Employment Rights Act', 'Workplace Relations Act'],
      content: [
        'Employees are entitled to minimum wage as established by this section.',
        'Termination of employment requires proper notice or payment in lieu of notice.',
        'Discrimination in the workplace based on protected characteristics is prohibited.'
      ]
    },
    'criminal': {
      titles: ['Criminal Code', 'Penal Code', 'Sentencing Reform Act'],
      content: [
        'A person commits an offense if they engage in conduct specified as an offense in this code.',
        'Criminal liability requires both actus reus and mens rea as defined in this chapter.',
        'Sentences shall be proportionate to the severity of the offense and culpability of the offender.'
      ]
    }
  };
  
  // Identify statute type
  let statuteType = 'general';
  for (const topic of Object.keys(statutePatterns)) {
    if (lowerQuery.includes(topic)) {
      statuteType = topic;
      break;
    }
  }
  
  // Get appropriate patterns
  const patterns = statutePatterns[statuteType] || {
    titles: ['General Law Act', 'Civil Code', 'Administrative Procedures Act'],
    content: [
      'The provisions of this Act shall be interpreted to give effect to its purposes.',
      'Rights and obligations established under this section are enforceable in a court of competent jurisdiction.',
      'Regulations may be made by the appropriate authority to implement the provisions of this Act.'
    ]
  };
  
  // Generate statutes
  for (let i = 0; i < limit; i++) {
    // Select random elements
    const title = patterns.titles[Math.floor(Math.random() * patterns.titles.length)];
    const content = patterns.content[Math.floor(Math.random() * patterns.content.length)];
    const code = codes[Math.floor(Math.random() * codes.length)];
    
    // Generate section number
    const section = `Section ${10 + Math.floor(Math.random() * 90)}${String.fromCharCode(97 + Math.floor(Math.random() * 26))}`;
    
    // Calculate relevance with highest relevance for first result
    const relevance = Math.max(0.95 - (i * 0.1), 0.65);
    
    statutes.push({
      id: `statute_${jurisdiction}_${i}`,
      title: title,
      code: code,
      section: section,
      jurisdiction: jurisdiction,
      content: content,
      effective_date: `${2010 + Math.floor(Math.random() * 12)}-01-01`,
      relevance: relevance
    });
  }
  
  return statutes;
} 