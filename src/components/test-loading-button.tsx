"use client";

import { useState } from 'react';
import { LoadingButton } from './ui/loading-button';
import { Send } from 'lucide-react';

export function TestLoadingButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate loading for 3 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Loading Button Test</h2>
      <p className="text-muted-foreground">
        Click the button to test loading state visibility in both light and dark modes.
      </p>
      
      <LoadingButton
        isLoading={isLoading}
        loadingText="Testing Visibility..."
        onClick={handleClick}
        className="gap-2 btn-gradient shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
      >
        Test Loading Button
        <Send className="h-4 w-4" />
      </LoadingButton>
      
      <div className="text-sm text-muted-foreground">
        {isLoading ? (
          <span className="text-blue-600 font-medium">
            ✓ Loading state active - text should be clearly visible
          </span>
        ) : (
          <span>
            Click the button to test loading visibility
          </span>
        )}
      </div>
    </div>
  );
}
