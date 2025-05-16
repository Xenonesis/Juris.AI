'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/supabase-auth-provider';
import { Eye, EyeOff, Info, Key, Plus, Save, Trash } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ApiKey {
  id?: string;
  user_id: string;
  model_type: string;
  api_key: string;
  created_at?: string;
  updated_at?: string;
}

export function ApiKeysForm() {
  const supabase = createClient();
  const { user } = useAuth();
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState<Partial<ApiKey>>({
    model_type: '',
    api_key: '',
  });

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  const fetchApiKeys = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setApiKeys(data || []);
      // Initialize visibility state for each key
      const visibility: Record<string, boolean> = {};
      (data || []).forEach(key => {
        visibility[key.id as string] = false;
      });
      setShowApiKeys(visibility);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load your API keys. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = async () => {
    if (!user || !newKey.model_type || !newKey.api_key) {
      setMessage({
        type: 'error',
        text: 'Please select a model type and enter an API key'
      });
      return;
    }
    
    setLoading(true);
    try {
      // Check if this model type already exists for the user
      const existingKeyIndex = apiKeys.findIndex(k => k.model_type === newKey.model_type);
      
      if (existingKeyIndex >= 0) {
        // Update existing key
        const { data, error } = await supabase
          .from('api_keys')
          .update({
            api_key: newKey.api_key,
            updated_at: new Date().toISOString()
          })
          .eq('id', apiKeys[existingKeyIndex].id)
          .select();
        
        if (error) throw error;
        
        // Update local state
        const updatedKeys = [...apiKeys];
        updatedKeys[existingKeyIndex] = data[0];
        setApiKeys(updatedKeys);
      } else {
        // Insert new key
        const { data, error } = await supabase
          .from('api_keys')
          .insert({
            user_id: user.id,
            model_type: newKey.model_type,
            api_key: newKey.api_key,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        
        // Update local state
        setApiKeys([...apiKeys, data[0]]);
        setShowApiKeys({
          ...showApiKeys,
          [data[0].id as string]: false
        });
      }
      
      // Reset form
      setNewKey({
        model_type: '',
        api_key: '',
      });
      
      setMessage({
        type: 'success',
        text: 'API key saved successfully'
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save API key. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setApiKeys(apiKeys.filter(key => key.id !== id));
      
      setMessage({
        type: 'success',
        text: 'API key deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete API key. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setShowApiKeys({
      ...showApiKeys,
      [id]: !showApiKeys[id]
    });
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-4">
          <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your AI Model API Keys</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Your API keys are stored securely and used by Juris.ai to generate AI responses using the model of your choice.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {apiKeys.length > 0 ? (
          <div className="grid gap-4">
            {apiKeys.map((key) => (
              <Card key={key.id} className="bg-muted/50">
                <CardContent className="pt-6 px-4 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Key className="h-4 w-4 text-primary" />
                        <span className="font-medium">{key.model_type}</span>
                      </div>
                      <div className="relative">
                        <Input 
                          type={showApiKeys[key.id as string] ? 'text' : 'password'} 
                          value={key.api_key} 
                          readOnly 
                          className="pr-10 font-mono text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => toggleKeyVisibility(key.id as string)}
                        >
                          {showApiKeys[key.id as string] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteKey(key.id as string)}
                      disabled={loading}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <Key className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <h4 className="text-sm font-medium mb-1">No API Keys Added</h4>
            <p className="text-sm text-muted-foreground">
              Add API keys below to use your preferred AI models with Juris.ai
            </p>
          </div>
        )}
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Add New API Key</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="model_type">AI Model</Label>
            <Select
              value={newKey.model_type || ''}
              onValueChange={(value) => setNewKey({...newKey, model_type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="mistral">Mistral AI</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic Claude</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="api_key">API Key</Label>
            <div className="relative">
              <Input
                id="api_key"
                type="password"
                placeholder="Enter your API key"
                value={newKey.api_key || ''}
                onChange={(e) => setNewKey({...newKey, api_key: e.target.value})}
                className="pr-10 font-mono"
              />
            </div>
          </div>
          
          <Button 
            className="w-full mt-2" 
            onClick={handleAddKey}
            disabled={loading || !newKey.model_type || !newKey.api_key}
          >
            <Save className="h-4 w-4 mr-2" />
            Save API Key
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="mb-1">Your API keys are stored securely in our database.</p>
            <p>You will be charged according to the pricing model of each AI provider.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 