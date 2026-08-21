const fs = require('fs');

function updateClientIndex(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace hardcoded admin link with dynamic container
  const oldHardcodedAdmin = /<!-- Role Switching Quick Links -->\s*<div class="profile-menu-item" onclick="window\.location\.href='\/admin\.html'">[\s\S]*?<\/div>\s*<\/div>/;
  if (oldHardcodedAdmin.test(html)) {
    html = html.replace(oldHardcodedAdmin, '<!-- Dynamic Staff Workplace Access (Populated only for Promoted Roles) -->\n        <div id="profileWorkplaceActionContainer"></div>');
  }

  // Update updateUserProfileUI to populate profileWorkplaceActionContainer
  const oldUpdateFn = `function updateUserProfileUI() {`;
  const newUpdateFn = `function updateUserProfileUI() {
  const roleContainer = document.getElementById('profileWorkplaceActionContainer');
  const roleBadge = document.getElementById('profileRoleBadge');
  const user = clientProfile || {};

  if (roleContainer) {
    if (user.role === 'kitchen' || user.role === 'store') {
      roleContainer.innerHTML = \`
        <div class="profile-menu-item" onclick="window.location.href='/kitchen.html'" style="background: rgba(59, 130, 246, 0.15); border: 1.5px solid #3B82F6; margin: 8px 0; border-radius: 14px;">
          <div class="profile-menu-item-left">
            <i class="fa-solid fa-fire-burner" style="color: #3B82F6;"></i>
            <span style="color: #93C5FD; font-weight: 800;">👨‍🍳 Accéder au Poste Cuisine KDS</span>
          </div>
          <i class="fa-solid fa-arrow-right" style="color: #3B82F6; font-size: 14px;"></i>
        </div>
      \`;
    } else if (user.role === 'driver') {
      roleContainer.innerHTML = \`
        <div class="profile-menu-item" onclick="window.location.href='/driver.html'" style="background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10B981; margin: 8px 0; border-radius: 14px;">
          <div class="profile-menu-item-left">
            <i class="fa-solid fa-motorcycle" style="color: #10B981;"></i>
            <span style="color: #A7F3D0; font-weight: 800;">🛵 Accéder au Portail Livreur Dispatch</span>
          </div>
          <i class="fa-solid fa-arrow-right" style="color: #10B981; font-size: 14px;"></i>
        </div>
      \`;
    } else if (user.role === 'admin') {
      roleContainer.innerHTML = \`
        <div class="profile-menu-item" onclick="window.location.href='/admin.html'" style="background: rgba(139, 92, 246, 0.15); border: 1.5px solid #8B5CF6; margin: 8px 0; border-radius: 14px;">
          <div class="profile-menu-item-left">
            <i class="fa-solid fa-crown" style="color: #8B5CF6;"></i>
            <span style="color: #DDD6FE; font-weight: 800;">👑 Console Administrateur Général</span>
          </div>
          <i class="fa-solid fa-arrow-right" style="color: #8B5CF6; font-size: 14px;"></i>
        </div>
      \`;
    } else {
      roleContainer.innerHTML = '';
    }
  }`;

  html = html.replace('function updateUserProfileUI() {', newUpdateFn);

  // Add storage event listener for real-time role changes
  if (!html.includes("e.key === 'lmdw_role_update_event'")) {
    const storageScript = `
window.addEventListener('storage', function(e) {
  if (e.key === 'lmdw_role_update_event') {
    try {
      const evt = JSON.parse(e.newValue);
      if (clientProfile && (clientProfile.email === evt.email || clientProfile.name === evt.name || clientProfile.uid === evt.uid)) {
        clientProfile.role = evt.role;
        localStorage.setItem('lmdw_user', JSON.stringify(clientProfile));
        updateUserProfileUI();
        showToast("Votre rôle a été mis à jour par l'administrateur : " + evt.role.toUpperCase(), "👑");
      }
    } catch(err){}
  }
});
`;
    html = html.replace('window.onload = function() {', storageScript + '\nwindow.onload = function() {');
  }

  fs.writeFileSync(filePath, html);
  console.log('✓ Updated ' + filePath + ' with dynamic workplace access');
}

updateClientIndex('index.html');
updateClientIndex('app_preview/index.html');
