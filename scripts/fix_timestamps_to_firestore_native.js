const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

const serviceKeyFile = path.join(__dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceKeyFile, 'utf8'));

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

async function fixTimestamps() {
  console.log("=================================================");
  console.log("🛠️ CONVERTING STRING DATES TO FIRESTORE NATIVE TIMESTAMPS 🛠️");
  console.log("=================================================");
  console.log(`Target Project: ${serviceAccount.project_id}\n`);

  const collections = ['menu_items', 'dishes', 'users', 'orders'];

  for (const col of collections) {
    const snapshot = await db.collection(col).get();
    console.log(`Processing collection '${col}' (${snapshot.size} documents)...`);
    
    const batch = db.batch();
    let updatedCount = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const updates = {};

      // Check created_at
      if (data.created_at) {
        if (typeof data.created_at === 'string') {
          updates.created_at = Timestamp.fromDate(new Date(data.created_at));
        }
      } else {
        updates.created_at = Timestamp.now();
      }

      // Check updated_at
      if (data.updated_at && typeof data.updated_at === 'string') {
        updates.updated_at = Timestamp.fromDate(new Date(data.updated_at));
      }

      // Check delivered_at
      if (data.delivered_at && typeof data.delivered_at === 'string') {
        updates.delivered_at = Timestamp.fromDate(new Date(data.delivered_at));
      }

      if (Object.keys(updates).length > 0) {
        batch.update(doc.ref, updates);
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      console.log(`  ✅ Updated ${updatedCount} documents in '${col}' with native Firestore DateTime!`);
    } else {
      console.log(`  ℹ️ No string timestamps found in '${col}'.`);
    }
  }

  console.log("\n🎉 ALL TIMESTAMPS CONVERTED TO NATIVE FIRESTORE DateTime!");
  process.exit(0);
}

fixTimestamps().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
