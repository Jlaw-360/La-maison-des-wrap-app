/**
 * La Maison des Wraps - Direct Firestore Importer
 * Project: la-maison-des-wrap-app
 * 
 * Usage:
 * 1. Obtain your Firebase Service Account JSON from Firebase Console:
 *    https://console.firebase.google.com/u/0/project/la-maison-des-wrap-app/settings/serviceaccounts/adminsdk
 * 2. Save it as serviceAccountKey.json in this directory
 * 3. Run: node scripts/import_to_firestore.js
 */

const fs = require('fs');
const path = require('path');

const seedFile = path.join(__dirname, '../data/firestore_seed_data.json');
const serviceKeyFile = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(seedFile)) {
  console.error("❌ Seed file not found at data/firestore_seed_data.json");
  process.exit(1);
}

const seedData = JSON.parse(fs.readFileSync(seedFile, 'utf8'));

console.log("=================================================");
console.log("🔥 LA MAISON DES WRAPS - FIRESTORE DATA READY 🔥");
console.log("=================================================");
console.log(`\nProject: la-maison-des-wrap-app`);
console.log(`Total Collections: 5`);
console.log(`- menu_items: ${Object.keys(seedData.menu_items).length} items`);
console.log(`- users: ${Object.keys(seedData.users).length} profiles (Customer, Store, Driver)`);
console.log(`- orders: ${Object.keys(seedData.orders).length} sample delivery orders`);
console.log(`- restaurant_info: Drummondville 998 110e Ave configuration`);
console.log(`- inventory: 9 live ingredient stock toggles\n`);

if (!fs.existsSync(serviceKeyFile)) {
  console.log("ℹ️ To automatically batch-write these collections directly into your live Firebase Firestore:");
  console.log("1. Download your serviceAccountKey.json from:");
  console.log("   👉 https://console.firebase.google.com/u/0/project/la-maison-des-wrap-app/settings/serviceaccounts/adminsdk");
  console.log("2. Place it in the root folder of this project.");
  console.log("3. Run: npm install firebase-admin && node scripts/import_to_firestore.js\n");
} else {
  const admin = require('firebase-admin');
  const serviceAccount = require(serviceKeyFile);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();

  async function importAll() {
    console.log("⏳ Uploading collections to Firestore...");
    
    for (const [collectionName, docs] of Object.entries(seedData)) {
      console.log(`--> Uploading collection: ${collectionName}...`);
      const batch = db.batch();
      for (const [docId, docData] of Object.entries(docs)) {
        const ref = db.collection(collectionName).doc(docId);
        batch.set(ref, docData, { merge: true });
      }
      await batch.commit();
      console.log(`    ✅ Collection '${collectionName}' written successfully!`);
    }

    console.log("\n🎉 ALL FIRESTORE DATA IMPORTED SUCCESSFULLY TO la-maison-des-wrap-app!");
    process.exit(0);
  }

  importAll().catch(err => {
    console.error("❌ Error importing data:", err.message);
    process.exit(1);
  });
}
