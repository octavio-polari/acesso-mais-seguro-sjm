import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBSlOm54t726c5E8SUdHtLoqPE_-nyF_o",
  authDomain: "acesso-mais-seguro-sjm.firebaseapp.com",
  projectId: "acesso-mais-seguro-sjm",
  storageBucket: "acesso-mais-seguro-sjm.appspot.com",
  messagingSenderId: "903430535611",
  appId: "1:903430535611:web:ddcbe09258ffa831f7ac9e",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
