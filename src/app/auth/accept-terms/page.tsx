'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Import the actual component
import TermsAcceptancePageContent from './terms-content';

export default function TermsAcceptancePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    }>
      <TermsAcceptancePageContent />
    </Suspense>
  );
}
