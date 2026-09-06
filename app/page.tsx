'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { joinJourney } from '@/actions/participant';

function LandingContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const joinJourneyId = searchParams.get('join');

  useEffect(() => {
    if (joinJourneyId && typeof window !== 'undefined') {
      sessionStorage.setItem('pending_join_journey', joinJourneyId);
    }
  }, [joinJourneyId]);

  useEffect(() => {
    if (!loading && user) {
      const pendingJourney = sessionStorage.getItem('pending_join_journey');
      if (pendingJourney) {
        sessionStorage.removeItem('pending_join_journey');
        joinJourney(pendingJourney).catch(() => {});
      }
      router.replace('/home');
    }
  }, [user, loading, router]);

  const handleOnboardingComplete = async () => {
    const pendingJourney = typeof window !== 'undefined' ? sessionStorage.getItem('pending_join_journey') : null;
    if (pendingJourney) {
      sessionStorage.removeItem('pending_join_journey');
      try {
        await joinJourney(pendingJourney);
      } catch {
        // Graceful continuation
      }
    }
    router.push('/home');
  };

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
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    </main>
  );
}

export default function LandingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center p-6">
          <p className="text-[color:var(--color-text-secondary)] font-serif italic animate-pulse">
            Ruang teduh sedang dipersiapkan...
          </p>
        </main>
      }
    >
      <LandingContent />
    </Suspense>
  );
}
