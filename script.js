const toggle = document.getElementById("themeToggle");
const root = document.documentElement; // the <html> element

function updateButton() {
    toggle.textContent = root.dataset.theme === "dark" ? "Light mode" : "Dark mode";
}

toggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;              // sets <html data-theme="...">
    localStorage.setItem("theme", next);    // remembered next visit
    updateButton();
});

updateButton();