'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main page since landing is now the default for non-logged users
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
};

export default LandingPage;
