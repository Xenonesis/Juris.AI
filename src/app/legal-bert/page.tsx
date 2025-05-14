"use client";

import { useState } from "react";
import { LegalBertModel } from "./model";

export default function LegalBertPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const model = new LegalBertModel();
      await model.initialize();
      const output = await model.analyze(text);
      setResult(JSON.stringify(output, null, 2));
    } catch (error) {
      console.error("Error analyzing text:", error);
      setResult("Error processing text. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">InLegalBERT Analysis</h1>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Enter legal text to analyze:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border rounded-md min-h-[150px]"
          placeholder="Enter legal text here..."
        />
      </div>
      
      <button
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
      >
        {loading ? "Processing..." : "Analyze Text"}
      </button>
      
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Analysis Result:</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[300px]">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
} 