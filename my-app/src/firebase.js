import { initializeApp } from 'firebase/app'; 
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';  // Import necessary functions for auth
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyAv-0BNJ_ODT6RzS1nIebFI-Mk4BVibcBA",
  authDomain: "bitebybyte-a3f70.firebaseapp.com",
  projectId: "bitebybyte-a3f70",
  storageBucket: "bitebybyte-a3f70.appspot.com",
  messagingSenderId: "965136913841",
  appId: "1:965136913841:web:453c45e28b1c928cc19990",
  measurementId: "G-SYYZ8RVSV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Google Auth Provider for Google Sign-In
const provider = new GoogleAuthProvider();

// Initialize Firebase Storage and Firestore
const storage = getStorage(app); 
const db = getFirestore(app);

// Export all necessary functions and objects
export { 
  auth, 
  provider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  storage, 
  db 
};
