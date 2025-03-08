import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyBcCsYA5wKqoX-o_lKM0QyRVV3608NSVAs",
    authDomain: "blog-test-fc1f6.firebaseapp.com",
    projectId: "blog-test-fc1f6",
    storageBucket: "blog-test-fc1f6.firebasestorage.app",
    messagingSenderId: "146015794221",
    appId: "1:146015794221:web:dd99d5b4b1ad5fb3c634a4",
    measurementId: "G-ZRB9SZNZ6W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
