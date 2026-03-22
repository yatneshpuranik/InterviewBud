import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from 'firebase/auth'
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewbud-b80f6.firebaseapp.com",
  projectId: "interviewbud-b80f6",
  storageBucket: "interviewbud-b80f6.firebasestorage.app",
  messagingSenderId: "581692126250",
  appId: "1:581692126250:web:308288e3b6b33bb1edff53"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {auth , provider};