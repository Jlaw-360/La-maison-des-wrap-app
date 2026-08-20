
const fs = require('fs');
const path = require('path');

// 1. Ensure all directories exist
const dirs = [
  'mobile',
  'mobile/src',
  'mobile/src/types',
  'mobile/src/services',
  'mobile/src/context',
  'mobile/src/screens',
  'mobile/assets'
];

dirs.forEach(d => {
  const full = path.join(process.cwd(), d);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
});

// Copy assets from root if available
['assets/icon.png', 'assets/splash.png', 'assets/adaptive-icon.png', 'assets/favicon.png', 'logo.png'].forEach(f => {
  if (fs.existsSync(f)) {
    const dest = path.join('mobile/assets', path.basename(f));
    fs.copyFileSync(f, dest);
  }
});

// 2. mobile/package.json
const pkg = {
  name: 'la-maison-des-wraps-mobile',
  version: '1.0.0',
  main: 'node_modules/expo/AppEntry.js',
  scripts: {
    start: 'expo start',
    android: 'expo start --android',
    ios: 'expo start --ios',
    web: 'expo start --web'
  },
  dependencies: {
    '@supabase/supabase-js': '^2.49.1',
    'expo': '~52.0.0',
    'expo-asset': '~11.0.5',
    'expo-constants': '~17.0.8',
    'expo-status-bar': '~2.0.0',
    'react': '18.3.1',
    'react-dom': '18.3.1',
    'react-native': '0.76.7',
    'react-native-web': '~0.19.13'
  },
  devDependencies: {
    '@babel/core': '^7.25.2',
    '@types/react': '~18.3.12',
    'typescript': '^5.3.3'
  },
  private: true
};
fs.writeFileSync('mobile/package.json', JSON.stringify(pkg, null, 2));

// 3. mobile/app.json
const appJson = {
  expo: {
    name: 'La Maison des Wraps',
    slug: 'la-maison-des-wraps',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#121212'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'ca.maisondeswraps.app',
      infoPlist: {
        NSCameraUsageDescription: 'Cette application utilise l appareil photo pour scanner les codes QR de commande et capturer les photos de livraison au pas de la porte.',
        NSLocationWhenInUseUsageDescription: 'Cette application utilise votre position pour suivre la livraison en direct du restaurant jusqu a votre adresse a Drummondville.'
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#121212'
      },
      package: 'ca.maisondeswraps.app',
      permissions: ['CAMERA', 'ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION']
    },
    web: {
      favicon: './assets/logo.png',
      bundler: 'metro'
    }
  }
};
fs.writeFileSync('mobile/app.json', JSON.stringify(appJson, null, 2));

// 4. mobile/tsconfig.json
const tsconfig = {
  extends: 'expo/tsconfig.base',
  compilerOptions: {
    strict: true
  }
};
fs.writeFileSync('mobile/tsconfig.json', JSON.stringify(tsconfig, null, 2));

// 5. mobile/.env & mobile/.env.example
const envContent = [
  '# Shared Backend & Database Environment for La Maison des Wraps',
  'EXPO_PUBLIC_SUPABASE_URL=https://zldxbaykxgdraxvejkdr.supabase.co',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Ljj5EaZpRUDBuIPvd9Z89Q_A6Gr1qRy',
  'EXPO_PUBLIC_API_BASE_URL=https://la-maison-des-wrap-app.vercel.app',
  'EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51U18R4EP3Grb2rSSVkDRnkguIJClznmXedbsFP8IjF0tKOyDmXVM3QRKFglXeRcKZnKg1KCJpvgX0Wj4o4hrCdil005JeuJkBg',
  'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBZ2IVRkU5tGuZFnKqDdIpQmom18AT3AC4'
].join('\n');
fs.writeFileSync('mobile/.env', envContent);
fs.writeFileSync('mobile/.env.example', envContent);

console.log('Mobile base configs generated.');
