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
  doc.rect(0, 0, 595.28, 85).fill(darkColor);
  doc.fillColor('#FFFFFF').fontSize(20).font('Helvetica-Bold').text('LA MAISON DES WRAPS', 40, 22);
  doc.fillColor(primaryColor).fontSize(11).font('Helvetica').text('GUIDE D ARCHITECTURE, RBAC & DEPLOIEMENT EAS BUILD', 40, 48);
  doc.moveDown(2.5);

  // Section 1
  doc.fillColor(darkColor).fontSize(13).font('Helvetica-Bold').text('1. Architecture Multiplateforme (Web, iOS, Android, Expo)');
  doc.moveDown(0.3);
  doc.fillColor(grayColor).fontSize(9).font('Helvetica').text(
    'Le systeme La Maison des Wraps est deploye sur une architecture hybride universelle reliant les applications Web (Vercel) et Mobiles (React Native / Expo SDK 52) sur une seule et meme base de donnees Supabase en temps reel.\n' +
    '• Base unifiee : Commandes, clients, points de fidelite et tickets synchronises en temps reel (WebSocket / Realtime).\n' +
    '• Moteur de taxes du Quebec : Calcul automatique conforme de la TPS (5.000%) et de la TVQ (9.975%).\n' +
    '• Passerelle Stripe : Apple Pay (iOS), Google Pay (Android) et cartes en mode Test Sandbox et Production.'
  );
  doc.moveDown(0.9);

  // Section 2
  doc.fillColor(darkColor).fontSize(13).font('Helvetica-Bold').text('2. Controle d Acces & Securite des Roles (RBAC)');
  doc.moveDown(0.3);
  doc.fillColor(grayColor).fontSize(9).font('Helvetica').text(
    'L acces a l application est securise par une barriere d authentification obligatoire et des regles strictes :\n' +
    '• ROLE CLIENT (Par defaut) : Tout utilisateur nouvellement inscrit accede exclusivement a l application Client (Menu complet, personnalisation de wraps/trios, paiement securise, suivi GPS et QR code fidelite).\n' +
    '• ROLE CUISINE (Attribue par l Admin) : Vue reservee a l ecran KDS avec carillon sonore, chronometre de cuisson, tableau Kanban (Recue -> En Prep -> Prete) et bouton de bascule vers l app client.\n' +
    '• ROLE LIVREUR (Attribue par l Admin) : Vue reservee a la livraison avec guidage GPS (Google Maps/Waze), scan QR code en cuisine pour prise en charge et validation a la porte (scan QR ou photo de preuve).\n' +
    '• ROLE ADMINISTRATEUR MASTER : Acces a la console financiere, taxes collectees, export Excel/CSV et panneau d attribution des roles en temps reel.'
  );
  doc.moveDown(0.9);

  // Section 3
  doc.fillColor(darkColor).fontSize(13).font('Helvetica-Bold').text('3. Workflow d une Commande de Bout en Bout');
  doc.moveDown(0.3);
  doc.fillColor(grayColor).fontSize(9).font('Helvetica').text(
    '1. COMMANDE CLIENT : Le client compose son repas et paie en 1 clic via Apple Pay / Google Pay / Carte.\n' +
    '2. ALERTE CUISINE : Le KDS sonne instantanement et genere le ticket avec le code PIN de securite (ex: #2325).\n' +
    '3. PREPARATION : La cuisine active la cuisson puis marque la commande prete au comptoir ou pour le livreur.\n' +
    '4. SCAN & LIVRAISON : La camera materielle de l app valide la remise du repas par reconnaissance de QR Code.\n' +
    '5. ANALYTIQUE ADMIN : Les ventes, taxes et fidelites sont enregistrees de maniere cumulative sans perte de donnees.'
  );
  doc.moveDown(0.9);

  // Section 4
  doc.fillColor(darkColor).fontSize(13).font('Helvetica-Bold').text('4. Generation des Binaires Natifs (EAS Build - iOS & Android)');
  doc.moveDown(0.3);
  doc.fillColor(grayColor).fontSize(9).font('Helvetica').text(
    'Le projet est configure avec EAS Build (eas.json) pour compiler les applications mobiles autonomes :\n' +
    '• Fichier APK Android (Installation directe sur telephone) : npm run mobile:build:android\n' +
    '• Simulateur iOS / TestFlight : npm run mobile:build:ios\n' +
    '• Production App Store & Google Play : npx eas-cli build --platform all --profile production\n' +
    '• Test instantane sans compilation : npm run mobile:start avec l application Expo Go.'
  );

  // Footer
  doc.fontSize(8).fillColor('#888888').text(
    'La Maison des Wraps · Drummondville, QC · Guide Technique & Deploiement EAS · ' + new Date().toLocaleDateString('fr-CA'),
    40,
    785,
    { align: 'center', width: 515 }
  );

  doc.end();
  stream.on('finish', () => {
    console.log('Updated PDF generated at ' + outPath);
  });
}

generateDoc();
