// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: 'task-manager-427b8.firebaseapp.com',
  projectId: 'task-manager-427b8',
  storageBucket: 'task-manager-427b8.appspot.com',
  messagingSenderId: '334981930262',
  appId: '1:334981930262:web:adf4bac91a9832a9f34437',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
