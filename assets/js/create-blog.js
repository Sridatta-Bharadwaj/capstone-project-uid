document.addEventListener("DOMContentLoaded", async () => {
  const { db } = await import("./firebase-config.js");
  const {
    collection,
    addDoc,
    serverTimestamp,
    getDoc,
    doc
  } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");

  const { getAuth, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js");

  const blogForm = document.getElementById("blogForm");

  let currentUser = null;
  let username = "Anonymous";

  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          username = userDoc.data().name || "Anonymous";
        }
      } catch (e) {
        console.warn("Could not fetch username", e);
      }
    } else {
      console.warn("Not logged in");
    }
  });

  blogForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const category = document.getElementById("category").value.trim();
    const statusMessage = document.getElementById("statusMessage");

    if (!title || !content || !category) {
      statusMessage.textContent = "⚠️ All fields are required!";
      statusMessage.style.color = "red";
      return;
    }

    try {
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        category,
        createdAt: serverTimestamp(),
        username: username
      });

      statusMessage.textContent = "✅ Blog published!";
      statusMessage.style.color = "green";
      blogForm.reset();
    } catch (err) {
      console.error("Error adding document:", err);
      statusMessage.textContent = "❌ Failed to publish.";
      statusMessage.style.color = "red";
    }
  });
});
