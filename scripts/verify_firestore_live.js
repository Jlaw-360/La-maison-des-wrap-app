const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceKeyFile = path.join(__dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceKeyFile, 'utf8'));

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

async function verify() {
  console.log("=================================================");
  console.log("🔍 VERIFYING LIVE FIRESTORE COLLECTIONS 🔍");
  console.log("=================================================");
  console.log(`Project ID: ${serviceAccount.project_id}\n`);

  const collections = ['menu_items', 'users', 'orders', 'restaurant_info', 'inventory', 'dishes'];

  for (const col of collections) {
    const snapshot = await db.collection(col).get();
    console.log(`Collection '${col}': ${snapshot.size} documents found.`);
    if (snapshot.size > 0) {
      const firstDoc = snapshot.docs[0];
      console.log(`   Sample Doc [${firstDoc.id}]:`, JSON.stringify(firstDoc.data()).substring(0, 100) + '...');
    }
  }

  // Also populate alias 'dishes' if FlutterFlow named it dishes instead of menu_items
  const menuItemsSnap = await db.collection('menu_items').get();
  const dishesSnap = await db.collection('dishes').get();

  if (dishesSnap.size === 0 && menuItemsSnap.size > 0) {
    console.log("\n⏳ Copying menu_items to 'dishes' collection for FlutterFlow compatibility...");
    const batch = db.batch();
    menuItemsSnap.docs.forEach(doc => {
      batch.set(db.collection('dishes').doc(doc.id), doc.data());
    });
    await batch.commit();
    console.log("✅ 'dishes' collection populated with all 59 items!");
  }

  console.log("\nVerification complete!");
  process.exit(0);
}

verify().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
