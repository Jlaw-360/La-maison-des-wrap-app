const fs = require('fs');
const PDFDocument = require('pdfkit');

function generateDoc() {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const outPath = 'La_Maison_Des_Wraps_Architecture_Guide.pdf';
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  const primaryColor = '#FF5500';
  const darkColor = '#121212';
  const grayColor = '#444444';

  // Header Bar
  doc.rect(0, 0, 595.28, 90).fill(darkColor);
  doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text('LA MAISON DES WRAPS', 40, 25);
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica').text('GUIDE D ARCHITECTURE & PRESENTATION DU SYSTEME', 40, 54);
  doc.moveDown(3);

  // Section 1
  doc.fillColor(darkColor).fontSize(14).font('Helvetica-Bold').text('1. Architecture Multiplateforme (Web, iOS, Android, Expo)');
  doc.moveDown(0.4);
  doc.fillColor(grayColor).fontSize(9.5).font('Helvetica').text(
    'Le systeme La Maison des Wraps est deploye sur une architecture hybride universelle reliant les applications Web (Vercel) et Mobiles (React Native / Expo SDK 52) sur une seule et meme base de donnees Supabase en temps reel.\n\n' +
    '• Base de donnees unifiee : Toutes les commandes, clients, points de fidelite et tickets de cuisine sont synchronises en temps reel (WebSocket / Supabase Realtime Channels).\n' +
    '• Moteur de taxes du Quebec : Calcul automatique conforme de la TPS (5.000%) et de la TVQ (9.975%).\n' +
    '• Passerelle Stripe : Paiements 1-clic avec Apple Pay (iOS), Google Pay (Android) et cartes de credit en mode Sandbox Test ou Live.'
  );
  doc.moveDown(1.2);

  // Section 2
  doc.fillColor(darkColor).fontSize(14).font('Helvetica-Bold').text('2. Controle d Acces & Securite des Roles (RBAC)');
  doc.moveDown(0.4);
  doc.fillColor(grayColor).fontSize(9.5).font('Helvetica').text(
    'L acces a l application est securise par une barriere d authentification obligatoire et des regles d acces granulaires :\n\n' +
    '• ROLE CLIENT (Par defaut) : Tout utilisateur nouvellement inscrit ou connecte accede exclusivement a l application de commande (Menu complet, personnalisation de wraps/trios, panier, paiement securise, suivi GPS en direct et QR code fidelite).\n\n' +
    '• ROLE CUISINE (Attribue par l Admin) : Vue reservee a l ecran KDS de cuisine avec carillon sonore haute clarte, chronometrage du temps de cuisson, tableau Kanban (Recue -> En Prep -> Prete) et bouton de bascule vers le mode Client.\n\n' +
    '• ROLE LIVREUR (Attribue par l Admin) : Vue reservee a la tournee de livraison, avec guidage GPS (Google Maps / Waze), scan QR code en cuisine pour prise en charge et validation a la porte (scan QR ou photo de preuve).\n\n' +
    '• ROLE ADMINISTRATEUR MASTER : Acces a la console financiere, aux taxes collectees, a l export Excel/CSV et au panneau de promotion des employes (attribution des roles en 1 clic).'
  );
  doc.moveDown(1.2);

  // Section 3
  doc.fillColor(darkColor).fontSize(14).font('Helvetica-Bold').text('3. Workflow d une Commande de Bout en Bout');
  doc.moveDown(0.4);
  doc.fillColor(grayColor).fontSize(9.5).font('Helvetica').text(
    '1. COMMANDE CLIENT : Le client compose son repas a Drummondville et paie via Apple Pay / Google Pay / Carte.\n' +
    '2. ALERTE CUISINE : Le KDS sonne instantanement et genere le ticket avec le code PIN de securite (ex: #2325).\n' +
    '3. PREPARATION : La cuisine active la preparation puis marque la commande prete au comptoir ou pour le livreur.\n' +
    '4. SCAN & LIVRAISON : La camera materielle de l application valide la remise du repas par reconnaissance de QR Code.\n' +
    '5. ANALYTIQUE ADMIN : Les ventes, taxes et fidelites sont enregistrees de maniere cumulative sans perte de donnees.'
  );
  doc.moveDown(1.2);

  // Section 4
  doc.fillColor(darkColor).fontSize(14).font('Helvetica-Bold').text('4. Instructions de Lancement sur Mobile (Expo Go)');
  doc.moveDown(0.4);
  doc.fillColor(grayColor).fontSize(9.5).font('Helvetica').text(
    '1. Telecharger l application \"Expo Go\" sur iPhone (App Store) ou Android (Google Play Store).\n' +
    '2. Dans le terminal du projet, executer : npm run mobile:start (ou npm run mobile:web pour tester sur navigateur).\n' +
    '3. Scanner le QR Code apparu dans le terminal avec l appareil photo de votre telephone.\n' +
    '4. L application charge instantanement avec toutes les fonctionnalites et la connexion Supabase active.'
  );

  // Footer
  doc.fontSize(8).fillColor('#888888').text(
    'La Maison des Wraps · Drummondville, QC · Guide Technique & Fonctionnel · ' + new Date().toLocaleDateString('fr-CA'),
    40,
    785,
    { align: 'center', width: 515 }
  );

  doc.end();
  stream.on('finish', () => {
    console.log('PDF document successfully created at: ' + outPath);
  });
}

generateDoc();
