const Activation = require('../models/activation.model');

async function generateUniqueCode() {
  let code;
  do {
    code = generateCode();
  } while (await isCodeExistsInDatabase(code));
  return code;
}

async function isCodeExistsInDatabase(code) {
  // check if code exists in database
  // return true if code exists, false otherwise
  let isExistCode = await Activation.findOne({ code });

  return isExistCode ? true : false;
}

function generateCode() {
  let code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

function generateExpireDate() {
  let today = new Date();
  let expire = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
  return expire;
}

function genarateRamdomPassword() {
  const alphabet =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let password = '';

  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    password += alphabet[randomIndex];
  }

  return password;
}

module.exports = {
  generateUniqueCode,
  generateExpireDate,
  genarateRamdomPassword,
};
