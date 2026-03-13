import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyB_AF2PPGxX5WUR7OUAVcr-pP3rWvKn7CY',
    authDomain: 'skill-sync-37fcf.firebaseapp.com',
    projectId: 'skill-sync-37fcf',
    storageBucket: 'skill-sync-37fcf.firebasestorage.app',
    messagingSenderId: '323024800979',
    appId: '1:323024800979:web:5f071d064aa6209d1a1826',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
