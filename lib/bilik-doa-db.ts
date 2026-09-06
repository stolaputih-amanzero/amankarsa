// lib/bilik-doa-db.ts
// Constitutional Guard N03: Private by Default
// Data stored in IndexedDB is strictly in ENCRYPTED envelope form (encrypted_payload).
// Decrypted plaintext is never cached in IndexedDB, LocalStorage, or ServiceWorker.

import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface BilikDoaDB extends DBSchema {
  'bilik-doa-archive': {
    key: string;
    value: {
      id: string;
      encrypted_payload: string; // Encrypted AES-256-GCM envelope
      created_at: string;
    };
    indexes: { 'by-date': string };
  };
}

let dbPromise: Promise<IDBPDatabase<BilikDoaDB>> | null = null;

function getDb() {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!dbPromise) {
    dbPromise = openDB<BilikDoaDB>('amankarsa-bilik-doa', 1, {
      upgrade(db) {
        const store = db.createObjectStore('bilik-doa-archive', { keyPath: 'id' });
        store.createIndex('by-date', 'created_at');
      },
    });
  }
  return dbPromise;
}

export async function saveOfflineBilikDoa(id: string, encryptedPayload: string, createdAt: string) {
  const db = await getDb();
  if (!db) return;
  await db.put('bilik-doa-archive', { id, encrypted_payload: encryptedPayload, created_at: createdAt });
}

export async function getOfflineBilikDoaArchive() {
  const db = await getDb();
  if (!db) return [];
  const all = await db.getAllFromIndex('bilik-doa-archive', 'by-date');
  return all.reverse(); // Newest first
}
