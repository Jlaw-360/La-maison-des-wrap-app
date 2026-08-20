const fs = require('fs');

const screens = [
  'AuthScreen.tsx',
  'HomeScreen.tsx',
  'KitchenScreen.tsx',
  'DriverScreen.tsx',
  'AdminScreen.tsx'
];

['mobile/src/screens', 'src/screens'].forEach(folder => {
  screens.forEach(screenName => {
    const filePath = folder + '/' + screenName;
    if (fs.existsSync(filePath)) {
      let code = fs.readFileSync(filePath, 'utf8');
      
      // Ensure import
      if (!code.includes('expo-observe')) {
        code = "import { AppMetrics } from 'expo-observe';\n" + code;
      }
      
      // Ensure markInteractive call in useEffect
      if (!code.includes('markInteractive')) {
        const insertTarget = 'export const ' + screenName.replace('.tsx', '');
        const hookSnippet = "\n  React.useEffect(() => {\n    try {\n      AppMetrics?.markInteractive?.();\n    } catch(e) {}\n  }, []);\n";
        const parts = code.split(insertTarget);
        if (parts.length === 2) {
          const compBody = parts[1];
          const funcStart = compBody.indexOf('=> {');
          if (funcStart !== -1) {
            const before = compBody.slice(0, funcStart + 4);
            const after = compBody.slice(funcStart + 4);
            code = parts[0] + insertTarget + before + hookSnippet + after;
          }
        }
      }
      
      fs.writeFileSync(filePath, code);
      console.log('Injected EAS Observe into: ' + filePath);
    }
  });
});
