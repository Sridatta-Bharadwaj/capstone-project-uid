import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const blogContainer = document.getElementById("blogContainer");
const searchInput = document.getElementById("searchInput");

let allBlogs = [];

async function fetchBlogs() {
  try {
    const blogQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(blogQuery);

    allBlogs = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allBlogs.push({
        id: doc.id,
        ...data
      });
    });

    displayBlogsGroupedByCategory(allBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
}

function displayBlogsGroupedByCategory(blogs) {
  blogContainer.innerHTML = "";

  const categories = {};

  blogs.forEach(blog => {
    const category = blog.category || "Uncategorized";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(blog);
  });

  Object.keys(categories).forEach(category => {
    const categoryHeader = document.createElement("h2");
    categoryHeader.textContent = category;
    blogContainer.appendChild(categoryHeader);

    const categoryContainer = document.createElement("div");
    categoryContainer.className = "blog-category-group";

    categories[category].forEach(blog => {
      const card = document.createElement("div");
      card.className = "blog-card";
      const preview = (blog.content || "").split(" ").slice(0, 20).join(" ");
      card.innerHTML = `
        <h3>
          <a href="../pages/blog-details.html?id=${blog.id}" style="color: blue;" target="_blank">
            ${blog.title}
          </a>
        </h3>
        <p><strong>By:</strong> ${blog.username || "Anonymous"}</p>
        <p title="${blog.content}">${preview}...</p>
      `;
      categoryContainer.appendChild(card);
    });

    blogContainer.appendChild(categoryContainer);
  });
}

window.searchBlogs = function () {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (!searchTerm) {
    displayBlogsGroupedByCategory(allBlogs);
    return;
  }

  const filtered = allBlogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchTerm) ||
    blog.category?.toLowerCase().includes(searchTerm) ||
    blog.username?.toLowerCase().includes(searchTerm)
  );

  displayBlogsGroupedByCategory(filtered);
};

// Initial fetch
fetchBlogs();
