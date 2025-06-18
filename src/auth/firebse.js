// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCFoSfySIR9tzGkD0Uj2jP1S3HQJh6g0Tg",
    authDomain: "shopping-49284.firebaseapp.com",
    projectId: "shopping-49284",
    storageBucket: "shopping-49284.firebasestorage.app",
    messagingSenderId: "435249938954",
    appId: "1:435249938954:web:a206644347ac3953d915f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };