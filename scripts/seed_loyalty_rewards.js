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

const rewards = {
  "reward_drink": {
    id: "reward_drink",
    title_fr: "Boisson / Canette Gratuite",
    title_en: "Free Beverage / Can",
    points_cost: 50,
    dollar_value_cad: 2.50,
    min_paid_items_required: 1,
    min_subtotal_cad: 10.00,
    image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
    is_active: true,
    created_at: Timestamp.now()
  },
  "reward_samosas": {
    id: "reward_samosas",
    title_fr: "2 Samosas Croustillants Gratuits",
    title_en: "2 Free Crispy Samosas",
    points_cost: 80,
    dollar_value_cad: 4.00,
    min_paid_items_required: 1,
    min_subtotal_cad: 15.00,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    is_active: true,
    created_at: Timestamp.now()
  },
  "reward_wrap": {
    id: "reward_wrap",
    title_fr: "1 Wrap ou Panini au Choix Gratuit",
    title_en: "1 Free Wrap or Panini of Choice",
    points_cost: 150,
    dollar_value_cad: 9.75,
    min_paid_items_required: 1,
    min_subtotal_cad: 15.00,
    image_url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400",
    is_active: true,
    created_at: Timestamp.now()
  },
  "reward_curry_bowl": {
    id: "reward_curry_bowl",
    title_fr: "1 Grand Bol de Curry au Beurre Gratuit",
    title_en: "1 Free Large Butter Chicken Curry Bowl",
    points_cost: 250,
    dollar_value_cad: 17.65,
    min_paid_items_required: 1,
    min_subtotal_cad: 20.00,
    image_url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
    is_active: true,
    created_at: Timestamp.now()
  }
};

async function seedLoyaltyRewards() {
  console.log("=================================================");
  console.log("🎁 SEEDING LOYALTY REWARDS CATALOG TO FIRESTORE 🎁");
  console.log("=================================================");
  console.log(`Target Project: ${serviceAccount.project_id}\n`);

  const batch = db.batch();

  for (const [rewardId, rewardData] of Object.entries(rewards)) {
    const ref = db.collection('loyalty_rewards').doc(rewardId);
    batch.set(ref, rewardData, { merge: true });
    console.log(`+ Added reward: ${rewardData.title_fr} (${rewardData.points_cost} points | Min. Achat: $${rewardData.min_subtotal_cad})`);
  }

  // Also update store settings with loyalty rules
  const storeRef = db.collection('restaurant_info').doc('drummondville_main');
  batch.update(storeRef, {
    loyalty_program: {
      is_enabled: true,
      points_per_dollar_spent: 1,
      min_subtotal_to_redeem_cad: 15.00,
      min_paid_items_to_redeem: 1,
      points_expiration_months: 12
    }
  });

  await batch.commit();
  console.log("\n✅ Loyalty Rewards catalog and Store rules uploaded to Firestore!");
  process.exit(0);
}

seedLoyaltyRewards().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
