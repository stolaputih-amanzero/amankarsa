import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { isFeatureEnabled } from '@/lib/feature-flags';

export default async function InitiatorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/');

  return (
    <div className="flex flex-col min-h-screen bg-[color:var(--color-base)] text-[color:var(--color-text-primary)]">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-[color:var(--color-base)]/80 border-b border-[color:var(--color-border)] py-4 px-6">
        <nav className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-xl text-[color:var(--color-depth)] tracking-tight">
            Jendela Gembala
          </Link>
          <div className="flex gap-6 text-sm text-[color:var(--color-text-secondary)]">
            <Link href="/dashboard" className="hover:text-[color:var(--color-depth)] transition-colors">
              Ikhtisar Musim
            </Link>
            <Link href="/setup" className="hover:text-[color:var(--color-depth)] transition-colors">
              Buat Perjalanan
            </Link>
            {isFeatureEnabled('enableInitiatorImpact') && (
              <Link href="/impact" className="hover:text-[color:var(--color-depth)] transition-colors">
                Buah Kasih
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
