const { admin, db } = require('../db.js');

async function createUser(username, password, email) {
  const userRecord = await admin.auth().createUser({
    email,
    password
  });

  await db.collection('users').doc(userRecord.uid).set({
    username,
    email,
    active: true,
    verified: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return userRecord;
}

module.exports = { createUser };