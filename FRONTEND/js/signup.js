// ✅ Signup form success modal logic (Step 3)
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
  
    if (success === "true") {
      const modalEl = document.getElementById("signupSuccessModal");
      if (modalEl) {
        const successModal = new bootstrap.Modal(modalEl);
        successModal.show();
  
        setTimeout(() => {
          window.location.href = "login.html";
        }, 3000); // ⏱️ Redirect after 3 seconds
      }
    }
  });
  