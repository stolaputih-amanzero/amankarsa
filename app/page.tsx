'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { joinJourney, getJourneyDetails, getParticipantActiveJourney } from '@/actions/participant';

function LandingContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const joinJourneyId = searchParams.get('join');
  const [journeyTheme, setJourneyTheme] = useState<string | null>(null);

  useEffect(() => {
    const resolveTheme = async () => {
      if (joinJourneyId) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pending_join_journey', joinJourneyId);
        }
        const j = await getJourneyDetails(joinJourneyId);
        if (j?.theme) {
          setJourneyTheme(j.theme);
          return;
        }
      }
      // Check if there is an active journey (e.g. Sahabat Kaum Papa)
      const active = await getParticipantActiveJourney();
      if (active?.journey?.theme) {
        setJourneyTheme(active.journey.theme);
      }
    };
    resolveTheme();
  }, [joinJourneyId]);


  useEffect(() => {
    if (!loading && user) {
      const hasCompleted = typeof window !== 'undefined' && localStorage.getItem('amankarsa_onboarding_completed');
      if (hasCompleted) {
        const pendingJourney = typeof window !== 'undefined' ? sessionStorage.getItem('pending_join_journey') : null;
        if (pendingJourney) {
          sessionStorage.removeItem('pending_join_journey');
          joinJourney(pendingJourney).catch(() => {});
        }
        router.replace('/home');
      }
    }
  }, [user, loading, router]);

  const handleOnboardingComplete = async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('amankarsa_onboarding_completed', 'true');
    }
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

  const hasCompleted = typeof window !== 'undefined' && localStorage.getItem('amankarsa_onboarding_completed');
  if (user && hasCompleted) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col justify-center px-4 sm:px-6 max-w-md mx-auto relative">
      <OnboardingFlow onComplete={handleOnboardingComplete} journeyTheme={journeyTheme} />
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
