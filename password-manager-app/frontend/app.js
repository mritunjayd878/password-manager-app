const API_BASE = "/api";


// SIGNUP
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const [email, password, confirmPassword] = signupForm.querySelectorAll("input");

    if (password.value !== confirmPassword.value) {
      alert("Passwords do not match!");
      return;
    }

    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup successful! Please log in.");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Signup failed.");
    }
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const [email, password] = loginForm.querySelectorAll("input");

    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await res.json();
    if (res.ok && data.access_token) {
      localStorage.setItem("token", data.access_token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login failed.");
    }
  });
}

// DASHBOARD: Fetch and display credentials
const vaultContainer = document.getElementById("vaultContainer");
if (vaultContainer) {
  window.addEventListener("DOMContentLoaded", loadVault);
}

async function loadVault() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const res = await fetch(`${API_BASE}/vault`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  vaultContainer.innerHTML = "";

  if (res.ok && data.vault) {
    data.vault.forEach((cred) => {
      const card = document.createElement("div");
      card.className = "bg-gray-100 p-4 rounded-xl shadow text-gray-800";
      card.innerHTML = `
        <h3 class="font-bold text-lg">${cred.website}</h3>
        <p><strong>Username:</strong> ${cred.username}</p>
        <p><strong>Password:</strong> ${cred.password}</p>
        <button class="bg-red-500 text-white px-3 py-1 mt-2 mr-2 rounded delete-btn" data-id="${cred.id}">Delete</button>
        <button class="bg-yellow-500 text-white px-3 py-1 mt-2 rounded edit-btn" data-id="${cred.id}" data-website="${cred.website}" data-username="${cred.username}" data-password="${cred.password}">Edit</button>
      `;

      card.querySelector(".delete-btn").addEventListener("click", async () => {
        const res = await fetch(`${API_BASE}/vault/${cred.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          alert("Credential deleted!");
          loadVault();
        } else {
          alert("Failed to delete.");
        }
      });

      card.querySelector(".edit-btn").addEventListener("click", async () => {
        const website = prompt("Edit Website:", cred.website);
        const username = prompt("Edit Username:", cred.username);
        const password = prompt("Edit Password:", cred.password);
        if (!website || !username || !password) return;

        const res = await fetch(`${API_BASE}/vault/${cred.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ website, username, password }),
        });
        

        if (res.ok) {
          alert("Credential updated!");
          loadVault();
        } else {
          alert("Failed to update.");
        }
      });

      vaultContainer.appendChild(card);
    });
  } else {
    alert("Failed to load vault.");
  }
}
const addCredentialForm = document.getElementById("addCredentialForm");
if (addCredentialForm) {
  addCredentialForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const website = document.getElementById("website").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/vault`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ website, username, password }),
    });

    if (res.ok) {
      alert("Credential added!");
      addCredentialForm.reset();
      loadVault();
    } else {
      alert("Failed to add credential.");
    }
  });
}
