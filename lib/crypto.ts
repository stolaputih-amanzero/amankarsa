// lib/crypto.ts
// Constitutional Guard N03: Private by Default
// Edge-safe encryption using Web Crypto API (crypto.subtle)
// No Node.js native crypto module. No plaintext storage or logging.

export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// 32-byte master key (256 bits) for AES-256-GCM
async function getMasterKey(): Promise<CryptoKey> {
  const keyMaterial = process.env.NEXT_PUBLIC_BILIK_DOA_MASTER_KEY ||
                       process.env.BILIK_DOA_MASTER_KEY ||
                       '0123456789abcdef0123456789abcdef';
  const encoder = new TextEncoder();
  const keyData = encoder.encode(keyMaterial.slice(0, 32).padEnd(32, '0'));
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface EncryptedEnvelope {
  v: 1;
  alg: 'AES-256-GCM';
  iv: string;
  data: string;
}

export async function encryptBilikDoa(text: string): Promise<string> {
  const key = await getMasterKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV recommended for AES-GCM
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const encryptedContent = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  const encryptedArray = Array.from(new Uint8Array(encryptedContent));
  const encryptedHex = encryptedArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');

  const envelope: EncryptedEnvelope = {
    v: 1,
    alg: 'AES-256-GCM',
    iv: ivHex,
    data: encryptedHex
  };
  
  return JSON.stringify(envelope);
}

export async function decryptBilikDoa(envelopeJson: string): Promise<string> {
  try {
    const envelope = JSON.parse(envelopeJson) as EncryptedEnvelope;
    if (envelope.alg !== 'AES-256-GCM' || !envelope.iv || !envelope.data) {
      throw new Error();
    }

    const key = await getMasterKey();
    const ivMatch = envelope.iv.match(/.{1,2}/g);
    const dataMatch = envelope.data.match(/.{1,2}/g);
    
    if (!ivMatch || !dataMatch) throw new Error();
    
    const iv = new Uint8Array(ivMatch.map((byte: string) => parseInt(byte, 16)));
    const encryptedData = new Uint8Array(dataMatch.map((byte: string) => parseInt(byte, 16)));

    const decryptedContent = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedContent);
  } catch {
    return "[Konten tidak dapat didekripsi]";
  }
}
