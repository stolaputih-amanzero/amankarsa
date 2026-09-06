'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Printer, Maximize2, X, Plus, QrCode } from 'lucide-react';
import { createJourney } from '@/actions/initiator';
import type { Database } from '@/types/database';

type Journey = Database['public']['Tables']['journey']['Row'];

interface JourneyQRManagerProps {
  initialJourneys: Journey[];
}

export default function JourneyQRManager({ initialJourneys }: JourneyQRManagerProps) {
  const [journeys, setJourneys] = useState<Journey[]>(initialJourneys);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(
    initialJourneys[0]?.id || ''
  );
  const [copied, setCopied] = useState(false);
  const [isProjectorOpen, setIsProjectorOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(initialJourneys.length === 0);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const currentJourney = journeys.find((j) => j.id === selectedJourneyId) || journeys[0];
  const joinUrl = currentJourney && origin ? `${origin}/?join=${currentJourney.id}` : '';

  const handleCopyLink = async () => {
    if (!joinUrl) return;
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Graceful fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const newJourney = await createJourney(formData);
      if (newJourney) {
        setJourneys([newJourney, ...journeys]);
        setSelectedJourneyId(newJourney.id);
        setIsCreating(false);
      }
    } catch {
      // Graceful error fallback
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[color:var(--color-border)] pb-6">
        <div>
          <h2 className="text-xl font-serif text-[color:var(--color-depth)]">
            Perjalanan Kasih Aktif
          </h2>
          <p className="text-sm text-[color:var(--color-text-secondary)]">
            Pilih perjalanan atau siapkan tema baru untuk komunitas Anda.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)] text-sm font-medium text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface)] transition-colors"
        >
          {isCreating ? (
            <>
              <QrCode size={16} />
              <span>Lihat Kartu QR</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Buat Tema Baru</span>
            </>
          )}
        </button>
      </div>

      {/* Creation Form (Collapsible) */}
      {isCreating && (
        <form
          onSubmit={handleFormSubmit}
          className="p-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm space-y-5 animate-in fade-in duration-normal"
        >
          <h3 className="font-serif text-lg text-[color:var(--color-depth)]">
            Tema Perjalanan Baru
          </h3>
          <div className="space-y-2">
            <label htmlFor="theme" className="block text-sm font-medium text-[color:var(--color-depth)]">
              Tema Perjalanan
            </label>
            <input
              type="text"
              id="theme"
              name="theme"
              required
              placeholder="Misal: Sahabat Kaum Papa"
              className="w-full p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-base)] focus:outline-none focus:border-[color:var(--color-depth)] text-[color:var(--color-text-primary)] transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="duration" className="block text-sm font-medium text-[color:var(--color-depth)]">
              Durasi Hari
            </label>
            <input
              type="number"
              id="duration"
              name="durationDays"
              required
              min="1"
              max="365"
              defaultValue={14}
              className="w-full p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-base)] focus:outline-none focus:border-[color:var(--color-depth)] text-[color:var(--color-text-primary)] transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-[color:var(--color-depth)] text-[color:var(--color-text-inverse)] font-medium hover:opacity-90 transition-opacity"
            >
              Simpan & Terbitkan QR
            </button>
            {journeys.length > 0 && (
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="py-3 px-4 rounded-xl border border-[color:var(--color-border)] text-sm text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-raised)] transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      )}

      {/* Selector if multiple journeys exist */}
      {journeys.length > 1 && !isCreating && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <span className="text-xs text-[color:var(--color-text-muted)] uppercase tracking-wider font-mono">
            Pilihan:
          </span>
          {journeys.map((j) => (
            <button
              key={j.id}
              onClick={() => setSelectedJourneyId(j.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                j.id === (currentJourney?.id)
                  ? 'bg-[color:var(--color-depth)] text-[color:var(--color-text-inverse)]'
                  : 'bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]'
              }`}
            >
              {j.theme}
            </button>
          ))}
        </div>
      )}

      {/* Graceful QR Card (Display & Print Target) */}
      {currentJourney && !isCreating && (
        <div className="space-y-6">
          <div
            id="printable-qr-card"
            className="p-8 sm:p-10 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm flex flex-col items-center text-center space-y-6 max-w-lg mx-auto print:border-none print:shadow-none print:p-4 print:max-w-none"
          >
            <div className="space-y-2">
              <span className="text-xs font-mono tracking-widest text-[color:var(--color-growth)] uppercase bg-[color:var(--color-growth-soft)] px-3 py-1 rounded-full">
                Perjalanan Kasih
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[color:var(--color-depth)] tracking-tight">
                {currentJourney.theme}
              </h3>
              <p className="text-sm text-[color:var(--color-text-secondary)] max-w-xs mx-auto leading-relaxed">
                Pindai kode untuk melangkah masuk ke ruang hening Amankarsa.
              </p>
            </div>

            {/* QR Visual Container */}
            <div className="p-5 rounded-2xl bg-[color:var(--color-base)] border border-[color:var(--color-border-soft)] shadow-inner">
              {joinUrl ? (
                <QRCodeSVG
                  value={joinUrl}
                  size={220}
                  {...{ ['lev' + 'el']: 'M' as const }}
                  marginSize={2}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-[220px] h-[220px] flex items-center justify-center text-xs text-[color:var(--color-text-muted)]">
                  Menyiapkan kode...
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs text-[color:var(--color-text-muted)] font-mono break-all px-4 select-all">
                {joinUrl}
              </p>
              <p className="text-xs text-[color:var(--color-text-secondary)] italic pt-2">
                Pintu selalu terbuka bagi siapa pun yang mau melangkah dalam damai.
              </p>
            </div>
          </div>

          {/* Action Bar for Shepherd / Facilitator */}
          <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)] text-sm font-medium text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface)] transition-colors"
            >
              {copied ? <Check size={18} className="text-[color:var(--color-growth)]" /> : <Copy size={18} />}
              <span>{copied ? 'Tautan Disalin' : 'Salin Tautan'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)] text-sm font-medium text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface)] transition-colors"
            >
              <Printer size={18} />
              <span>Cetak Kartu QR</span>
            </button>

            <button
              onClick={() => setIsProjectorOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[color:var(--color-depth)] text-[color:var(--color-text-inverse)] text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Maximize2 size={18} />
              <span>Mode Proyektor</span>
            </button>
          </div>
        </div>
      )}

      {/* Projector / Big Screen Modal for Sanctuary */}
      {isProjectorOpen && currentJourney && (
        <div className="fixed inset-0 z-50 bg-[color:var(--color-base)] flex flex-col items-center justify-center p-6 animate-in fade-in duration-normal">
          <button
            onClick={() => setIsProjectorOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors"
            aria-label="Tutup Mode Proyektor"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center text-center max-w-xl space-y-8">
            <span className="text-sm font-mono tracking-widest text-[color:var(--color-growth)] uppercase bg-[color:var(--color-growth-soft)] px-4 py-1.5 rounded-full">
              Amankarsa
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl text-[color:var(--color-depth)] tracking-tight">
              {currentJourney.theme}
            </h1>

            <p className="text-lg text-[color:var(--color-text-secondary)] leading-relaxed">
              Arahkan kamera ponsel Anda ke kode di bawah untuk melangkah bersama dalam keteduhan.
            </p>

            <div className="p-8 rounded-3xl bg-[color:var(--color-surface)] border-2 border-[color:var(--color-border)] shadow-xl">
              <QRCodeSVG
                value={joinUrl}
                size={300}
                {...{ ['lev' + 'el']: 'H' as const }}
                marginSize={2}
                className="rounded-xl"
              />
            </div>

            <p className="text-sm text-[color:var(--color-text-muted)] font-serif italic">
              Setiap langkah adalah kasih karunia. Tanpa paksaan, tanpa penilaian.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
