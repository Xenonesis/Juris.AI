/**
 * Real Analysis Test Suite
 * Tests that all AI analysis implementations provide authentic results
 */

import { calculateRealPerformanceMetrics, analyzeLegalResponseQuality } from './real-performance-analyzer';
import { generateRealCaseStudies } from './real-case-studies';
import { performRealLegalResearch } from './real-legal-research';

interface TestScenario {
  query: string;
  modelResponse: string;
  expectedMetrics: {
    minAccuracy: number;
    minRelevance: number;
    minReasoning: number;
    minLegalTerms: number;
  };
}

const testScenarios: TestScenario[] = [
  {
    query: "Can my landlord evict me without notice in California?",
    modelResponse: `In California, landlords cannot evict tenants without proper notice. Under California Civil Code Section 1946, the required notice period depends on the reason for eviction:

1. **30-Day Notice**: For month-to-month tenancies without cause (if tenant has lived there less than 12 months)
2. **60-Day Notice**: For month-to-month tenancies without cause (if tenant has lived there 12+ months)
3. **3-Day Notice**: For lease violations such as non-payment of rent

The landlord must follow proper legal procedures including:
- Written notice in the proper format
- Service of process according to California Code of Civil Procedure
- Filing an unlawful detainer lawsuit if tenant doesn't comply

Case law such as *Jordan v. Talbot* (1961) establishes that improper notice renders an eviction void. The California Tenant Protection Act of 2019 provides additional protections.

Tenants have rights to cure defaults and contest evictions in court. Always consult with a qualified attorney for specific situations.`,
    expectedMetrics: {
      minAccuracy: 85,
      minRelevance: 90,
      minReasoning: 80,
      minLegalTerms: 15
    }
  },
  {
    query: "What is breach of contract in business law?",
    modelResponse: `Breach of contract occurs when one party fails to perform any duty or obligation specified in a contractual agreement. There are several types of breaches:

**Material Breach**: A significant failure that substantially defeats the purpose of the contract. This gives the non-breaching party the right to terminate and seek damages.

**Minor Breach**: A partial or immaterial failure that doesn't destroy the contract's value. The contract remains in effect, but damages may be recoverable.

**Anticipatory Breach**: When one party indicates they will not perform their contractual obligations before the performance is due.

**Remedies for Breach**:
- Compensatory damages (expectation damages)
- Consequential damages (foreseeable losses)
- Punitive damages (in rare cases involving fraud)
- Specific performance (court order to fulfill the contract)
- Restitution (return of benefits conferred)

Legal precedent from *Hadley v. Baxendale* (1854) established the foreseeability test for consequential damages. The Uniform Commercial Code (UCC) governs contracts for the sale of goods, while common law applies to service contracts.

Courts will consider factors such as the parties' intent, the contract's purpose, and whether the breach was willful or inadvertent when determining appropriate remedies.`,
    expectedMetrics: {
      minAccuracy: 90,
      minRelevance: 95,
      minReasoning: 85,
      minLegalTerms: 20
    }
  }
];

/**
 * Test real performance analysis
 */
export async function testRealPerformanceAnalysis(): Promise<boolean> {
  console.log('🧪 Testing Real Performance Analysis...');
  
  for (const scenario of testScenarios) {
    const metrics = calculateRealPerformanceMetrics(scenario.modelResponse, 500, 'test');
    
    console.log(`📊 Scenario: "${scenario.query.substring(0, 50)}..."`);
    console.log(`   Accuracy: ${metrics.accuracy}% (min: ${scenario.expectedMetrics.minAccuracy}%)`);
    console.log(`   Relevance: ${metrics.relevance}% (min: ${scenario.expectedMetrics.minRelevance}%)`);
    console.log(`   Reasoning: ${metrics.reasoning}% (min: ${scenario.expectedMetrics.minReasoning}%)`);
    console.log(`   Legal Terms: ${metrics.legalTermDensity}% (min: ${scenario.expectedMetrics.minLegalTerms}%)`);
    
    // Verify metrics meet minimum thresholds
    if (metrics.accuracy < scenario.expectedMetrics.minAccuracy) {
      console.error(`❌ Accuracy too low: ${metrics.accuracy}% < ${scenario.expectedMetrics.minAccuracy}%`);
      return false;
    }
    
    if (metrics.relevance < scenario.expectedMetrics.minRelevance) {
      console.error(`❌ Relevance too low: ${metrics.relevance}% < ${scenario.expectedMetrics.minRelevance}%`);
      return false;
    }
    
    if (metrics.reasoning < scenario.expectedMetrics.minReasoning) {
      console.error(`❌ Reasoning too low: ${metrics.reasoning}% < ${scenario.expectedMetrics.minReasoning}%`);
      return false;
    }
    
    if (metrics.legalTermDensity < scenario.expectedMetrics.minLegalTerms) {
      console.error(`❌ Legal terms too low: ${metrics.legalTermDensity}% < ${scenario.expectedMetrics.minLegalTerms}%`);
      return false;
    }
    
    console.log('✅ Analysis passed all thresholds');
  }
  
  return true;
}

/**
 * Test real case studies generation
 */
export async function testRealCaseStudies(): Promise<boolean> {
  console.log('📚 Testing Real Case Studies Generation...');
  
  const testResponse = testScenarios[0].modelResponse;
  const testQuery = testScenarios[0].query;
  const mockApiKeys = { openai: 'test-key' };
  
  const caseStudies = await generateRealCaseStudies(testQuery, 'california', mockApiKeys);
  
  if (caseStudies.length === 0) {
    console.error('❌ No case studies generated');
    return false;
  }
  
  for (const caseStudy of caseStudies) {
    console.log(`📖 Case: ${caseStudy.title}`);
    console.log(`   Jurisdiction: ${caseStudy.jurisdiction}`);
    console.log(`   Relevance: ${caseStudy.relevanceScore}`);
    console.log(`   Year: ${caseStudy.year}`);
    
    // Verify case study has required fields
    if (!caseStudy.title || !caseStudy.summary || !caseStudy.jurisdiction) {
      console.error('❌ Case study missing required fields');
      return false;
    }
    
    if (caseStudy.relevanceScore < 0.5) {
      console.error('❌ Case study relevance too low');
      return false;
    }
  }
  
  console.log('✅ Case studies generation passed');
  return true;
}

/**
 * Test real legal probability analysis
 */
export async function testRealLegalAnalysis(): Promise<boolean> {
  console.log('⚖️ Testing Real Legal Probability Analysis...');
  
  const testQuery = testScenarios[1].query;
  const testJurisdiction = 'california';
  
  const analysis = await analyzeLegalProbability(testQuery, testJurisdiction);
  
  console.log(`🎯 Win Probability: ${analysis.winProbability}%`);
  console.log(`📋 Factors: ${analysis.factors.length}`);
  console.log(`⚠️ Risks: ${analysis.risks.length}`);
  console.log(`💡 Recommendations: ${analysis.recommendations.length}`);
  
  // Verify analysis completeness
  if (analysis.winProbability < 0 || analysis.winProbability > 100) {
    console.error('❌ Invalid win probability range');
    return false;
  }
  
  if (analysis.factors.length === 0) {
    console.error('❌ No factors identified');
    return false;
  }
  
  if (analysis.risks.length === 0) {
    console.error('❌ No risks identified');
    return false;
  }
  
  if (analysis.recommendations.length === 0) {
    console.error('❌ No recommendations provided');
    return false;
  }
  
  console.log('✅ Legal analysis passed');
  return true;
}

/**
 * Run comprehensive test suite
 */
export async function runRealAnalysisTests(): Promise<void> {
  console.log('🚀 Starting Real Analysis Test Suite...');
  console.log('=====================================');
  
  const performanceTest = await testRealPerformanceAnalysis();
  const caseStudiesTest = await testRealCaseStudies();
  const legalAnalysisTest = await testRealLegalAnalysis();
  
  console.log('\n📈 Test Results Summary:');
  console.log(`Performance Analysis: ${performanceTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Case Studies: ${caseStudiesTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Legal Analysis: ${legalAnalysisTest ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = performanceTest && caseStudiesTest && legalAnalysisTest;
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n🎉 Your real analysis system is working correctly!');
    console.log('All AI model comparisons and legal analysis features are now authentic.');
  } else {
    console.log('\n⚠️ Some issues detected. Check the detailed output above.');
  }
}

/**
 * Validate that analysis results are not mock/fake
 */
export function validateRealAnalysis(metrics: any): boolean {
  // Check for common mock patterns
  const mockPatterns = [
    'mock', 'fake', 'dummy', 'placeholder', 'lorem ipsum',
    'test data', 'sample', 'random'
  ];
  
  const metricsString = JSON.stringify(metrics).toLowerCase();
  
  for (const pattern of mockPatterns) {
    if (metricsString.includes(pattern)) {
      console.warn(`⚠️ Detected potential mock pattern: "${pattern}"`);
      return false;
    }
  }
  
  // Verify metrics have realistic variation (not identical/rounded numbers)
  if (typeof metrics === 'object' && metrics !== null) {
    const values = Object.values(metrics).filter(v => typeof v === 'number');
    const uniqueValues = new Set(values);
    
    if (values.length > 3 && uniqueValues.size < 2) {
      console.warn('⚠️ Metrics appear too uniform (possible mock data)');
      return false;
    }
  }
  
  return true;
}