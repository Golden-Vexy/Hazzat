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

const input = document.getElementById("hymnInput");
const output = document.getElementById("hymnOutput");

function render() {
    output.innerHTML = "";                       // clear the old output
    const lines = input.value.split("\n");

    for (const line of lines) {
        const p = document.createElement("p");
        p.textContent = line || "\u00A0";          // a blank line still takes up space
        output.appendChild(p);
    }
}

input.addEventListener("input", render);       // runs on every keystroke
render();