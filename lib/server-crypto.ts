// lib/server-crypto.ts
// Constitutional Guard N03: Private by Default
// Server-side Application-Level Encryption for Bilik Doa
// Runs exclusively in Next.js Server Actions (Node.js runtime). Never exposes keys to client.

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128-bit IV
const SALT = 'amankarsa-sacred-vault-salt'; // Static salt for deterministic key derivation

function getKey(secret: string) {
  // Derive 256-bit key from environment variable
  return scryptSync(secret, SALT, 32); 
}

export function encryptServer(plaintext: string, secret: string): string {
  const iv = randomBytes(IV_LENGTH);
  const key = getKey(secret);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  // Envelope format: v:1|alg:aes-256-gcm|iv:hex|tag:hex|data:hex
  return `v:1|alg:aes-256-gcm|iv:${iv.toString('hex')}|tag:${authTag.toString('hex')}|data:${encrypted}`;
}

export function decryptServer(envelope: string, secret: string): string {
  try {
    const parts = envelope.split('|');
    if (parts.length !== 5 || parts[0] !== 'v:1' || parts[1] !== 'alg:aes-256-gcm') {
      throw new Error();
    }
    
    const iv = Buffer.from(parts[2].split(':')[1], 'hex');
    const tag = Buffer.from(parts[3].split(':')[1], 'hex');
    const encrypted = parts[4].split(':')[1];
    
    const key = getKey(secret);
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch {
    return '[Konten tersimpan dalam damai]';
  }
}
