'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    // Redirect based on user type
    switch (user.type) {
      case 'student':
        router.push('/student/dashboard');
        break;
      case 'teacher':
        router.push('/teacher/dashboard');
        break;
      case 'parent':
        router.push('/parent/dashboard');
        break;
      default:
        router.push('/login');
    }
  }, [router]);
}