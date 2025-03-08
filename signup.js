// signup.js
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    const passwordInput = document.getElementById("pass");

    // Password rule elements
    const lengthRule = document.getElementById("length-rule");
    const uppercaseRule = document.getElementById("uppercase-rule");
    const numberRule = document.getElementById("number-rule");
    const specialRule = document.getElementById("special-rule");

    // Live password validation
    passwordInput.addEventListener("input", function () {
        const password = passwordInput.value;

        validateRule(password.length >= 8, lengthRule);
        validateRule(/[A-Z]/.test(password), uppercaseRule);
        validateRule(/\d/.test(password), numberRule);
        validateRule(/[@$!%*?&]/.test(password), specialRule);
    });

    function validateRule(condition, element) {
        if (condition) {
            element.classList.add("valid");
            element.classList.remove("invalid");
        } else {
            element.classList.add("invalid");
            element.classList.remove("valid");
        }
    }

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form refresh

        const name = document.getElementById("name").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value.trim();

        // Final password validation
        if (document.querySelectorAll(".valid").length !== 4) {
            alert("Password does not meet all requirements.");
            return;
        }

        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user details in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                username: username,
                email: email,
                createdAt: new Date(),
            });

            alert("Signup successful!");
            window.location.href = "login.html";
        } catch (error) {
            alert(error.message);
        }
    });
});
