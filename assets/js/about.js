import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const profilePic = document.getElementById("profilePic");

onAuthStateChanged(getAuth(), (user) => {
  if (user && profilePic) {
    profilePic.src = user.photoURL || "../assets/images/default-avatar.png";
    profilePic.style.cursor = "pointer";
    profilePic.addEventListener("click", () => {
      window.location.href = "../pages/profile.html";
    });
  }
});
