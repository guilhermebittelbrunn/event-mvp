import { enc, AES } from 'crypto-js';

const CRYPTO_KEY = process.env.CRYPTO_KEY;

/**
 * Utility function to encrypt data based on the secret key using AES 256 algorithm.
 * @param data - The data to be encrypted.
 * @returns Encrypted data in string format (Base64).
 */
export function encryptData(data: string): string {
  const ciphertext = AES.encrypt(data, CRYPTO_KEY).toString();
  return ciphertext; // Returns the encrypted data in Base64 string format.
}

/**
 * Utility function to decrypt data based on the secret key using AES 256 algorithm.
 * @param encryptedData - The data to be decrypted (Base64 encoded).
 * @returns Decrypted data in string format.
 */
export function decryptData(encryptedData: string): string {
  const bytes = AES.decrypt(encryptedData, CRYPTO_KEY);
  const decryptedData = bytes.toString(enc.Utf8);
  return decryptedData; // Returns the decrypted data in string format.
}
