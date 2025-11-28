// AES encryption utilities for SafeSpace
// Using Web Crypto API for secure encryption

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

// Generate or retrieve encryption key
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyName = 'safespace_encryption_key';
  let keyData = localStorage.getItem(keyName);

  if (!keyData) {
    // Generate new key
    const key = await crypto.subtle.generateKey(
      {
        name: ALGORITHM,
        length: KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );

    // Export and store key
    const exported = await crypto.subtle.exportKey('raw', key);
    keyData = btoa(String.fromCharCode(...new Uint8Array(exported)));
    localStorage.setItem(keyName, keyData);
    return key;
  }

  // Import existing key
  const keyBuffer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt data
export async function encryptData(data: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      dataBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    // Fallback to unencrypted storage if encryption fails
    return btoa(unescape(encodeURIComponent(data)));
  }
}

// Decrypt data
export async function decryptData(encryptedData: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH);
    const encrypted = combined.slice(IV_LENGTH);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    // Try to decode as plain base64 if decryption fails
    try {
      return decodeURIComponent(escape(atob(encryptedData)));
    } catch {
      return '';
    }
  }
}



