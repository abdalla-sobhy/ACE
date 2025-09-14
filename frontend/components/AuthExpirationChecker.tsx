'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthData, removeAuthToken } from '@/lib/auth';

export default function AuthExpirationChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const authData = getAuthData();
      
      if (authData) {
        const expiryDate = new Date(authData.expiresAt);
        const now = new Date();
        
        if (now >= expiryDate) {
          // Token expired
          removeAuthToken();
          router.push('/login?expired=true');
        }
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    // Also check when user returns to tab
    const handleFocus = () => checkTokenExpiration();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [router]);

  return <>{children}</>;
}