const crypto = require('crypto');

// MD5 hash oluşturma
function createMD5Hash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

// HMAC MD5 oluşturma
function createHMACMD5(data, key) {
  return crypto.createHmac('md5', key).update(data).digest('hex');
}

// Signature doğrulama
function verifySignature(data, signature, secretKey) {
  const sortedKeys = Object.keys(data).sort();
  const signString = sortedKeys.map(key => String(data[key])).join('');
  const calculatedSignature = createMD5Hash(signString + secretKey);
  return calculatedSignature === signature;
}

module.exports = {
  createMD5Hash,
  createHMACMD5,
  verifySignature
};

