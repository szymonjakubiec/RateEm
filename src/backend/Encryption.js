const CryptoJS = require("crypto-js");

const key = "kvsincfsbcdysukbcvdskncudfh";

/**
 * Encryptes given text.
 *
 * @function
 * @param {string} string - text to encrypt
 * @returns {string} encrypted text
 */
export function encrypt(string) {
  return CryptoJS.AES.encrypt(string, key).toString();
}

/**
 * Decryptes given text.
 *
 * @function
 * @param {string} string - text to decrypt
 * @returns {string} decrypted text
 */
export function decrypt(string) {
  return CryptoJS.AES.decrypt(string, key).toString(CryptoJS.enc.Utf8);
}
