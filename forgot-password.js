import { auth } from "./firebase-config.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

document.getElementById("forgot-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent to your email.");
    } catch (error) {
        alert("Error: " + error.message);
    }
});
