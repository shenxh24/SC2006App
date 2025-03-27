import { initializeApp } from 'firebase/app'; 
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAv-0BNJ_ODT6RzS1nIebFI-Mk4BVibcBA",
  authDomain: "bitebybyte-a3f70.firebaseapp.com",
  projectId: "bitebybyte-a3f70",
  storageBucket: "bitebybyte-a3f70.appspot.com",
  messagingSenderId: "965136913841",
  appId: "1:965136913841:web:453c45e28b1c928cc19990",
  measurementId: "G-SYYZ8RVSV7"
};
    
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
