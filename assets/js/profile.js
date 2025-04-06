import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, getDocs, query, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

const auth = getAuth();
const displayNameEl = document.getElementById("displayName");
const emailEl = document.getElementById("email");
const profileImage = document.getElementById("profileImage");
const myBlogsContainer = document.getElementById("myBlogsContainer");
const logoutBtn = document.getElementById("logoutBtn");
const homeBtn = document.getElementById("homeBtn");

onAuthStateChanged(auth, async user => {
  if (user) {
    emailEl.textContent = user.email;
    profileImage.src = user.photoURL || "../assets/images/default-avatar.png";

    let currentUsername = "";

    // Get the username from users collection
    const usersSnapshot = await getDocs(query(collection(db, "users"), where("email", "==", user.email)));
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      currentUsername = data.username || user.displayName || "User";
      displayNameEl.textContent = currentUsername;
    });

    if (!currentUsername) {
      console.error("Username not found for the logged-in user.");
      return;
    }

    // Fetch blogs written by this user (matched via username)
    const blogSnapshot = await getDocs(query(collection(db, "blogs"), where("username", "==", currentUsername)));
    blogSnapshot.forEach(docSnap => {
      const blog = docSnap.data();
      const blogId = docSnap.id;

      const blogEl = document.createElement("div");
      blogEl.className = "blog-card";
      blogEl.innerHTML = `
        <h4>${blog.title}</h4>
        <p>${(blog.content || "").substring(0, 150)}...</p>
        <div class="blog-actions">
          <button class="delete-btn" data-id="${blogId}">Delete</button>
        </div>
      `;
      myBlogsContainer.appendChild(blogEl);
    });

    // Handle delete button clicks
    myBlogsContainer.addEventListener("click", async e => {
      if (e.target.classList.contains("delete-btn")) {
        const blogId = e.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this blog?")) {
          await deleteDoc(doc(db, "blogs", blogId));
          e.target.closest(".blog-card").remove();
        }
      }
    });

  } else {
    window.location.href = "../pages/login.html";
  }
});

// Logout and Home button handlers
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../pages/login.html";
});

homeBtn.addEventListener("click", () => {
  window.location.href = "../pages/home.html";
});
