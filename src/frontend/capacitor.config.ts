import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.caffeine.social',
  appName: 'Caffeine Social',
  // webDir must match the build output directory (pnpm run build outputs to 'dist')
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For local development, you can set a URL here:
    // url: 'http://192.168.1.100:3000',
    // cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  }
};

export default config;
