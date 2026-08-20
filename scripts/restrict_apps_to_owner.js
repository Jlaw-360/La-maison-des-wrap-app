const fs = require('fs');

console.log("Restricting other apps to Owner role only...");

function updateClientApp(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Remove the public "Apps" button from top header
  const appsBtnRegex = /<!-- Ecosystem Switcher Pill -->\s*<button class="pill-btn" onclick="openRoleSwitcherModal\(\)"[\s\S]*?<\/button>/;
  html = html.replace(appsBtnRegex, '');

  // Also remove any standalone Apps pill button if present
  html = html.replace(/<button class="pill-btn" onclick="openRoleSwitcherModal\(\)"[\s\S]*?<\/button>/g, '');

  // 2. Replace roleSwitcherModal with a PIN-protected Owner Security Gateway
  const oldModalRegex = /<!-- Multi-App Ecosystem Switcher Modal -->\s*<div class="modal-overlay" id="roleSwitcherModal">[\s\S]*?<\/div>\s*<\/div>/;
  
  const ownerModal = `<!-- Owner Security Gateway Modal (Protected by PIN) -->
<div class="modal-overlay" id="roleSwitcherModal">
  <div class="modal-sheet" style="max-height: 85vh;">
    <div class="sheet-header" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; margin-bottom: 16px;">
      <div>
        <div style="font-size: 10px; font-weight: 800; color: var(--primary); text-transform: uppercase;">Portail Réservé au Propriétaire</div>
        <div class="sheet-title" style="margin-top: 4px; font-size: 18px;">🔒 Espace Direction & Gestion</div>
      </div>
      <button class="close-btn" onclick="closeModal('roleSwitcherModal')"><i class="fa-solid fa-xmark"></i></button>
    </div>

    <div id="ownerPinPromptSection">
      <p style="font-size: 12px; color: var(--text-body); margin-bottom: 14px; line-height: 1.4;">
        Cet espace est strictement réservé au propriétaire et aux employés autorisés. Veuillez entrer votre code PIN de gestion :
      </p>
      <div style="margin-bottom: 16px;">
        <input type="password" id="txtOwnerPinInput" placeholder="Entrez le Code PIN Propriétaire" maxlength="6" style="width: 100%; background: #151519; border: 1.5px solid var(--border-subtle); border-radius: 12px; padding: 12px 14px; color: #FFFFFF; font-size: 16px; text-align: center; letter-spacing: 4px;">
        <div id="ownerPinError" style="display: none; color: #FF4444; font-size: 11px; margin-top: 6px; font-weight: 700; text-align: center;">Code PIN incorrect. Accès refusé.</div>
      </div>
      <button type="button" class="btn-main" onclick="verifyOwnerPin()" style="width: 100%; padding: 12px; background: var(--primary); color: #fff; border: none; border-radius: 14px; font-weight: 800; cursor: pointer;">
        <span>Déverrouiller l'Accès Propriétaire</span>
      </button>
    </div>

    <div id="ownerAppsListSection" style="display: none;">
      <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 10px 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-circle-check" style="color: #22C55E;"></i>
        <span style="font-size: 12px; font-weight: 700; color: #22C55E;">Accès Propriétaire Confirmé</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px;">
        <!-- App 2: Kitchen -->
        <a href="/kitchen.html" style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 14px 16px; border-radius: 14px; text-decoration: none; color: #fff;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #3B82F6; display: flex; align-items: center; justify-content: center; font-size: 16px;">👨‍🍳</div>
            <div>
              <div style="font-weight: 800; font-size: 14px;">1. Écran Cuisine KDS & Alertes</div>
              <div style="font-size: 11px; color: var(--text-body);">Gestion des commandes, sonnerie et préparation</div>
            </div>
          </div>
          <i class="fa-solid fa-arrow-right" style="color: #3B82F6;"></i>
        </a>

        <!-- App 3: Driver -->
        <a href="/driver.html" style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 14px 16px; border-radius: 14px; text-decoration: none; color: #fff;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #10B981; display: flex; align-items: center; justify-content: center; font-size: 16px;">🛵</div>
            <div>
              <div style="font-weight: 800; font-size: 14px;">2. Console Livreur & Dispatch</div>
              <div style="font-size: 11px; color: var(--text-body);">Prise en charge et confirmation livraison par PIN</div>
            </div>
          </div>
          <i class="fa-solid fa-arrow-right" style="color: #10B981;"></i>
        </a>

        <!-- App 4: Admin -->
        <a href="/admin.html" style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 14px 16px; border-radius: 14px; text-decoration: none; color: #fff;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #8B5CF6; display: flex; align-items: center; justify-content: center; font-size: 16px;">👑</div>
            <div>
              <div style="font-weight: 800; font-size: 14px;">3. Console Direction Générale & KPI</div>
              <div style="font-size: 11px; color: var(--text-body);">Rapports de ventes, taxes et gestion du menu</div>
            </div>
          </div>
          <i class="fa-solid fa-arrow-right" style="color: #8B5CF6;"></i>
        </a>
      </div>

      <button type="button" class="btn-main" onclick="closeModal('roleSwitcherModal')" style="width: 100%; padding: 10px; background: #262630; border: none; border-radius: 12px; color: #fff; font-weight: 700; cursor: pointer;">
        <span>Fermer</span>
      </button>
    </div>
  </div>
</div>`;

  html = html.replace(oldModalRegex, ownerModal);

  // 3. Add verifyOwnerPin function
  if (!html.includes('function verifyOwnerPin()')) {
    const scriptEnd = 'function openRoleSwitcherModal() {';
    const newScript = `function verifyOwnerPin() {
  const pinInput = document.getElementById('txtOwnerPinInput');
  const pinVal = (pinInput ? pinInput.value : '').trim();
  const errorEl = document.getElementById('ownerPinError');
  const promptSec = document.getElementById('ownerPinPromptSection');
  const appsSec = document.getElementById('ownerAppsListSection');

  // Master Owner PIN: 2325 or admin
  if (pinVal === '2325' || pinVal.toLowerCase() === 'admin') {
    sessionStorage.setItem('lmdw_owner_authenticated', 'true');
    if (errorEl) errorEl.style.display = 'none';
    if (promptSec) promptSec.style.display = 'none';
    if (appsSec) appsSec.style.display = 'block';
    showToast("Accès Propriétaire déverrouillé !", "👑");
  } else {
    if (errorEl) errorEl.style.display = 'block';
  }
}

function openRoleSwitcherModal() {
  const promptSec = document.getElementById('ownerPinPromptSection');
  const appsSec = document.getElementById('ownerAppsListSection');
  const pinInput = document.getElementById('txtOwnerPinInput');
  if (pinInput) pinInput.value = '';

  if (sessionStorage.getItem('lmdw_owner_authenticated') === 'true') {
    if (promptSec) promptSec.style.display = 'none';
    if (appsSec) appsSec.style.display = 'block';
  } else {
    if (promptSec) promptSec.style.display = 'block';
    if (appsSec) appsSec.style.display = 'none';
  }

  const el = document.getElementById('roleSwitcherModal');
  if (el) el.classList.add('open');
}
`;
    html = html.replace('function openRoleSwitcherModal() {', newScript);
  }

  // 4. In Profile View, add discreet "Accès Gestion Propriétaire" button at the bottom of settings
  if (!html.includes('openRoleSwitcherModal()')) {
    html = html.replace(
      /<button class="btn-main" onclick="logoutClient\(\)"/g,
      `<button type="button" onclick="openRoleSwitcherModal()" style="width: 100%; margin-bottom: 10px; background: #1C1C24; border: 1px solid rgba(255, 85, 0, 0.3); color: var(--primary); padding: 12px; border-radius: 14px; font-weight: 800; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <i class="fa-solid fa-lock"></i>
        <span>Accès Propriétaire & Gestion</span>
      </button>
      <button class="btn-main" onclick="logoutClient()"`
    );
  }

  fs.writeFileSync(filePath, html);
  console.log('Updated ' + filePath + ' to restrict other apps to owner only');
}

updateClientApp('index.html');
updateClientApp('app_preview/index.html');

// Add Security PIN Guard to kitchen.html, driver.html, admin.html
function addPinGuardToStaffApp(filePath, appName) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('id="staffSecurityLockOverlay"')) {
    const pinGuardModal = `
<!-- Owner & Staff Security Lock Guard -->
<div id="staffSecurityLockOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(12, 12, 14, 0.98); backdrop-filter: blur(20px); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 20px;">
  <div style="max-width: 400px; width: 100%; background: #1C1C24; border: 1.5px solid #FF5500; border-radius: 24px; padding: 24px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
    <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(255, 85, 0, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 26px; border: 1px solid #FF5500;">
      🔒
    </div>
    <h2 style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">Accès Propriétaire & Personnel</h2>
    <p style="font-size: 12px; color: #A5A5B2; margin-bottom: 20px; line-height: 1.4;">
      Cette interface (${appName}) est strictement réservée au restaurant. Veuillez entrer votre code PIN :
    </p>
    <input type="password" id="txtStaffGuardPin" placeholder="Entrez le PIN (2325)" maxlength="6" style="width: 100%; background: #121216; border: 1.5px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 12px 14px; color: #FFFFFF; font-size: 18px; text-align: center; letter-spacing: 4px; margin-bottom: 12px;">
    <div id="staffGuardError" style="display: none; color: #FF4444; font-size: 11px; margin-bottom: 12px; font-weight: 700;">Code PIN incorrect.</div>
    <div style="display: flex; gap: 8px;">
      <button type="button" onclick="window.location.href='/index.html'" style="flex: 1; padding: 12px; background: #262630; border: none; border-radius: 12px; color: #DDD; font-weight: 700; cursor: pointer;">
        Retour Client
      </button>
      <button type="button" onclick="verifyStaffGuardPin()" style="flex: 1; padding: 12px; background: #FF5500; border: none; border-radius: 12px; color: #FFFFFF; font-weight: 800; cursor: pointer;">
        Déverrouiller
      </button>
    </div>
  </div>
</div>

<script>
function verifyStaffGuardPin() {
  const pinInput = document.getElementById('txtStaffGuardPin');
  const pinVal = (pinInput ? pinInput.value : '').trim();
  const errorEl = document.getElementById('staffGuardError');
  const overlay = document.getElementById('staffSecurityLockOverlay');

  if (pinVal === '2325' || pinVal.toLowerCase() === 'admin') {
    sessionStorage.setItem('lmdw_owner_authenticated', 'true');
    if (overlay) overlay.style.display = 'none';
  } else {
    if (errorEl) errorEl.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('staffSecurityLockOverlay');
  if (sessionStorage.getItem('lmdw_owner_authenticated') === 'true') {
    if (overlay) overlay.style.display = 'none';
  }
});
</script>
`;
    html = html.replace('</body>', pinGuardModal + '\n</body>');
    fs.writeFileSync(filePath, html);
    console.log('Added Security PIN Guard to ' + filePath);
  }
}

addPinGuardToStaffApp('kitchen.html', 'Cuisine KDS');
addPinGuardToStaffApp('driver.html', 'Portail Livreur');
addPinGuardToStaffApp('admin.html', 'Console Direction');

