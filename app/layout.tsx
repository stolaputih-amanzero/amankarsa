import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';

export const metadata: Metadata = {
  title: 'Amankarsa — Ruang Teduh Pembentukan Iman',
  description: 'Berawal damai, berdampak nyata. Ruang pembentukan iman Kristen berbasis kasih karunia tanpa tuntutan, rasa bersalah, atau perbandingan.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="light" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
