import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Utility function to get gravatar-style avatar
function getGravatarUrl(email) {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}

// Minimal MD5 function (for gravatar hash)
function md5(string) {
    return crypto.subtle.digest("SHA-1", new TextEncoder().encode(string)).then(buffer => {
        return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    const passwordInput = document.getElementById("pass");

    const lengthRule = document.getElementById("length-rule");
    const uppercaseRule = document.getElementById("uppercase-rule");
    const numberRule = document.getElementById("number-rule");
    const specialRule = document.getElementById("special-rule");

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
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value.trim();
        const role = document.getElementById("role").value;

        if (document.querySelectorAll(".valid").length !== 4) {
            alert("Password does not meet all requirements.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const profilePic = await getGravatarUrl(email);

            // Optional: update Firebase Auth profile (if used)
            await updateProfile(user, {
                displayName: name,
                photoURL: profilePic
            });

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                username: username,
                email: email,
                role: role,
                profilePic: profilePic,
                createdAt: new Date(),
            });

            alert("Signup successful!");
            window.location.href = "login.html";
        } catch (error) {
            alert(error.message);
        }
    });
});
