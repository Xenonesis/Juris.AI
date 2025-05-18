# Legal Advice API Documentation

This API provides legal information based on user queries using AI models. The API includes appropriate disclaimers and is designed for informational purposes only.

## Endpoint

```
POST /api/legal-advice
```

## Request Format

```json
{
  "query": "What are my rights as a tenant if my landlord hasn't fixed a water leak?",
  "provider": "mistral",
  "jurisdiction": "us"
}
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| query | string | Yes | The legal question or scenario to analyze |
| provider | string | No | The AI provider to use ("mistral" or "gemini"). Defaults to "mistral" |
| jurisdiction | string | No | The legal jurisdiction for the query (e.g., "us", "uk", "eu", "canada", "australia", "general"). Defaults to "general" |

## Response Format

```json
{
  "advice": "Legal information with appropriate disclaimers"
}
```

## Error Responses

```json
{
  "error": "Error message",
  "details": "More specific error information (if available)"
}
```

## Rate Limits

- Maximum request size: 1MB
- Maximum response size: 8MB
- Please implement appropriate rate limiting in your client applications

## Example Usage

### JavaScript/TypeScript

```javascript
async function getLegalAdvice(query, jurisdiction = 'general') {
  const response = await fetch('/api/legal-advice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      jurisdiction,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get legal advice');
  }
  
  return data.advice;
}
```

### Python

```python
import requests

def get_legal_advice(query, jurisdiction='general'):
    response = requests.post(
        'https://your-domain.com/api/legal-advice',
        json={
            'query': query,
            'jurisdiction': jurisdiction
        }
    )
    
    data = response.json()
    
    if response.status_code != 200:
        raise Exception(data.get('error', 'Failed to get legal advice'))
    
    return data['advice']
```

## Important Disclaimer

The information provided by this API is for general informational purposes only and does not constitute legal advice. Always consult with a qualified attorney for legal matters. 