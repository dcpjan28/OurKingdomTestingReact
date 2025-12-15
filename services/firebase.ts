import firebase from 'firebase/compat/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const FIREBASE_CONFIG = { 
    apiKey: "AIzaSyDou6KkbunVRZrgwf8dM2-Fzooa9hmzHqg",
    authDomain: "ourkingdom-40ac4.firebaseapp.com",
    projectId: "ourkingdom-40ac4",
    storageBucket: "ourkingdom-40ac4.firebasestorage.app",
    messagingSenderId: "692420321112",
    appId: "1:692420321112:web:c9f7d1fff120972ad38f2d",
    measurementId: "G-C3X3ER73CZ"
};

const app = firebase.initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);

// Init Firestore with Long Polling to prevent QUIC errors on some networks
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
});