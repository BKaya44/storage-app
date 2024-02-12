const db = require('../db.js');
const { doc, setDoc, collection } = require('firebase/firestore');

async function addStorage(userId, name, description, location) {
  const storageRef = doc(collection(db, 'storages'));
  await setDoc(storageRef, {
    userId,
    name,
    description,
    location,
    createdAt: new Date()
  });
}

async function getStoragesByUserId(userId) {
  const q = query(collection(db, 'storages'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const storages = [];
  querySnapshot.forEach((doc) => {
    storages.push({ id: doc.id, ...doc.data() });
  });
  return storages;
}

module.exports = { addStorage, getStoragesByUserId};