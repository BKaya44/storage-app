const { admin, db } = require("../db.js");
const { getAuth, createUserWithEmailAndPassword } = require("firebase-admin/auth");

async function createUser(username, password, email) {
  const usersRef = db.collection("users");
  const usernameQuery = await usersRef.where("username", "==", username).get();

  if (!usernameQuery.empty) {
    return { error: true, message: "Username already exists" };
  }
  const userRecord = await admin.auth().createUser({
    email,
    password,
  });

  await db.collection("users").doc(userRecord.uid).set({
    username,
    email,
    active: true,
    verified: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return userRecord;
}

async function findUserByEmail(email) {
  const usersRef = db.collection("users");
  const query = await usersRef.where("email", "==", email).get();

  if (query.empty) {
    return { error: true, message: "Login details are incorrect" };
  }

  let userDoc = null;
  query.forEach((doc) => {
    userDoc = { uid: doc.id, ...doc.data() };
  });
  return userDoc;
}

async function verifyUserPassword(email, password) {
  const auth = getAuth();
  try {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return { valid: true, user: userCredential.user };
      })
      .catch((error) => {
        console.log(error);
        return { valid: false, error: error };
      });
  } catch (error) {
    console.log(error);
    return { valid: false, error: error.code };
  }
}

module.exports = { createUser, findUserByEmail, verifyUserPassword };
