import { db } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const latestBlogsContainer = document.getElementById("latestBlogsContainer");
const popularBlogsContainer = document.getElementById("popularBlogsContainer");
const profilePic = document.getElementById("profilePic");

// Handle profile image and redirect to profile page
onAuthStateChanged(getAuth(), user => {
    if (user && profilePic) {
        profilePic.src = user.photoURL || "../assets/images/default-avatar.png";
        profilePic.style.cursor = "pointer";
        profilePic.addEventListener("click", () => {
            window.location.href = "../pages/profile.html";
        });
    }
});

async function fetchBlogs() {
    try {
        const snapshot = await getDocs(collection(db, "blogs"));
        const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayBlogs(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}

function displayBlogs(blogs) {
    latestBlogsContainer.innerHTML = "";
    popularBlogsContainer.innerHTML = "";

    const latest = [...blogs]
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 3);

    const popular = [...blogs]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 3);

    latest.forEach(blog => latestBlogsContainer.appendChild(createBlogCard(blog)));
    popular.forEach(blog => popularBlogsContainer.appendChild(createBlogCard(blog)));
}

function createBlogCard(blog) {
    const blogCard = document.createElement("div");
    blogCard.className = "blog-card";
    blogCard.innerHTML = `
        <img src="../assets/images/${blog.category || "default"}.jpg" alt="Blog Image">
        <div class="blog-content">
            <span class="category">${blog.category || "Uncategorized"}</span>
            <h3>${blog.title}</h3>
            <p>${(blog.content || "").substring(0, 100)}...</p>
            <a href="../pages/view-blog.html?blogId=${blog.id}" class="read-more">Read More</a>
        </div>
    `;
    return blogCard;
}

fetchBlogs();
