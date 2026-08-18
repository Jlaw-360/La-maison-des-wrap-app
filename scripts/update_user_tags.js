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

// Complete User Roles and Tags Dictionary for La Maison des Wraps
const taggedUsers = {
  "usr_customer_vip": {
    uid: "usr_customer_vip",
    name: "Jean Tremblay (Client VIP)",
    email: "client.vip@lamaisondeswraps.ca",
    phone: "819 555-0192",
    role: "customer",
    user_tags: ["vip_member", "frequent_diner", "loyalty_gold", "spice_lover"],
    loyalty_points: 450,
    loyalty_tier: "Gold",
    orders_count: 14,
    preferred_language: "fr",
    dietary_preferences: ["halal", "extra_sauce_ail"],
    saved_addresses: [
      {
        label: "Maison",
        address: "1450 Rue Saint-Pierre, Drummondville, QC",
        distance_km: 3.5,
        delivery_fee_cad: 0.00,
        instructions: "Laisser à la porte (Photo requise)"
      }
    ],
    created_at: Timestamp.now()
  },

  "usr_customer_first_time": {
    uid: "usr_customer_first_time",
    name: "Sophie Gagnon (Nouveau Client)",
    email: "sophie.gagnon@exemple.com",
    phone: "819 555-0331",
    role: "customer",
    user_tags: ["first_time_customer", "welcome_promo_eligible"],
    loyalty_points: 0,
    loyalty_tier: "Bronze",
    orders_count: 0,
    preferred_language: "fr",
    saved_addresses: [
      {
        label: "Appartement",
        address: "850 Boulevard Saint-Joseph, Drummondville, QC",
        distance_km: 4.8,
        delivery_fee_cad: 0.00
      }
    ],
    created_at: Timestamp.now()
  },

  "usr_store_manager": {
    uid: "usr_store_manager",
    name: "Chef Cuisine - La Maison des Wraps",
    email: "cuisine@lamaisondeswraps.ca",
    phone: "819 850-3972",
    role: "store",
    user_tags: ["head_chef", "inventory_manager", "kitchen_operator"],
    staff_department: "Kitchen & Operations",
    store_location: "998 110e Avenue, Drummondville, QC",
    permissions: [
      "view_kitchen_kanban",
      "change_order_status",
      "toggle_86_inventory",
      "print_kitchen_tickets",
      "assign_drivers"
    ],
    created_at: Timestamp.now()
  },

  "usr_driver_express": {
    uid: "usr_driver_express",
    name: "Marc Livreur (In-House Driver)",
    email: "livreur@lamaisondeswraps.ca",
    phone: "819 555-0841",
    role: "driver",
    user_tags: ["in_house_driver", "top_rated_driver", "shift_active", "qr_scanner_enabled"],
    driver_rating: 4.95,
    deliveries_completed: 182,
    vehicle_info: {
      make: "Honda Civic",
      color: "Noir",
      plate: "QC-LMDW-99"
    },
    employment_type: "in_house_store_payroll",
    is_active_on_shift: true,
    current_coordinates: {
      latitude: 45.8828,
      longitude: -72.4842
    },
    created_at: Timestamp.now()
  },

  "usr_admin_owner": {
    uid: "usr_admin_owner",
    name: "Propriétaire - La Maison des Wraps",
    email: "admin@lamaisondeswraps.ca",
    phone: "819 850-3972",
    role: "admin",
    user_tags: ["super_admin", "owner", "financial_analytics", "menu_manager"],
    permissions: ["all_access"],
    created_at: Timestamp.now()
  }
};

async function createTaggedUsers() {
  console.log("=================================================");
  console.log("👥 CONFIGURING USER TAGS & PROFILES IN FIRESTORE 👥");
  console.log("=================================================");
  console.log(`Target Project: ${serviceAccount.project_id}\n`);

  const batch = db.batch();

  for (const [userId, userData] of Object.entries(taggedUsers)) {
    const userRef = db.collection('users').doc(userId);
    batch.set(userRef, userData, { merge: true });
    console.log(`+ Added user: ${userData.name} with tags: [${userData.user_tags.join(', ')}]`);
  }

  await batch.commit();

  console.log("\n=================================================");
  console.log("🎉 ALL USER ROLES AND TAGS SUCCESSFULLY CREATED!");
  console.log("=================================================");
  console.log("1. 'customer' (VIP Member with Gold Tier)");
  console.log("2. 'customer' (First Time / New Signup)");
  console.log("3. 'store' (Head Chef with Kanban & Stock Controls)");
  console.log("4. 'driver' (In-House Driver with Live Shift & QR Scan)");
  console.log("5. 'admin' (Owner with Full Access & Reports)");

  process.exit(0);
}

createTaggedUsers().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
