import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBcCsYA5wKqoX-o_lKM0QyRVV3608NSVAs",
  authDomain: "blog-test-fc1f6.firebaseapp.com",
  projectId: "blog-test-fc1f6",
  storageBucket: "blog-test-fc1f6.appspot.com",
  messagingSenderId: "146015794221",
  appId: "1:146015794221:web:dd99d5b4b1ad5fb3c634a4",
  measurementId: "G-ZRB9SZNZ6W",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
