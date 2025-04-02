// Enhanced login.js with password toggle, validation, local storage, remember me, toggle form view, and forgot password logic

const passwordInput = document.querySelector("input[name='password']");
const emailInput = document.querySelector("input[name='email']");
const roleSelect = document.querySelector("select[name='role']");
const loginForm = document.querySelector(".login-form");

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

// Form validation & localStorage handling
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect.value;
    const remember = document.getElementById("rememberMe")?.checked;

    if (!email || !password || !role) {
      e.preventDefault();
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
