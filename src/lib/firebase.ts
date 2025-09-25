import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_0KPIqpfF2q8l2Wo5BUmDAmmntwOMpbI",
  authDomain: "home-service-app-ddf0f.firebaseapp.com",
  projectId: "home-service-app-ddf0f",
  storageBucket: "home-service-app-ddf0f.firebasestorage.app",
  messagingSenderId: "986570722724",
  appId: "1:986570722724:web:4b3fb7d8de5c8a394e4531",
  measurementId: "G-7R75E3QD9F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
