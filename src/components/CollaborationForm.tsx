'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModelsDropdown } from '@/components/ui/models-dropdown';

const CollaborationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    aiProvider: '',
    selectedModel: '',
    apiKey: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitStatus('success');
        console.log('Form submitted successfully:', result);
        
        // Reset form on successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          aiProvider: '',
          selectedModel: '',
          apiKey: '',
        });
        
        alert('Form submitted successfully! We will get back to you soon.');
      } else {
        setSubmitStatus('error');
        console.error('Form submission failed:', result);
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="aiProvider">AI Model Provider</Label>
          <Select value={formData.aiProvider} onValueChange={(value) => setFormData({ ...formData, aiProvider: value, selectedModel: '' })}>
            <SelectTrigger>
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
              <SelectItem value="gemini">Google Gemini</SelectItem>
              <SelectItem value="mistral">Mistral AI</SelectItem>
              <SelectItem value="cohere">Cohere</SelectItem>
              <SelectItem value="together">Together AI</SelectItem>
              <SelectItem value="openrouter">OpenRouter</SelectItem>
              <SelectItem value="huggingface">Hugging Face</SelectItem>
              <SelectItem value="replicate">Replicate</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.aiProvider && (
          <div>
            <Label htmlFor="selectedModel">AI Model</Label>
            <ModelsDropdown
              provider={formData.aiProvider}
              apiKey={formData.apiKey || undefined}
              value={formData.selectedModel}
              onValueChange={(value) => setFormData({ ...formData, selectedModel: value })}
              placeholder="Select model"
            />
          </div>
        )}
        <div>
          <Label htmlFor="apiKey">API Key (Optional)</Label>
          <Input
            id="apiKey"
            name="apiKey"
            type="password"
            value={formData.apiKey}
            onChange={handleChange}
            placeholder="Enter your API key for live model fetching"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Provide your API key to fetch live models from the provider. Leave empty to use default models.
          </p>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
        {submitStatus === 'success' && (
          <p className="text-green-600 text-sm text-center">
            ✓ Form submitted successfully! We&apos;ll get back to you soon.
          </p>
        )}
        {submitStatus === 'error' && (
          <p className="text-red-600 text-sm text-center">
            ✗ Failed to submit form. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default CollaborationForm;