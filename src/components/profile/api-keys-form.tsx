'use client';

import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Added CardFooter
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/supabase-auth-provider';
import { Eye, EyeOff, Info, Key, Plus, Save, Trash, Copy, Check } from 'lucide-react'; // Added Copy and Check
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge'; // Added Badge

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
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null); // State for copy feedback
  const [newKey, setNewKey] = useState<Partial<ApiKey>>({
    model_type: '',
    api_key: '',
  });

  const fetchApiKeys = useCallback(async () => { // Wrapped in useCallback
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
  }, [user, supabase]); // Added supabase to dependency array

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user, fetchApiKeys]); // Added fetchApiKeys to dependency array

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
    
    // Optimistic update: remove key from UI immediately
    const originalApiKeys = [...apiKeys];
    setApiKeys(apiKeys.filter(key => key.id !== id));
    setMessage(null); // Clear previous messages

    setLoading(true);
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);
      
      if (error) {
        // Revert optimistic update if error occurs
        setApiKeys(originalApiKeys);
        throw error;
      }
      
      setMessage({
        type: 'success',
        text: 'API key deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      // Revert optimistic update if error occurs (if not already reverted)
      if (apiKeys.length !== originalApiKeys.length) {
        setApiKeys(originalApiKeys);
      }
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

  const handleCopyKey = (apiKey: string, id: string) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKeyId(id);
    setMessage({ type: 'success', text: 'API Key copied to clipboard!' });
    setTimeout(() => {
      setCopiedKeyId(null);
      setMessage(null); // Clear message after a few seconds
    }, 2000);
  };

  return (
    <div className="space-y-8"> {/* Increased spacing */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-6 transition-all duration-300 ease-in-out"> {/* Increased bottom margin */}
          <AlertTitle>{message.type === 'success' ? 'Success!' : 'Error'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      
      <Card className="shadow-lg border-border/40"> {/* Added shadow and border */}
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2"> {/* Increased size and added gap */}
              <Key className="h-6 w-6 text-primary" /> {/* Made icon larger */}
              Your AI Model API Keys
            </CardTitle>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Info className="h-5 w-5" /> {/* Made icon larger */}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs bg-popover text-popover-foreground p-3 rounded-md shadow-lg"> {/* Styled tooltip */}
                  <p>
                    Manage your API keys for various AI models. These keys are stored securely and enable Juris.ai to provide AI-powered features.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription className="mt-1"> {/* Added margin top */}
            Add, view, or remove API keys for services like OpenAI, Gemini, etc.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6"> {/* Increased spacing */}
          {apiKeys.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2"> {/* Changed to 2 columns on medium screens and increased gap */}
              {apiKeys.map((key) => (
                <Card key={key.id} className="bg-card border border-border/30 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"> {/* Added border and shadow effects */}
                  <CardHeader className="pb-3"> {/* Reduced padding bottom */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-primary" /> {/* Made icon larger */}
                        <span className="font-semibold text-lg text-foreground">{key.model_type}</span> {/* Increased font size and weight */}
                      </div>
                      <Badge variant={showApiKeys[key.id as string] ? "secondary" : "outline"} className="text-xs">
                        {showApiKeys[key.id as string] ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3"> {/* Added spacing */}
                    <div className="relative flex items-center">
                      <Input 
                        type={showApiKeys[key.id as string] ? 'text' : 'password'} 
                        value={key.api_key} 
                        readOnly 
                        className="pr-20 font-mono text-sm bg-muted/30 border-border/50 focus-visible:ring-primary/50" // Added background and focus style
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground" // Adjusted size and colors
                                onClick={() => toggleKeyVisibility(key.id as string)}
                              >
                                {showApiKeys[key.id as string] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{showApiKeys[key.id as string] ? "Hide" : "Show"} Key</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground" // Adjusted size and colors
                                onClick={() => handleCopyKey(key.api_key, key.id as string)}
                              >
                                {copiedKeyId === key.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>Copy Key</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    {key.updated_at && (
                      <p className="text-xs text-muted-foreground">
                        Last updated: {new Date(key.updated_at).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="pt-4 flex justify-end"> {/* Added padding top and alignment */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteKey(key.id as string)}
                      disabled={loading}
                      className="group hover:bg-destructive/90 transition-colors" // Added hover effect
                    >
                      <Trash className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> {/* Added hover effect */}
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-muted/20 border border-dashed border-border/50 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[200px]"> {/* Enhanced empty state styling */}
              <Key className="h-12 w-12 text-muted-foreground mb-4" /> {/* Made icon larger */}
              <h4 className="text-lg font-semibold mb-2 text-foreground">No API Keys Yet</h4> {/* Increased font size */}
              <p className="text-sm text-muted-foreground max-w-xs">
                You haven&apos;t added any API keys. Add one below to connect your preferred AI models with Juris.ai.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg border-border/40"> {/* Added shadow and border */}
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2"> {/* Increased size and added gap */}
            <Plus className="h-6 w-6 text-primary" /> {/* Made icon larger */}
            Add or Update API Key
          </CardTitle>
          <CardDescription className="mt-1"> {/* Added margin top */}
            Provide your API key for a specific AI model. If a key for the selected model already exists, it will be updated.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6"> {/* Increased gap */}
          <div>
            <Label htmlFor="model_type" className="font-semibold text-foreground">AI Model Provider</Label> {/* Styled label */}
            <Select
              value={newKey.model_type || ''}
              onValueChange={(value) => {
                setNewKey({...newKey, model_type: value });
                setMessage(null); // Clear message on model change
              }}
            >
              <SelectTrigger className="mt-1 bg-input border-border/50 focus:border-primary focus:ring-primary/50"> {/* Styled trigger */}
                <SelectValue placeholder="Select AI model provider" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border/50"> {/* Styled content */}
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="mistral">Mistral AI</SelectItem>
                <SelectItem value="openai">OpenAI (GPT Models)</SelectItem>
                <SelectItem value="anthropic">Anthropic Claude</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="api_key" className="font-semibold text-foreground">API Key</Label> {/* Styled label */}
            <div className="relative mt-1">
              <Input
                id="api_key"
                type="password" // Keep as password for security
                placeholder="Enter your API key here"
                value={newKey.api_key || ''}
                onChange={(e) => {
                  setNewKey({...newKey, api_key: e.target.value});
                  setMessage(null); // Clear message on input change
                }}
                className="pr-10 font-mono bg-input border-border/50 focus:border-primary focus:ring-primary/50" // Styled input
              />
              {/* It's generally better not to have a show/hide toggle for the *new* key input for simplicity and security focus during input */}
            </div>
            {newKey.model_type && apiKeys.find(k => k.model_type === newKey.model_type) && (
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                <Info className="h-3 w-3 inline mr-1" />
                An API key for {newKey.model_type} already exists. Saving will update the existing key.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t border-border/30 pt-6"> {/* Added border and padding */}
          <Button 
            className="w-full sm:w-auto group transition-all duration-300 ease-in-out hover:shadow-md" // Responsive width and hover effects
            onClick={handleAddKey}
            disabled={loading || !newKey.model_type || !newKey.api_key}
          >
            <Save className="h-5 w-5 mr-2 group-hover:animate-pulse" /> {/* Made icon larger and added hover animation */}
            {loading ? 'Saving...' : (apiKeys.find(k => k.model_type === newKey.model_type) ? 'Update Key' : 'Save New Key')}
          </Button>
        </CardFooter>
      </Card>
      
      <Alert variant="default" className="bg-muted/30 border-primary/20"> {/* Styled alert */}
        <Info className="h-5 w-5 text-primary" /> {/* Made icon larger */}
        <AlertTitle className="font-semibold text-foreground">Important Information</AlertTitle> {/* Styled title */}
        <AlertDescription className="text-muted-foreground space-y-1 mt-1"> {/* Added spacing and margin */}
          <p>Your API keys are encrypted and stored securely in our database.</p>
          <p>Usage of these keys will be subject to the pricing and terms of service of the respective AI model providers (e.g., Google, OpenAI).</p>
          <p>Ensure your keys have the necessary permissions and quotas for the intended use with Juris.ai.</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}