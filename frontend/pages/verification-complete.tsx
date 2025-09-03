import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function VerificationComplete() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/signup?verification=complete');
  }, [router]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>التحقق مكتمل</h1>
      <p>يتم معالجة بياناتك...</p>
      <p>سيتم توجيهك تلقائياً...</p>
    </div>
  );
}