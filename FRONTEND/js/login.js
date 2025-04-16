// Enhanced login.js with password toggle, validation, local storage, remember me, toast, and forgot password logic

const passwordInput = document.querySelector("input[name='password']");
const emailInput = document.querySelector("input[name='email']");
const roleSelect = document.querySelector("select[name='role']");
const loginForm = document.getElementById("login-form");


// Password visibility toggle
const toggleButton = document.createElement("span");
toggleButton.innerHTML = "👁️";
toggleButton.style.cursor = "pointer";
toggleButton.style.marginLeft = "8px";
toggleButton.style.userSelect = "none";
toggleButton.style.fontSize = "14px";

if (passwordInput && passwordInput.parentNode) {
  passwordInput.parentNode.style.display = "flex";
  passwordInput.parentNode.style.alignItems = "center";
  passwordInput.parentNode.appendChild(toggleButton);

  toggleButton.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    toggleButton.innerHTML = type === "password" ? "👁️" : "🙈";
  });
}

// Load stored login if 'remember me' was selected
window.addEventListener("DOMContentLoaded", () => {
  const savedEmail = localStorage.getItem("rememberedEmail");
  const savedRole = localStorage.getItem("rememberedRole");
  if (savedEmail && savedRole) {
    emailInput.value = savedEmail;
    roleSelect.value = savedRole;
    const rememberCheckbox = document.getElementById("rememberMe");
    if (rememberCheckbox) rememberCheckbox.checked = true;
  }
});

// Form validation, fetch login, and localStorage handling
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect.value;
    const remember = document.getElementById("rememberMe")?.checked;

    if (!email || !password || !role) {
      showToast("Please fill in all fields.");
      return;
    }

    if (remember) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedRole", role);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedRole");
    }

    fetch("../BACKEND/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.redirect) {
          window.location.href = data.redirect;
        } else {
          showToast(data.message || "Login failed");
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        showToast("An error occurred. Please try again.");
      });
  });
}

// Toast-style message
function showToast(message) {
  let toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#E74C3C";
  toast.style.color = "white";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  toast.style.zIndex = "1000";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s ease";

  document.body.appendChild(toast);
  setTimeout(() => (toast.style.opacity = "1"), 100);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Forgot Password feature (basic email prompt)
const forgotLink = document.getElementById("forgotPassword");
if (forgotLink) {
  forgotLink.addEventListener("click", function (e) {
    e.preventDefault();
    const userEmail = prompt("Enter your registered email for password reset:");
    if (userEmail) {
      showToast("If this email is registered, reset instructions will be sent.");
    }
  });
}

// Toggle between login and signup view (if both exist)
const toggleLinks = document.querySelectorAll(".toggle-view");
toggleLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    document.body.classList.toggle("show-signup");
  });
});
