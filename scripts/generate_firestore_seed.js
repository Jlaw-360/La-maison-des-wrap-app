const fs = require('fs');
const path = require('path');

// Load complete 59-item parsed menu
const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/menu.json'), 'utf8'));

const firestoreData = {
  restaurant_info: {
    "drummondville_main": {
      name: "La Maison des Wraps",
      tagline: "Saveurs de l'Inde - Wraps, Kebabs, Curry & Poutines",
      address: "998 110e Avenue",
      city: "Drummondville",
      province: "QC",
      postal_code: "J2B 6X2",
      phone: "819 850-3972",
      website: "https://www.lamaisondeswraps.ca",
      coordinates: {
        latitude: 45.8828,
        longitude: -72.4842
      },
      delivery_mode: "in_house_delivery",
      delivery_fee_cad: 3.50,
      free_delivery_threshold_cad: 45.00,
      taxes: {
        tps_rate: 0.05,
        tvq_rate: 0.09975
      },
      operating_hours: {
        monday: "11:00 - 22:00",
        tuesday: "11:00 - 22:00",
        wednesday: "11:00 - 22:00",
        thursday: "11:00 - 23:00",
        friday: "11:00 - 23:00",
        saturday: "11:00 - 23:00",
        sunday: "12:00 - 22:00"
      }
    }
  },

  users: {
    "usr_customer_demo": {
      uid: "usr_customer_demo",
      name: "Jean Tremblay",
      email: "client@lamaisondeswraps.ca",
      phone: "819 555-0192",
      role: "customer",
      preferred_language: "fr",
      saved_addresses: [
        {
          label: "Maison",
          address: "1450 Rue Saint-Pierre, Drummondville, QC",
          instructions: "Laisser à la porte (Photo requise)"
        }
      ],
      created_at: new Date().toISOString()
    },
    "usr_store_manager": {
      uid: "usr_store_manager",
      name: "Chef Cuisine - La Maison des Wraps",
      email: "cuisine@lamaisondeswraps.ca",
      phone: "819 850-3972",
      role: "store",
      store_location: "998 110e Avenue, Drummondville, QC",
      created_at: new Date().toISOString()
    },
    "usr_driver_express": {
      uid: "usr_driver_express",
      name: "Marc Livreur (In-House)",
      email: "livreur@lamaisondeswraps.ca",
      phone: "819 555-0841",
      role: "driver",
      vehicle: "Honda Civic (Noir) - QC",
      delivery_mode: "in_house_store_driver",
      is_active: true,
      current_location: {
        latitude: 45.8828,
        longitude: -72.4842
      },
      created_at: new Date().toISOString()
    }
  },

  menu_items: {},

  orders: {
    "CMD-4092": {
      order_id: "CMD-4092",
      customer_uid: "usr_customer_demo",
      customer_name: "Jean Tremblay",
      customer_phone: "819 555-0192",
      delivery_address: "1450 Rue Saint-Pierre, Drummondville, QC",
      dropoff_mode: "leave_at_door",
      store_id: "drummondville_main",
      driver_uid: "usr_driver_express",
      driver_name: "Marc Livreur",
      status: "out_for_delivery", // 'received', 'preparing', 'ready', 'out_for_delivery', 'delivered'
      order_items: [
        {
          item_name_fr: "Kebab au Poulet",
          item_name_en: "Chicken Kebab Wrap",
          quantity: 2,
          bread_type: "Pain Naan (+2.00$)",
          format: "Trio (+5.30$)",
          side_choice: "Frites",
          drink_choice: "Canette Coca-Cola",
          sauces: ["Sauce à l'Ail", "Harissa"],
          extras: ["Extra Œuf (+0.99$)"],
          unit_price: 17.24,
          line_total: 34.48
        },
        {
          item_name_fr: "Lassi Mangue",
          item_name_en: "Mango Lassi",
          quantity: 1,
          unit_price: 4.50,
          line_total: 4.50
        }
      ],
      pricing: {
        subtotal: 38.98,
        delivery_fee: 3.50,
        tps_5: 2.12,
        tvq_9975: 4.24,
        grand_total: 48.84
      },
      payment: {
        method: "credit_card",
        provider: "stripe",
        status: "paid",
        transaction_id: "txn_demo_4092"
      },
      timestamps: {
        created_at: new Date(Date.now() - 25 * 60000).toISOString(),
        kitchen_accepted_at: new Date(Date.now() - 20 * 60000).toISOString(),
        ready_at: new Date(Date.now() - 10 * 60000).toISOString(),
        picked_up_at: new Date(Date.now() - 5 * 60000).toISOString(),
        estimated_delivery: new Date(Date.now() + 10 * 60000).toISOString()
      },
      qr_code_token: "LMDW-CMD-4092-TOKEN"
    }
  },

  inventory: {
    "pain_kebab": { name: "Pain Kebab", in_stock: true, category: "bread" },
    "pain_tortilla": { name: "Pain Tortilla", in_stock: true, category: "bread" },
    "pain_naan": { name: "Pain Naan", in_stock: true, category: "bread" },
    "poulet_kebab": { name: "Poulet Kebab", in_stock: true, category: "meat" },
    "poulet_tikka": { name: "Poulet Tikka", in_stock: true, category: "meat" },
    "steak_boeuf": { name: "Steak de Bœuf", in_stock: true, category: "meat" },
    "sauce_ail": { name: "Sauce à l'Ail", in_stock: true, category: "sauce" },
    "sauce_harissa": { name: "Sauce Harissa", in_stock: true, category: "sauce" },
    "fromage_couic": { name: "Fromage en Grains (Poutine)", in_stock: true, category: "poutine" }
  }
};

// Populate 59 menu items into firestoreData
menuData.forEach((item, index) => {
  const docId = `item_${(index + 1).toString().padStart(3, '0')}`;
  firestoreData.menu_items[docId] = {
    id: docId,
    item_name_fr: item.item_name_fr,
    item_name_en: item.item_name_en,
    category_fr: item.category_fr,
    category_en: item.category_en,
    description_fr: item.description_fr,
    description_en: item.description_en,
    base_price_cad: parseFloat(item.base_price_cad || 8.95),
    price_seul: parseFloat(item.price_seul || item.base_price_cad || 8.95),
    price_trio: item.price_trio ? parseFloat(item.price_trio) : null,
    has_bread_options: item.category_fr.includes('Wraps') || item.category_fr.includes('Paninis'),
    has_combo_options: item.category_fr.includes('Curry') || item.category_fr.includes('Assiettes'),
    is_popular: index < 8,
    is_available: true,
    created_at: new Date().toISOString()
  };
});

// Write to JSON seed file
const outputPath = path.join(__dirname, '../data/firestore_seed_data.json');
fs.writeFileSync(outputPath, JSON.stringify(firestoreData, null, 2), 'utf8');

console.log(`✅ Successfully generated complete Firestore seed dataset!`);
console.log(`- Restaurant Info: 1 location (Drummondville)`);
console.log(`- Users: 3 roles (Customer, Store Kitchen, In-House Driver)`);
console.log(`- Menu Items: ${Object.keys(firestoreData.menu_items).length} bilingual dishes`);
console.log(`- Sample Orders: 1 active multi-role delivery flow`);
console.log(`- Inventory: ${Object.keys(firestoreData.inventory).length} stock toggles`);
console.log(`- Output saved to: ${outputPath}`);
