const fs = require('fs');

console.log("Applying strict Role-Based Access Control (RBAC) and standalone app isolation...");

// 1. Update admin.html to make role changes persist, broadcast, and sync
let adminHtml = fs.readFileSync('admin.html', 'utf8');

// Replace saveUserRole in admin.html
const saveUserRoleCode = `function saveUserRole(uid) {
  const select = document.getElementById(\`select_\${uid}\`);
  const newRole = select ? select.value : 'customer';
  const user = users.find(u => u.uid === uid);
  
  if (user) {
    user.role = newRole;
    
    // Save to registered clients list
    let allClients = [];
    try {
      const raw = localStorage.getItem('lmdw_all_clients_list');
      if (raw) allClients = JSON.parse(raw);
    } catch(e){}
    
    const clientIdx = allClients.findIndex(c => c.uid === uid || (c.email && c.email === user.email) || c.name === user.name);
    if (clientIdx >= 0) {
      allClients[clientIdx].role = newRole;
    } else {
      allClients.push({ uid: user.uid, name: user.name, email: user.email, phone: user.phone, role: newRole, points: user.points, address: user.address });
    }
    localStorage.setItem('lmdw_all_clients_list', JSON.stringify(allClients));

    // If this is the active saved user, update their active session
    try {
      const savedUser = localStorage.getItem('lmdw_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.email === user.email || parsed.name === user.name || parsed.uid === uid) {
          parsed.role = newRole;
          localStorage.setItem('lmdw_user', JSON.stringify(parsed));
        }
      }
    } catch(e){}

    // Broadcast role update event to all open tabs and windows
    localStorage.setItem('lmdw_role_update_event', JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: newRole,
      timestamp: Date.now()
    }));

    const roleNameMap = {
      customer: '👤 Client',
      store: '👨‍🍳 Employé Cuisine',
      kitchen: '👨‍🍳 Employé Cuisine',
      driver: '🛵 Employé Livreur',
      admin: '👑 Administrateur'
    };

    alert(\`✅ Rôle de \${user.name} mis à jour avec succès !\n\nNouveau rôle : \${roleNameMap[newRole] || newRole.toUpperCase()}\n\nL'utilisateur a désormais accès immédiat à son interface (\${newRole === 'store' || newRole === 'kitchen' ? 'Cuisine /kitchen.html' : (newRole === 'driver' ? 'Livreur /driver.html' : (newRole === 'admin' ? 'Direction /admin.html' : 'Client /index.html'))}).\`);
    renderUsers();
  }
}`;

adminHtml = adminHtml.replace(/function saveUserRole\(uid\) \{[\s\S]*?renderUsers\(\);\s*\}\s*\}/, saveUserRoleCode);
fs.writeFileSync('admin.html', adminHtml);
console.log('✓ Updated admin.html saveUserRole function');

// 2. Update kitchen.html with clean standalone role guard
let kitchenHtml = fs.readFileSync('kitchen.html', 'utf8');

// Remove public nav links from header in kitchen.html
kitchenHtml = kitchenHtml.replace(/<div class="nav-links">[\s\S]*?<\/div>/, `<div class="nav-links">
    <span style="font-size: 11px; background: rgba(59, 130, 246, 0.15); color: #3B82F6; padding: 4px 10px; border-radius: 12px; font-weight: 700;">
      <i class="fa-solid fa-fire-burner"></i> Poste Cuisine KDS
    </span>
    <button class="nav-btn" onclick="logoutStaff()"><i class="fa-solid fa-right-from-bracket"></i> Quitter</button>
  </div>`);

// Update the security lock guard in kitchen.html
const kitchenGuardHtml = `<!-- Kitchen Role Guard & Security Lock -->
<div id="staffSecurityLockOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(12, 12, 14, 0.98); backdrop-filter: blur(20px); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 20px;">
  <div style="max-width: 420px; width: 100%; background: #1C1C24; border: 1.5px solid #3B82F6; border-radius: 24px; padding: 26px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.85);">
    <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 28px; border: 1.5px solid #3B82F6;">
      👨‍🍳
    </div>
    <h2 style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">Écran Cuisine KDS (Restaurant)</h2>
    <p style="font-size: 12px; color: #A5A5B2; margin-bottom: 20px; line-height: 1.5;">
      Cet écran est réservé aux <strong>Employés de Cuisine</strong> et à l'Administration. Les clients réguliers n'ont pas accès à cette page.
    </p>

    <div id="roleCheckMsg" style="display: none; background: rgba(239, 68, 68, 0.12); border: 1px solid #EF4444; border-radius: 12px; padding: 12px; margin-bottom: 16px; font-size: 12px; color: #FCA5A5;">
      Votre compte est actuellement défini comme <strong>Client</strong>. Seul l'Administrateur peut vous attribuer le rôle <em>Employé Cuisine</em> dans la console Direction.
    </div>

    <div style="margin-bottom: 16px;">
      <input type="password" id="txtStaffGuardPin" placeholder="Entrez le Code PIN de Déverrouillage" maxlength="6" style="width: 100%; background: #121216; border: 1.5px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 12px 14px; color: #FFFFFF; font-size: 16px; text-align: center; letter-spacing: 4px; margin-bottom: 8px;">
      <div id="staffGuardError" style="display: none; color: #FF4444; font-size: 11px; font-weight: 700;">Code PIN incorrect. Veuillez contacter l'administrateur.</div>
    </div>

    <div style="display: flex; gap: 10px;">
      <button type="button" onclick="window.location.href='/index.html'" style="flex: 1; padding: 12px; background: #262630; border: none; border-radius: 12px; color: #D1D1DB; font-weight: 700; font-size: 13px; cursor: pointer;">
        <i class="fa-solid fa-arrow-left"></i> App Client
      </button>
      <button type="button" onclick="verifyStaffGuardPin()" style="flex: 1; padding: 12px; background: #3B82F6; border: none; border-radius: 12px; color: #FFFFFF; font-weight: 800; font-size: 13px; cursor: pointer;">
        Déverrouiller
      </button>
    </div>
  </div>
</div>

<script>
function checkKitchenAccess() {
  const overlay = document.getElementById('staffSecurityLockOverlay');
  const roleMsg = document.getElementById('roleCheckMsg');
  
  // 1. Check if owner already authenticated in session
  if (sessionStorage.getItem('lmdw_owner_authenticated') === 'true') {
    if (overlay) overlay.style.display = 'none';
    return;
  }

  // 2. Check active user role from localStorage
  try {
    const savedUser = localStorage.getItem('lmdw_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      if (u && (u.role === 'store' || u.role === 'kitchen' || u.role === 'admin')) {
        if (overlay) overlay.style.display = 'none';
        return;
      }
    }
  } catch(e){}

  // 3. User is not kitchen or admin
  if (overlay) overlay.style.display = 'flex';
  if (roleMsg) roleMsg.style.display = 'block';
}

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

function logoutStaff() {
  sessionStorage.removeItem('lmdw_owner_authenticated');
  window.location.href = '/index.html';
}

document.addEventListener('DOMContentLoaded', checkKitchenAccess);
window.addEventListener('storage', function(e) {
  if (e.key === 'lmdw_role_update_event' || e.key === 'lmdw_user') {
    checkKitchenAccess();
  }
});
</script>
`;

// Replace existing staff security lock overlay if present
if (kitchenHtml.includes('id="staffSecurityLockOverlay"')) {
  kitchenHtml = kitchenHtml.replace(/<!-- Owner & Staff Security Lock Guard -->[\s\S]*?<\/script>\s*<\/body>/, kitchenGuardHtml + '\n</body>');
} else {
  kitchenHtml = kitchenHtml.replace('</body>', kitchenGuardHtml + '\n</body>');
}
fs.writeFileSync('kitchen.html', kitchenHtml);
console.log('✓ Updated kitchen.html with standalone role guard');

// 3. Update driver.html with clean standalone role guard
let driverHtml = fs.readFileSync('driver.html', 'utf8');

// Remove public nav links from header in driver.html
driverHtml = driverHtml.replace(/<div style="display: flex; gap: 6px; align-items: center;">[\s\S]*?<\/div>/, `<div style="display: flex; gap: 6px; align-items: center;">
    <span style="font-size: 11px; background: rgba(16, 185, 129, 0.15); color: #10B981; padding: 4px 10px; border-radius: 12px; font-weight: 700;">
      <i class="fa-solid fa-motorcycle"></i> Livreur En Service
    </span>
    <button onclick="logoutDriver()" style="color: #fff; font-size: 11px; border: 1px solid var(--border); padding: 5px 10px; border-radius: 8px; background: rgba(255,255,255,0.06); cursor: pointer;"><i class="fa-solid fa-right-from-bracket"></i> Quitter</button>
  </div>`);

// Update driver guard
const driverGuardHtml = `<!-- Driver Role Guard & Security Lock -->
<div id="driverSecurityLockOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(12, 12, 14, 0.98); backdrop-filter: blur(20px); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 20px;">
  <div style="max-width: 420px; width: 100%; background: #1C1C24; border: 1.5px solid #10B981; border-radius: 24px; padding: 26px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.85);">
    <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 28px; border: 1.5px solid #10B981;">
      🛵
    </div>
    <h2 style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">Portail Livreur (In-House)</h2>
    <p style="font-size: 12px; color: #A5A5B2; margin-bottom: 20px; line-height: 1.5;">
      Cette interface est exclusivement réservée aux <strong>Livreurs assignés par le restaurant</strong>.
    </p>

    <div id="driverRoleMsg" style="display: none; background: rgba(239, 68, 68, 0.12); border: 1px solid #EF4444; border-radius: 12px; padding: 12px; margin-bottom: 16px; font-size: 12px; color: #FCA5A5;">
      Votre compte est actuellement défini comme <strong>Client</strong>. Seul l'Administrateur peut promouvoir votre compte en <em>Livreur</em> dans la console Direction.
    </div>

    <div style="margin-bottom: 16px;">
      <input type="password" id="txtDriverGuardPin" placeholder="Entrez le Code PIN Livreur" maxlength="6" style="width: 100%; background: #121216; border: 1.5px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 12px 14px; color: #FFFFFF; font-size: 16px; text-align: center; letter-spacing: 4px; margin-bottom: 8px;">
      <div id="driverGuardError" style="display: none; color: #FF4444; font-size: 11px; font-weight: 700;">Code PIN incorrect.</div>
    </div>

    <div style="display: flex; gap: 10px;">
      <button type="button" onclick="window.location.href='/index.html'" style="flex: 1; padding: 12px; background: #262630; border: none; border-radius: 12px; color: #D1D1DB; font-weight: 700; font-size: 13px; cursor: pointer;">
        <i class="fa-solid fa-arrow-left"></i> App Client
      </button>
      <button type="button" onclick="verifyDriverGuardPin()" style="flex: 1; padding: 12px; background: #10B981; border: none; border-radius: 12px; color: #FFFFFF; font-weight: 800; font-size: 13px; cursor: pointer;">
        Déverrouiller
      </button>
    </div>
  </div>
</div>

<script>
function checkDriverAccess() {
  const overlay = document.getElementById('driverSecurityLockOverlay');
  const roleMsg = document.getElementById('driverRoleMsg');
  
  if (sessionStorage.getItem('lmdw_owner_authenticated') === 'true') {
    if (overlay) overlay.style.display = 'none';
    return;
  }

  try {
    const savedUser = localStorage.getItem('lmdw_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      if (u && (u.role === 'driver' || u.role === 'admin')) {
        if (overlay) overlay.style.display = 'none';
        return;
      }
    }
  } catch(e){}

  if (overlay) overlay.style.display = 'flex';
  if (roleMsg) roleMsg.style.display = 'block';
}

function verifyDriverGuardPin() {
  const pinInput = document.getElementById('txtDriverGuardPin');
  const pinVal = (pinInput ? pinInput.value : '').trim();
  const errorEl = document.getElementById('driverGuardError');
  const overlay = document.getElementById('driverSecurityLockOverlay');

  if (pinVal === '2325' || pinVal.toLowerCase() === 'admin') {
    sessionStorage.setItem('lmdw_owner_authenticated', 'true');
    if (overlay) overlay.style.display = 'none';
  } else {
    if (errorEl) errorEl.style.display = 'block';
  }
}

function logoutDriver() {
  sessionStorage.removeItem('lmdw_owner_authenticated');
  window.location.href = '/index.html';
}

document.addEventListener('DOMContentLoaded', checkDriverAccess);
window.addEventListener('storage', function(e) {
  if (e.key === 'lmdw_role_update_event' || e.key === 'lmdw_user') {
    checkDriverAccess();
  }
});
</script>
`;

if (driverHtml.includes('id="staffSecurityLockOverlay"')) {
  driverHtml = driverHtml.replace(/<!-- Owner & Staff Security Lock Guard -->[\s\S]*?<\/script>\s*<\/body>/, driverGuardHtml + '\n</body>');
} else {
  driverHtml = driverHtml.replace('</body>', driverGuardHtml + '\n</body>');
}
fs.writeFileSync('driver.html', driverHtml);
console.log('✓ Updated driver.html with standalone role guard');

// 4. Update index.html to reflect dynamic role promotion in Profile tab
function updateClientProfileRole(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Enhance checkSavedUserSession in index.html to display assigned employee/driver role banner
  const roleBannerScript = `
function updateRoleWorkplaceBanner() {
  const container = document.getElementById('profileRoleBannerContainer');
  if (!container) return;

  const user = clientProfile;
  if (!user || !user.role || user.role === 'customer') {
    container.innerHTML = '';
    return;
  }

  if (user.role === 'kitchen' || user.role === 'store') {
    container.innerHTML = \`
      <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(37, 99, 235, 0.08) 100%); border: 1.5px solid #3B82F6; border-radius: 16px; padding: 14px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: #3B82F6; display: flex; align-items: center; justify-content: center; font-size: 20px;">👨‍🍳</div>
          <div>
            <div style="font-weight: 800; font-size: 13px; color: #FFFFFF;">Rôle Actif : Employé Cuisine</div>
            <div style="font-size: 11px; color: #93C5FD;">Accès accordé par l'Administrateur</div>
          </div>
        </div>
        <a href="/kitchen.html" style="background: #3B82F6; color: #fff; padding: 8px 14px; border-radius: 10px; font-size: 12px; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 6px;">
          <span>KDS</span> <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    \`;
  } else if (user.role === 'driver') {
    container.innerHTML = \`
      <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.08) 100%); border: 1.5px solid #10B981; border-radius: 16px; padding: 14px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: #10B981; display: flex; align-items: center; justify-content: center; font-size: 20px;">🛵</div>
          <div>
            <div style="font-weight: 800; font-size: 13px; color: #FFFFFF;">Rôle Actif : Livreur Restaurant</div>
            <div style="font-size: 11px; color: #A7F3D0;">Accès accordé par l'Administrateur</div>
          </div>
        </div>
        <a href="/driver.html" style="background: #10B981; color: #fff; padding: 8px 14px; border-radius: 10px; font-size: 12px; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 6px;">
          <span>Dispatch</span> <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    \`;
  } else if (user.role === 'admin') {
    container.innerHTML = \`
      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(109, 40, 217, 0.08) 100%); border: 1.5px solid #8B5CF6; border-radius: 16px; padding: 14px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: #8B5CF6; display: flex; align-items: center; justify-content: center; font-size: 20px;">👑</div>
          <div>
            <div style="font-weight: 800; font-size: 13px; color: #FFFFFF;">Rôle : Administrateur Général</div>
            <div style="font-size: 11px; color: #DDD6FE;">Gestion complète du restaurant</div>
          </div>
        </div>
        <a href="/admin.html" style="background: #8B5CF6; color: #fff; padding: 8px 14px; border-radius: 10px; font-size: 12px; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 6px;">
          <span>Console</span> <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    \`;
  }
}

window.addEventListener('storage', function(e) {
  if (e.key === 'lmdw_role_update_event') {
    try {
      const evt = JSON.parse(e.newValue);
      if (clientProfile && (clientProfile.email === evt.email || clientProfile.name === evt.name)) {
        clientProfile.role = evt.role;
        updateRoleWorkplaceBanner();
        showToast("Votre rôle a été mis à jour par l'administrateur : " + evt.role.toUpperCase(), "👑");
      }
    } catch(err){}
  }
});
`;

  if (!html.includes('id="profileRoleBannerContainer"')) {
    html = html.replace(
      /<div class="profile-header">/,
      '<div id="profileRoleBannerContainer"></div>\n    <div class="profile-header">'
    );
  }

  if (!html.includes('function updateRoleWorkplaceBanner()')) {
    html = html.replace('function renderProfile() {', roleBannerScript + '\nfunction renderProfile() {\n  updateRoleWorkplaceBanner();');
  }

  fs.writeFileSync(filePath, html);
  console.log('✓ Updated ' + filePath + ' with dynamic role workplace banner');
}

updateClientProfileRole('index.html');
updateClientProfileRole('app_preview/index.html');

console.log("Strict RBAC and Standalone App Isolation fully configured!");
