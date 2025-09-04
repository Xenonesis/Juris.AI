import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Log the collaboration request with AI model information
    console.log('Collaboration Form Submission:', {
      name,
      email,
      subject,
      message,
      aiProvider: body.aiProvider || 'Not specified',
      selectedModel: body.selectedModel || 'Not specified',
      hasApiKey: !!body.apiKey,
      timestamp: new Date().toISOString()
    });
    
    // Here you would typically:
    // 1. Save to database
    // 2. Send email notifications
    // 3. Create a ticket in your support system
    // 4. Validate the AI model configuration if provided
    
    if (body.aiProvider && body.selectedModel) {
      console.log('AI Model Configuration Received:', {
        provider: body.aiProvider,
        model: body.selectedModel,
        hasCustomApiKey: !!body.apiKey
      });
      
      // You could validate the API key and model availability here
      if (body.apiKey) {
        console.log('Custom API key provided for live model access');
      }
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({
      success: true,
      message: 'Collaboration request submitted successfully',
      data: {
        id: `collab_${Date.now()}`,
        status: 'received',
        aiConfiguration: body.aiProvider ? {
          provider: body.aiProvider,
          model: body.selectedModel,
          hasCustomKey: !!body.apiKey
        } : null
      }
    });
    
  } catch (error) {
    console.error('Error processing collaboration form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Collaboration API endpoint',
    availableProviders: ['openai', 'anthropic', 'gemini', 'mistral', 'openrouter', 'custom'],
    supportedMethods: ['POST']
  });
}