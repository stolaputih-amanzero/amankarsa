'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/home');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-[color:var(--color-text-secondary)] font-serif italic animate-pulse">
          Ruang teduh sedang dipersiapkan...
        </p>
      </main>
    );
  }

  if (user) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col justify-center px-4 sm:px-6 max-w-md mx-auto relative">
      <OnboardingFlow onComplete={() => router.push('/home')} />
    </main>
  );
}
