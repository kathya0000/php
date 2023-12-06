import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techpromux.app',
  appName: 'application',
  webDir: '../../dist/apps/app',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
