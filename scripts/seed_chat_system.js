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

const sampleChats = [
  {
    chat_id: "chat_CMD-4092_customer_driver",
    order_id: "CMD-4092",
    channel_type: "customer_to_driver",
    title: "Livreur Marc 🛵 ↔ Jean Tremblay",
    participants: ["usr_customer_vip", "usr_driver_express"],
    participant_details: {
      "usr_customer_vip": {
        name: "Jean Tremblay",
        role: "customer",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      },
      "usr_driver_express": {
        name: "Marc Livreur (In-House)",
        role: "driver",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
        vehicle: "Honda Civic Noir (QC)"
      }
    },
    last_message: "Je suis arrivé au 1450 Rue Saint-Pierre! Votre commande est à votre porte.",
    last_message_sender_id: "usr_driver_express",
    last_message_time: Timestamp.now(),
    unread_counts: {
      "usr_customer_vip": 1,
      "usr_driver_express": 0
    },
    is_active: true,
    created_at: Timestamp.now(),
    messages: [
      {
        message_id: "msg_001",
        sender_id: "usr_customer_vip",
        sender_name: "Jean Tremblay",
        sender_role: "customer",
        text: "Bonjour Marc, pourriez-vous sonner à l'interphone #204 en arrivant s'il vous plaît?",
        timestamp: Timestamp.fromDate(new Date(Date.now() - 15 * 60000)),
        is_read: true
      },
      {
        message_id: "msg_002",
        sender_id: "usr_driver_express",
        sender_name: "Marc Livreur",
        sender_role: "driver",
        text: "Parfait Jean! C'est bien noté. Je suis à 3 minutes de chez vous avec votre sac isotherme.",
        timestamp: Timestamp.fromDate(new Date(Date.now() - 10 * 60000)),
        is_read: true
      },
      {
        message_id: "msg_003",
        sender_id: "usr_driver_express",
        sender_name: "Marc Livreur",
        sender_role: "driver",
        text: "Je suis arrivé au 1450 Rue Saint-Pierre! Votre commande est à votre porte.",
        photo_url: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=500",
        timestamp: Timestamp.fromDate(new Date(Date.now() - 2 * 60000)),
        is_read: false
      }
    ]
  },

  {
    chat_id: "chat_CMD-4092_customer_store",
    order_id: "CMD-4092",
    channel_type: "customer_to_store",
    title: "Cuisine Drummondville 👨‍🍳 ↔ Jean Tremblay",
    participants: ["usr_customer_vip", "usr_store_manager"],
    participant_details: {
      "usr_customer_vip": {
        name: "Jean Tremblay",
        role: "customer"
      },
      "usr_store_manager": {
        name: "Chef Cuisine - Drummondville",
        role: "store",
        store_phone: "819 850-3972"
      }
    },
    last_message: "Votre wrap Kebab Naan est bien préparé avec extra sauce à l'ail comme demandé!",
    last_message_sender_id: "usr_store_manager",
    last_message_time: Timestamp.fromDate(new Date(Date.now() - 20 * 60000)),
    unread_counts: {
      "usr_customer_vip": 0,
      "usr_store_manager": 0
    },
    is_active: true,
    created_at: Timestamp.now(),
    messages: [
      {
        message_id: "msg_101",
        sender_id: "usr_customer_vip",
        sender_name: "Jean Tremblay",
        sender_role: "customer",
        text: "Bonjour, j'ai une légère intolérance aux arachides, pourriez-vous vous assurer qu'il n'y en a pas dans le curry?",
        timestamp: Timestamp.fromDate(new Date(Date.now() - 24 * 60000)),
        is_read: true
      },
      {
        message_id: "msg_102",
        sender_id: "usr_store_manager",
        sender_name: "Chef Cuisine",
        sender_role: "store",
        text: "Bonjour Jean! Rassurez-vous, nos recettes de wraps et curries sont 100% sans arachides. Votre wrap Kebab Naan est bien préparé avec extra sauce à l'ail comme demandé!",
        timestamp: Timestamp.fromDate(new Date(Date.now() - 20 * 60000)),
        is_read: true
      }
    ]
  }
];

async function seedChatSystem() {
  console.log("=================================================");
  console.log("💬 CREATING REAL-TIME MULTI-ROLE CHAT IN FIRESTORE 💬");
  console.log("=================================================");
  console.log(`Target Project: ${serviceAccount.project_id}\n`);

  for (const chat of sampleChats) {
    const { messages, ...chatMeta } = chat;
    const chatDocRef = db.collection('chats').doc(chat.chat_id);
    
    // Save main conversation document
    await chatDocRef.set(chatMeta, { merge: true });
    console.log(`+ Created conversation: [${chat.title}] (${chat.channel_type})`);

    // Save subcollection messages
    const batch = db.batch();
    for (const msg of messages) {
      const msgRef = chatDocRef.collection('messages').doc(msg.message_id);
      batch.set(msgRef, msg, { merge: true });
    }
    await batch.commit();
    console.log(`   ↳ Added ${messages.length} messages to subcollection 'messages'`);
  }

  console.log("\n=================================================");
  console.log("🎉 REAL-TIME CHAT SYSTEM DEPLOYED TO LIVE FIRESTORE!");
  console.log("=================================================");
  console.log("1. 'customer_to_driver': Live chat between Customer & Driver with photo drop-off.");
  console.log("2. 'customer_to_store': Live chat between Customer & Kitchen for allergies/custom requests.");
  console.log("3. Real-time unread badges & timestamp synchronization enabled.");

  process.exit(0);
}

seedChatSystem().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
