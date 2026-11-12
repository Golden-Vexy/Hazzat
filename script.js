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

const KEYMAP = {
    a: "ⲁ", b: "ⲃ", g: "ⲅ", d: "ⲇ", e: "ⲉ", z: "ⲍ", h: "ⲏ", i: "ⲓ", k: "ⲕ",
    l: "ⲗ", m: "ⲙ", n: "ⲛ", x: "ⲝ", o: "ⲟ", p: "ⲡ", r: "ⲣ", s: "ⲥ", t: "ⲧ", v: "ⲩ",
    f: "ϥ", c: "ⲭ", w: "ⲱ",
    "]": "ϩ", j: "ϫ",
    "`": "\u0300"   // jinkim
};

// Coptic letter already typed + next key → combined letter
const DIGRAPHS = {
    "ⲕh": "ϧ",  // k + h
    "ⲥh": "ϣ",  // s + h
    "ⲭh": "ϭ",  // c + h
    "ⲡh": "ⲫ",  // p + h
    "ⲧh": "ⲑ",  // t + h
    "ⲧi": "ϯ",  // t + i
    "ⲡs": "ⲯ",  // p + s
};

// Returns the combined letter if the previous letter + this key form a digraph
function findDigraph(ch) {
    const pos = input.selectionStart;
    if (pos !== input.selectionEnd || pos === 0) return null;   // nothing highlighted

    const prev = input.value[pos - 1];
    const combo = DIGRAPHS[prev.toLowerCase() + ch.toLowerCase()];
    if (!combo) return null;

    // Keep capitals
    return prev !== prev.toLowerCase() ? combo.toUpperCase() : combo;
}

// Shifted versions of the punctuation keys, so Shift gives capitals there too
const SHIFTED = { "}": "]" };

function mapKey(ch) {
    if (KEYMAP[ch]) return KEYMAP[ch];
    if (SHIFTED[ch]) return KEYMAP[SHIFTED[ch]].toUpperCase();
    const lower = ch.toLowerCase();
    if (ch !== lower && KEYMAP[lower]) return KEYMAP[lower].toUpperCase();  // Shift+a → Ⲁ
    return null;   // not a Coptic key, so type it normally
}

const keyboard = document.getElementById("copticKeyboard");
let shift = "off";   // "off" | "once" | "lock"
let lastShiftTap = 0;
let copticMode = localStorage.getItem("copticMode") === "on";

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

    const modeKey = document.createElement("button");
    modeKey.className = "key special";
    if (copticMode) modeKey.classList.add("shift-on");
    modeKey.textContent = copticMode ? "Coptic typing: ON" : "Coptic typing: OFF";
    modeKey.addEventListener("click", () => {
        copticMode = !copticMode;
        localStorage.setItem("copticMode", copticMode ? "on" : "off");
        buildKeyboard();
        input.focus();
    });
    keyboard.appendChild(modeKey);

    // Letter keys
    for (const letter of COPTIC) {
        const key = document.createElement("button");
        key.className = "key";
        const shown = shift === "off" ? letter : letter.toUpperCase();
        key.innerHTML = `${shown}<small>${KEY_FOR[letter] || ""}</small>`;
        key.addEventListener("click", () => {
            insertAtCursor(shown);
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
    input.focus();

    // Inserts like real typing, so it goes into undo history
    const ok = document.execCommand("insertText", false, text);

    // Fallback if the browser ever drops execCommand (undo won't work then)
    if (!ok) {
        input.setRangeText(text, input.selectionStart, input.selectionEnd, "end");
        render();
    }
}

// Stop the buttons from taking focus away from the textarea,
// so the cursor stays where it was when you tap a letter
keyboard.addEventListener("mousedown", (e) => e.preventDefault());

const KEY_FOR = Object.fromEntries(Object.entries(KEYMAP).map(([k, v]) => [v, k]));
Object.assign(KEY_FOR, { "ϧ": "kh", "ϣ": "sh", "ϭ": "ch", "ⲫ": "ph", "ⲑ": "th", "ϯ": "ti", "ⲯ": "ps" });
buildKeyboard();

// Combining marks: jinkim (\u0300) and the other accents in that range
const COMBINING = /[\u0300-\u036F]/;

input.addEventListener("keydown", (e) => {
    if (e.key !== "Backspace") return;

    const start = input.selectionStart;
    const end = input.selectionEnd;

    // Only change Backspace when nothing is highlighted;
    // with a highlight, let it delete the selection normally
    if (start !== end || start === 0) return;

    const charBefore = input.value[start - 1];
    if (COMBINING.test(charBefore)) {
        e.preventDefault();                                  // stop the normal delete
        input.setSelectionRange(start - 1, start);           // select just the jinkim

        // delete the selection, undoable
        if (!document.execCommand("delete")) {
            input.setRangeText("", start - 1, start, "end");
            render();
        }
    }
});

input.addEventListener("beforeinput", (e) => {
    if (!copticMode || e.isComposing) return;
    if (e.inputType !== "insertText" || !e.data) return;

    // 1. Digraph: replace previous letter with the combined one
    if (e.data.length === 1) {
        const combo = findDigraph(e.data);
        if (combo) {
            e.preventDefault();
            const pos = input.selectionStart;
            input.setSelectionRange(pos - 1, pos);  // select previous letter
            insertAtCursor(combo);                  // replace it (still undoable)
            return;
        }
    }


    // 2. Normal single-key mapping
    const mapped = [...e.data].map(ch => mapKey(ch) || ch).join("");
    if (mapped === e.data) return;      // nothing to change, so let it through

    e.preventDefault();                 // block the Latin letter...
    insertAtCursor(mapped);             // ...and insert the Coptic one instead
});
