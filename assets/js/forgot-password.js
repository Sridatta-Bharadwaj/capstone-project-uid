import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { auth } from "./firebase-config.js"; // Import from your config file

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("forgot-password-form");
    const resetMessage = document.getElementById("reset-message");

    if (!form) {
        console.error("Forgot password form not found!");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form reload

        const email = document.getElementById("email").value;

        if (!email) {
            resetMessage.style.color = "red";
            resetMessage.textContent = "Please enter your email.";
            return;
        }

        // Firebase function to send password reset email
        sendPasswordResetEmail(auth, email)
            .then(() => {
                resetMessage.style.color = "green";
                resetMessage.textContent = "Password reset email sent! Check your inbox.";
            })
            .catch((error) => {
                resetMessage.style.color = "red";
                resetMessage.textContent = error.message;
                console.error("Error: ", error.message);
            });
    });
});
