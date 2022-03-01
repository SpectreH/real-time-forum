var regSection = document.getElementById("reg-section");
var loginSection = document.getElementById("login-section");

function switchSection(sectionId) {
  if (sectionId == 0) {
    regSection.classList.add("fade-in-element");
    loginSection.style.setProperty('display', 'none', 'important');
    regSection.style.setProperty('display', 'flex', 'important');
  } else {
    loginSection.classList.add("fade-in-element");
    regSection.style.setProperty('display', 'none', 'important');
    loginSection.style.setProperty('display', 'flex', 'important');
  }
} 