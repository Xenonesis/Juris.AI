/**
 * Legal API integrations
 * 
 * This file contains adapters for real-world legal APIs like Casetext, LexisNexis, and Westlaw.
 * You can replace the mock implementations with real API calls by obtaining API keys.
 */

// API Constants
// These would be used in real API implementations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CASETEXT_API_KEY = process.env.NEXT_PUBLIC_CASETEXT_API_KEY || 'demo_key_casetext';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LEXISNEXIS_API_KEY = process.env.NEXT_PUBLIC_LEXISNEXIS_API_KEY || 'demo_key_lexisnexis';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    'ca': ['Supreme Court of Canada', 'Federal Court of Canada', 'Ontario Court of Appeal'],
    'au': ['High Court of Australia', 'Federal Court of Australia', 'Supreme Court of New South Wales'],
    'eu': ['European Court of Justice', 'European Court of Human Rights', 'General Court'],
    'in': ['Supreme Court of India', 'High Court of Delhi', 'High Court of Mumbai'],
    'np': ['Supreme Court of Nepal', 'High Court of Nepal', 'District Court of Kathmandu'],
    'cn': ['Supreme People\'s Court', 'High People\'s Court', 'Intermediate People\'s Court']
  };
  
  // Map jurisdiction codes to jurisdiction-specific plaintiffs and defendants
  const plaintiffMap: {[key: string]: string[]} = {
    'us': ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Miller'],
    'uk': ['Taylor', 'Jones', 'Williams', 'Singh', 'Brown', 'Evans'],
    'ca': ['Tremblay', 'Roy', 'Gagnon', 'Lee', 'Wilson', 'MacDonald'],
    'au': ['Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor'],
    'eu': ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Dupont'],
    'in': ['Sharma', 'Singh', 'Patel', 'Kumar', 'Agarwal', 'Verma'],
    'np': ['Shrestha', 'Tamang', 'Rai', 'Gurung', 'Thapa', 'Sherpa'],
    'cn': ['Zhang', 'Wang', 'Li', 'Liu', 'Chen', 'Yang']
  };
  
  const defendantMap: {[key: string]: string[]} = {
    'us': ['United States', 'City of New York', 'State of California', 'Department of Justice', 'Microsoft Inc.', 'Facebook Inc.'],
    'uk': ['Crown Prosecution Service', 'National Health Service', 'British Airways', 'Royal Mail', 'City of London', 'BBC'],
    'ca': ['Government of Canada', 'Province of Ontario', 'City of Toronto', 'Air Canada', 'Royal Bank of Canada', 'Canadian Broadcasting Corporation'],
    'au': ['Commonwealth of Australia', 'State of New South Wales', 'City of Sydney', 'Qantas', 'National Australia Bank', 'Telstra'],
    'eu': ['European Commission', 'Council of the European Union', 'Deutsche Bank', 'Volkswagen AG', 'Airbus SE', 'Total SE'],
    'in': ['Union of India', 'State of Maharashtra', 'Delhi Development Authority', 'Tata Motors', 'Reliance Industries', 'State Bank of India'],
    'np': ['Government of Nepal', 'Nepal Electricity Authority', 'Nepal Airlines', 'Nepal Bank', 'Nepal Telecom', 'Kathmandu Metropolitan City'],
    'cn': ['People\'s Republic of China', 'Ministry of Commerce', 'Shanghai Municipal Government', 'Bank of China', 'China Mobile', 'Alibaba Group']
  };
  
  // Get courts for the jurisdiction or default to US
  const courts = courtMap[jurisdiction] || courtMap['us'];
  
  // Get jurisdiction-specific plaintiffs and defendants or default to US
  const plaintiffs = plaintiffMap[jurisdiction] || plaintiffMap['us'];
  const defendants = defendantMap[jurisdiction] || defendantMap['us'];
  
  // Jurisdiction-specific legal terms
  const legalTermMap: {[key: string]: {[key: string]: string}} = {
    'us': {
      'prosecution': 'United States',
      'supreme_court': 'Supreme Court of the United States',
      'constitution': 'U.S. Constitution',
      'civil_procedure': 'Federal Rules of Civil Procedure'
    },
    'uk': {
      'prosecution': 'Crown Prosecution Service',
      'supreme_court': 'UK Supreme Court',
      'constitution': 'Constitutional principles',
      'civil_procedure': 'Civil Procedure Rules'
    },
    'ca': {
      'prosecution': 'Crown',
      'supreme_court': 'Supreme Court of Canada',
      'constitution': 'Canadian Charter of Rights and Freedoms',
      'civil_procedure': 'Federal Courts Rules'
    },
    'au': {
      'prosecution': 'Commonwealth Director of Public Prosecutions',
      'supreme_court': 'High Court of Australia',
      'constitution': 'Australian Constitution',
      'civil_procedure': 'Federal Court Rules'
    },
    'in': {
      'prosecution': 'State',
      'supreme_court': 'Supreme Court of India',
      'constitution': 'Constitution of India',
      'civil_procedure': 'Code of Civil Procedure'
    },
    'np': {
      'prosecution': 'Government of Nepal',
      'supreme_court': 'Supreme Court of Nepal',
      'constitution': 'Constitution of Nepal',
      'civil_procedure': 'Civil Procedure Code'
    },
    'cn': {
      'prosecution': 'People\'s Procuratorate',
      'supreme_court': 'Supreme People\'s Court',
      'constitution': 'Constitution of the People\'s Republic of China',
      'civil_procedure': 'Civil Procedure Law'
    },
    'eu': {
      'prosecution': 'European Public Prosecutor\'s Office',
      'supreme_court': 'European Court of Justice',
      'constitution': 'Treaty on European Union',
      'civil_procedure': 'European Rules of Civil Procedure'
    }
  };
  
  // Get the legal terms for this jurisdiction
  const legalTerms = legalTermMap[jurisdiction] || legalTermMap['us'];
  
  // Legal topics based on terms in the query, adapted to jurisdiction
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
      p: [legalTerms['prosecution'], 'People', 'Commonwealth'],
      d: plaintiffs
    },
    // Add a general case type to handle default cases
    'general': {
      p: plaintiffs.concat(['Petitioner', 'Applicant', 'Claimant']),
      d: defendants.concat(['Respondent', 'State', 'Agency'])
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
  
  // Generate cases
  for (let i = 0; i < limit; i++) {
    // Select random elements
    const plaintiff = legalTopics[caseType].p[Math.floor(Math.random() * legalTopics[caseType].p.length)];
    const defendant = legalTopics[caseType].d[Math.floor(Math.random() * legalTopics[caseType].d.length)];
    const court = courts[Math.floor(Math.random() * courts.length)];
    
    // Generate a recent date
    const year = 2015 + Math.floor(Math.random() * 8);
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    // Generate a jurisdiction-specific citation
    const volume = 100 + Math.floor(Math.random() * 900);
    const reporterMap: {[key: string]: string} = {
      'us': 'U.S.',
      'uk': 'UKSC',
      'ca': 'SCR',
      'au': 'HCA',
      'in': 'SCC',
      'np': 'NKP',
      'cn': 'SCPR',
      'eu': 'CJEU'
    };
    const reporter = reporterMap[jurisdiction] || 'F.Supp.3d';
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
      summary: generateCaseSummary(terms, caseType, jurisdiction, legalTerms),
      full_text_url: `https://example.com/cases/${jurisdiction}/${year}/${plaintiff.toLowerCase()}-v-${defendant.toLowerCase().replace(/\s+/g, '-')}`,
      relevance: relevance
    });
  }
  
  return cases;
}

// Generate jurisdiction-specific case summaries
function generateCaseSummary(terms: string[], caseType: string, jurisdiction: string, legalTerms: {[key: string]: string}): string {
  // Create jurisdiction-specific legal principles and terminology
  const jurisdictionMap: {[key: string]: {principles: string[], terminology: string[]}} = {
    'us': {
      principles: [
        'stare decisis',
        'due process under the Fifth Amendment',
        'equal protection under the Fourteenth Amendment',
        'First Amendment protections',
        'Fourth Amendment search and seizure principles'
      ],
      terminology: [
        'federal jurisdiction',
        'constitutional rights',
        'Supreme Court precedent',
        'federal regulations',
        'state law claims'
      ]
    },
    'uk': {
      principles: [
        'parliamentary sovereignty',
        'rule of law',
        'separation of powers',
        'judicial precedent',
        'duty of care'
      ],
      terminology: [
        'statutory interpretation',
        'common law principles',
        'Crown proceedings',
        'judicial review',
        'ratio decidendi'
      ]
    },
    'ca': {
      principles: [
        'reasonable expectation of privacy',
        'Charter rights',
        'provincial jurisdiction',
        'duty to consult',
        'reasonable doubt'
      ],
      terminology: [
        'Canadian Charter analysis',
        'provincial statutes',
        'Crown liability',
        'indigenous rights',
        'reasonable person standard'
      ]
    },
    'au': {
      principles: [
        'statutory interpretation',
        'federalism',
        'separation of powers',
        'natural justice',
        'duty of care'
      ],
      terminology: [
        'Commonwealth jurisdiction',
        'state powers',
        'High Court precedent',
        'administrative review',
        'tortious liability'
      ]
    },
    'in': {
      principles: [
        'constitutional supremacy',
        'fundamental rights',
        'directive principles',
        'judicial review',
        'separation of powers'
      ],
      terminology: [
        'writ jurisdiction',
        'constitutional remedies',
        'public interest litigation',
        'statutory interpretation',
        'fundamental rights violations'
      ]
    },
    'np': {
      principles: [
        'constitutional supremacy',
        'fundamental rights',
        'separation of powers',
        'judicial independence',
        'rule of law'
      ],
      terminology: [
        'constitutional bench',
        'writ petitions',
        'public interest litigation',
        'interim orders',
        'civil code provisions'
      ]
    },
    'cn': {
      principles: [
        'socialist legal system',
        'people\'s democratic dictatorship',
        'rule by law',
        'administrative regulations',
        'collective interests'
      ],
      terminology: [
        'Supreme People\'s Court interpretation',
        'administrative enforcement',
        'civil code provisions',
        'procuratorate supervision',
        'civil disputes'
      ]
    },
    'eu': {
      principles: [
        'proportionality',
        'subsidiarity',
        'direct effect',
        'supremacy of EU law',
        'uniform application'
      ],
      terminology: [
        'directive implementation',
        'preliminary rulings',
        'member state obligations',
        'harmonization measures',
        'treaty provisions'
      ]
    }
  };

  // Get jurisdiction-specific legal language or default to US
  const legalLanguage = jurisdictionMap[jurisdiction] || jurisdictionMap['us'];
  
  // Pick some relevant legal principles and terminology for this jurisdiction
  const principle = legalLanguage.principles[Math.floor(Math.random() * legalLanguage.principles.length)];
  const term = legalLanguage.terminology[Math.floor(Math.random() * legalLanguage.terminology.length)];
  
  // Get topics from the query
  const topicPhrases = {
    'eviction': ['landlord-tenant relationship', 'leasehold interests', 'property rights'],
    'contract': ['contractual obligations', 'damages for breach', 'specific performance'],
    'injury': ['duty of care', 'negligence', 'proximate cause'],
    'employment': ['workplace rights', 'employer obligations', 'labor standards'],
    'criminal': ['criminal liability', 'prosecutorial discretion', 'sentencing guidelines'],
    'general': ['legal rights', 'judicial interpretation', 'statutory provisions']
  };
  
  // Select appropriate phrases
  const topicPhrase = topicPhrases[caseType as keyof typeof topicPhrases] || topicPhrases['general'];
  const phrase = topicPhrase[Math.floor(Math.random() * topicPhrase.length)];
  
  // Include jurisdiction-specific constitution or legislation reference if available
  const constitutionReference = legalTerms['constitution'] || 'applicable law';
  
  // Craft a jurisdiction-specific summary
  return `This ${jurisdiction.toUpperCase()} jurisdiction case established important precedent regarding ${terms.join(', ')} in ${caseType} law. The court applied the principle of ${principle} and analyzed ${phrase} in the context of ${term}. The ruling cited ${constitutionReference} and established a framework for similar cases in ${jurisdiction.toUpperCase()} courts.`;
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