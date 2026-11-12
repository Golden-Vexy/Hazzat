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

const COPTIC = [
    "ⲁ", "ⲃ", "ⲅ", "ⲇ", "ⲉ", "ⲋ", "ⲍ", "ⲏ", "ⲑ", "ⲓ", "ⲕ", "ⲗ", "ⲙ", "ⲛ", "ⲝ", "ⲟ",
    "ⲡ", "ⲣ", "ⲥ", "ⲧ", "ⲩ", "ⲫ", "ⲭ", "ⲯ", "ⲱ", "ϣ", "ϥ", "ϧ", "ϩ", "ϫ", "ϭ", "ϯ"
];

const keyboard = document.getElementById("copticKeyboard");
let shift = "off";   // "off" | "once" | "lock"
let lastShiftTap = 0;

function buildKeyboard() {
    keyboard.innerHTML = "";

    // Shift key
    const shiftKey = document.createElement("button");
    shiftKey.className = "key special";
    if (shift === "once") shiftKey.classList.add("shift-on");
    if (shift === "lock") shiftKey.classList.add("shift-lock");
    shiftKey.textContent = "⇧";
    shiftKey.addEventListener("click", onShift);
    keyboard.appendChild(shiftKey);

    // Letter keys
    for (const letter of COPTIC) {
        const key = document.createElement("button");
        key.className = "key";
        key.textContent = shift === "off" ? letter : letter.toUpperCase();
        key.addEventListener("click", () => {
            insertAtCursor(key.textContent);
            if (shift === "once") { shift = "off"; buildKeyboard(); }  // one capital only
        });
        keyboard.appendChild(key);
    }

    // Jinkim (the accent mark above a letter) and space
    addSpecialKey("◌̀", "\u0300");
    addSpecialKey("space", " ");
}

function addSpecialKey(label, text) {
    const key = document.createElement("button");
    key.className = "key special";
    key.textContent = label;
    key.addEventListener("click", () => insertAtCursor(text));
    keyboard.appendChild(key);
}

function onShift() {
    const now = Date.now();
    if (now - lastShiftTap < 300) shift = "lock";              // double tap
    else shift = shift === "off" ? "once" : "off";
    lastShiftTap = now;
    buildKeyboard();
}

function insertAtCursor(text) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.setRangeText(text, start, end, "end");   // replaces any selection, moves cursor after
    input.focus();
    render();                                      // update the output panel
}

// Stop the buttons from taking focus away from the textarea,
// so the cursor stays where it was when you tap a letter
keyboard.addEventListener("mousedown", (e) => e.preventDefault());

buildKeyboard();