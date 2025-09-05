import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers';
import { fetchRelevantCaseLaw, fetchRelevantStatutes } from "@/lib/ai-services";

export class LegalBertModel {
  private model: FeatureExtractionPipeline | null;
  private isInitialized: boolean = false;

  constructor() {
    this.model = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Use the Xenova transformers implementation which works in the browser
      const pipe = await pipeline("feature-extraction", "law-ai/InLegalBERT");
      this.model = pipe;
      this.isInitialized = true;
    } catch (error) {
      throw new Error("Failed to initialize the InLegalBERT model");
    }
  }

  async analyze(text: string, jurisdiction: string = 'general') {
    if (!this.isInitialized) {
      throw new Error("Model not initialized. Call initialize() first.");
    }

    try {
      // Get embeddings from the model
      if (!this.model) {
        throw new Error("Model not initialized");
      }
      const result = await this.model(text, {
        pooling: "mean",
        normalize: true,
      });
      
      // In parallel, fetch real legal data related to the query
      const [caseLaw, statutes] = await Promise.all([
        fetchRelevantCaseLaw(text, jurisdiction),
        fetchRelevantStatutes(text, jurisdiction)
      ]);
      
      // Calculate legal relevance score based on similarity to legal corpus
      // This is a simplified example - in production this would use embedding similarity
      const legalRelevanceScore = this.calculateLegalRelevanceScore(result.data as Float32Array);
      
      return {
        embeddings: Array.from(result.data),
        dimensions: result.dims,
        text: text,
        legalRelevanceScore: legalRelevanceScore,
        legalSources: {
          caseLaw,
          statutes
        }
      };
    } catch (error) {
      throw new Error("Failed to analyze text with InLegalBERT");
    }
  }
  
  private calculateLegalRelevanceScore(embeddings: Float32Array): number {
    // This is a simplified example - in production we would:
    // 1. Compare embeddings to a known set of legal concepts
    // 2. Calculate cosine similarity to legal document corpus
    // 3. Use a more sophisticated algorithm to determine legal relevance
    
    // For now, using a random score between 0.6 and 0.95 for demonstration
    return 0.6 + Math.random() * 0.35;
  }
  
  /**
   * Extracts key legal entities from text
   */
  extractLegalEntities(text: string): {type: string, text: string, confidence: number}[] {
    // This function would normally use NER specifically trained on legal documents
    // For demo purposes, we'll use a simple regex-based approach
    
    const patterns = [
      { type: 'statute', regex: /\b([A-Z][a-z]+ Act( of \d{4})?)\b/g, confidence: 0.85 },
      { type: 'case', regex: /\b([A-Z][a-z]+ v\. [A-Z][a-z]+)\b/g, confidence: 0.9 },
      { type: 'court', regex: /\b(Supreme Court|District Court|Court of Appeals)\b/g, confidence: 0.95 },
      { type: 'legal_term', regex: /\b(plaintiff|defendant|tort|liability|damages|contract|negligence)\b/gi, confidence: 0.8 }
    ];
    
    const entities: {type: string, text: string, confidence: number}[] = [];
    
    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern.regex)];
      for (const match of matches) {
        entities.push({
          type: pattern.type,
          text: match[0],
          confidence: pattern.confidence
        });
      }
    }
    
    return entities;
  }
}
