import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebaseAuth from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDBSlOm54t726c5E8SUdHtLoqPE_-nyF_o",
  authDomain: "acesso-mais-seguro-sjm.firebaseapp.com",
  projectId: "acesso-mais-seguro-sjm",
  storageBucket: "acesso-mais-seguro-sjm.appspot.com",
  messagingSenderId: "903430535611",
  appId: "1:903430535611:web:ddcbe09258ffa831f7ac9e",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Extrai a função de persistência ignorando o erro de tipagem do VSCode
const { initializeAuth } = firebaseAuth;
const getReactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
