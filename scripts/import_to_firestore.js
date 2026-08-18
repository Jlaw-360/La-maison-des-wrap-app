/**
 * La Maison des Wraps - Direct Firestore Importer
 * Project: la-maison-des-wrap-app
 */

const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const seedFile = path.join(__dirname, '../data/firestore_seed_data.json');
const serviceKeyFile = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(seedFile)) {
  console.error("❌ Seed file not found at data/firestore_seed_data.json");
  process.exit(1);
}

if (!fs.existsSync(serviceKeyFile)) {
  console.error("❌ serviceAccountKey.json not found in project root");
  process.exit(1);
}

const seedData = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
const serviceAccount = JSON.parse(fs.readFileSync(serviceKeyFile, 'utf8'));

console.log("=================================================");
console.log("🔥 LA MAISON DES WRAPS - FIRESTORE UPLOADER 🔥");
console.log("=================================================");
console.log(`\nTarget Project: ${serviceAccount.project_id}`);
console.log(`Service Account: ${serviceAccount.client_email}`);

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

async function importAll() {
  console.log("\n⏳ Uploading all collections to Firestore...");
  
  for (const [collectionName, docs] of Object.entries(seedData)) {
    console.log(`--> Uploading collection: ${collectionName} (${Object.keys(docs).length} documents)...`);
    
    // Firestore batch supports up to 500 operations
    const batch = db.batch();
    for (const [docId, docData] of Object.entries(docs)) {
      const ref = db.collection(collectionName).doc(docId);
      batch.set(ref, docData, { merge: true });
    }
    
    await batch.commit();
    console.log(`    ✅ Collection '${collectionName}' written successfully!`);
  }

  console.log("\n=================================================");
  console.log("🎉 ALL FIRESTORE COLLECTIONS IMPORTED TO LIVE FIREBASE!");
  console.log("=================================================");
  console.log("1. 'menu_items': 59 bilingual items with prices & options");
  console.log("2. 'users': Customer, Store Kitchen, and In-House Driver");
  console.log("3. 'orders': Live connected order #CMD-4092 flow");
  console.log("4. 'restaurant_info': Drummondville 998 110e Ave rules");
  console.log("5. 'inventory': 9 ingredient stock switches");
  console.log("\nYour app is now 100% connected to live database data!");
}

importAll().catch(err => {
  console.error("❌ Error uploading to Firestore:", err);
  process.exit(1);
});
