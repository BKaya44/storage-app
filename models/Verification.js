const { doc, setDoc } = require("firebase/firestore");
const db = require('../db.js');

async function createVerification(userId, verificationText) {
  await setDoc(doc(db, "verifications", userId), {
    verificationText,
    active: true,
    createdAt: new Date()
  });
}

module.exports = { createVerification };