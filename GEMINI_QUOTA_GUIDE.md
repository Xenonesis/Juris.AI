# Gemini API Quota Management & Troubleshooting

This document provides comprehensive guidance on managing Google Gemini API quotas and resolving quota exceeded errors.

## 🚨 Common Error: Quota Exceeded

### Error Message
```
[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: [429] You exceeded your current quota, please check your plan and billing details.
```

### Understanding the Error
- **Error Code**: HTTP 429 (Too Many Requests)
- **Cause**: Exceeded the free tier limit of 50 requests per day
- **Model**: `gemini-1.5-flash` (optimized for lower quota usage)

## 🔧 Immediate Solutions

### 1. Switch to Another AI Model ⚡
**Fastest Fix**: Use the model selector dropdown to switch to:
- **Mistral AI** (Recommended alternative)
- **OpenAI GPT-4** (Requires API key)
- **Anthropic Claude** (Requires API key)

### 2. Add Your Own Gemini API Key 🔑

#### Step-by-Step Guide:
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key for your project
5. Copy the generated key (starts with `AIza...`)
6. In Juris.AI:
   - Go to **Profile** → **API Keys**
   - Select "Google Gemini" as provider
   - Paste your API key
   - Save the configuration

#### Benefits of Personal API Key:
- ✅ Your own 50 requests/day quota
- ✅ No sharing with other users
- ✅ Potential for higher quotas with paid plans
- ✅ Better rate limiting control

### 3. Wait for Quota Reset ⏰
- **Free Tier Reset**: Every 24 hours at midnight UTC
- **Check Reset Time**: Error message shows retry delay
- **Alternative**: Use other models while waiting

## 🔄 Automatic Fallback System

Juris.AI includes intelligent fallback when Gemini quota is exceeded:

```
Gemini (quota exceeded) → Mistral AI → OpenAI → Claude
```

### How It Works:
1. **Detection**: System detects 429 quota error
2. **Fallback**: Automatically tries next available model
3. **Notification**: User informed about the switch
4. **Seamless**: No interruption to your legal research

## 📊 Quota Monitoring

### Real-Time Tracking
- **Visual Indicator**: Progress bar showing quota usage
- **Smart Alerts**: Warnings at 75% and 90% usage
- **Reset Timer**: Shows time until quota refreshes
- **Provider Status**: Color-coded status for each AI provider

### Quota Limits by Tier

| Tier | Requests/Day | Requests/Minute | Cost |
|------|-------------|-----------------|------|
| **Free** | 50 | Rate limited | Free |
| **Pay-per-use** | 1,500 | 15 | $0.075/1K tokens |
| **Paid** | Higher limits | 60+ | Various plans |

## 🚀 Upgrading Your Gemini Plan

### Free → Paid Transition:
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Go to "Billing" in the left sidebar
3. Set up billing account
4. Choose pay-per-use or monthly plan
5. Your quotas automatically increase

### Benefits of Upgrading:
- 🚀 **Higher Quotas**: Up to 1,500 requests/day
- ⚡ **Faster Processing**: Higher rate limits
- 🎯 **Priority Access**: Better availability
- 📈 **Advanced Features**: Access to newer models

## 💡 Best Practices

### Optimize Your Usage:
1. **Use Caching**: Avoid repeat queries for same questions
2. **Batch Operations**: Combine related questions
3. **Choose Right Model**: Use Flash for speed, Pro for complex queries
4. **Monitor Usage**: Check quota status regularly
5. **Personal Keys**: Use your own API keys for dedicated quotas

### Multi-Model Strategy:
- **Gemini**: Great for general legal questions
- **Mistral**: Excellent for European law
- **OpenAI**: Strong analytical capabilities
- **Claude**: Best for complex legal reasoning

## 🔍 Troubleshooting

### Error: "API key not valid"
```bash
# Check your API key format
echo "Your key should start with: AIza..."

# Test your key
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
```

### Error: Still getting 429 with personal key
- **Verify**: Key is correctly entered in Profile settings
- **Check**: Your personal quota at Google AI Studio
- **Wait**: If you also hit your personal limit

### Model Switching Issues
- **Clear Cache**: Refresh the page
- **Check Keys**: Ensure target model has valid API key
- **Fallback Order**: System tries: Mistral → OpenAI → Claude

## 📞 Support

### Need Help?
1. **Check Quota Status**: Look for quota indicators in the UI
2. **Try Alternative**: Switch to Mistral or OpenAI
3. **Documentation**: Review this guide for solutions
4. **Community**: Ask in project discussions

### Quick Commands for Developers:
```bash
# Check current quota usage
npm run quota:check

# Reset local quota tracking
npm run quota:reset

# Test all API connections
npm run test:api-keys
```

---

*This guide is updated regularly. Last updated: September 2025*