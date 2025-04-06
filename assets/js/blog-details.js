import { db } from "./firebase-config.js"; // Adjust path as needed
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Get blogId from query
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get("id");

// DOM elements
const blogTitle = document.getElementById("blogTitle");
const blogAuthor = document.getElementById("blogAuthor");
const blogCategory = document.getElementById("blogCategory");
const blogContent = document.getElementById("blogContent");

async function fetchBlogDetails() {
  if (!blogId) {
    blogTitle.textContent = "Blog Not Found";
    blogContent.textContent = "Invalid Blog ID";
    return;
  }

  try {
    const docRef = doc(db, "blogs", blogId);
    const blogSnap = await getDoc(docRef);

    if (blogSnap.exists()) {
      const blog = blogSnap.data();
      blogTitle.textContent = blog.title || "Untitled";
      blogAuthor.textContent = blog.username || "Anonymous";
      blogCategory.textContent = blog.category || "Uncategorized";
      blogContent.innerHTML = blog.content || "No content available.";
    } else {
      blogTitle.textContent = "Blog Not Found";
      blogContent.textContent = "This blog does not exist.";
    }
  } catch (error) {
    console.error("Error fetching blog:", error);
    blogTitle.textContent = "Error";
    blogContent.textContent = "Failed to load blog content.";
  }
}

fetchBlogDetails();
