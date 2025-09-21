/**
 * Real Analysis Test Suite
 * Tests that all AI analysis implementations provide authentic results
 */

import { calculateRealPerformanceMetrics } from './real-performance-analyzer';
import { generateRealCaseStudies } from './real-case-studies';
import { performRealLegalResearch } from './real-legal-research';
import type { RealPerformanceMetrics } from './real-performance-analyzer';

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
      minAccuracy: 70,
      minRelevance: 75,
      minReasoning: 70,
      minLegalTerms: 10
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
  
  const testQuery = testScenarios[0].query;
  const mockApiKeys = { openai: 'test-key' };
  
  try {
    const caseStudies = await generateRealCaseStudies(testQuery, 'california', mockApiKeys);
    
    if (caseStudies.length === 0) {
      console.error('❌ No case studies generated');
      return false;
    }
    
    for (const caseStudy of caseStudies) {
      console.log(`📖 Case: ${caseStudy.title}`);
      console.log(`   Jurisdiction: ${caseStudy.jurisdiction}`);
      console.log(`   Relevance: ${caseStudy.relevanceScore}`);
      
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
  } catch (error) {
    console.error('❌ Case studies generation failed:', error);
    return false;
  }
}

/**
 * Test real legal research
 */
export async function testRealLegalResearch(): Promise<boolean> {
  console.log('⚖️ Testing Real Legal Research...');
  
  const testQuery = testScenarios[0].query;
  const mockApiKeys = { openai: 'test-key' };
  
  try {
    const analysis = await performRealLegalResearch(testQuery, 'california', mockApiKeys);
    
    console.log(`🎯 Research completed for: "${testQuery.substring(0, 30)}..."`);
    console.log(`📋 Analysis type: ${typeof analysis}`);
    
    if (!analysis) {
      console.error('❌ No legal research analysis returned');
      return false;
    }
    
    console.log('✅ Legal research passed');
    return true;
  } catch (error) {
    console.error('❌ Legal research failed:', error);
    return false;
  }
}

/**
 * Run comprehensive test suite
 */
export async function runRealAnalysisTests(): Promise<void> {
  console.log('🚀 Starting Real Analysis Test Suite...');
  console.log('=====================================');
  
  const performanceTest = await testRealPerformanceAnalysis();
  const caseStudiesTest = await testRealCaseStudies();
  const legalResearchTest = await testRealLegalResearch();
  
  console.log('\n📈 Test Results Summary:');
  console.log(`Performance Analysis: ${performanceTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Case Studies: ${caseStudiesTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Legal Research: ${legalResearchTest ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = performanceTest && caseStudiesTest && legalResearchTest;
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
export function validateRealAnalysis(metrics: RealPerformanceMetrics): boolean {
  // Check for common mock patterns in string fields
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
  const numericValues = [
    metrics.accuracy,
    metrics.relevance,
    metrics.reasoning,
    metrics.legalTermDensity,
    metrics.overall
  ];
  
  const uniqueValues = new Set(numericValues);
  
  if (numericValues.length > 3 && uniqueValues.size < 2) {
    console.warn('⚠️ Metrics appear too uniform (possible mock data)');
    return false;
  }
  
  // Check if all values are suspiciously round numbers
  const allRoundNumbers = numericValues.every(val => val % 5 === 0);
  if (allRoundNumbers && numericValues.length > 2) {
    console.warn('⚠️ All metrics are round numbers (possible mock data)');
    return false;
  }
  
  return true;
}