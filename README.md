# Personal Hazzat Project

## Date: November 12, 2026

## Author: Joseph Wannas

## Description

A web app for writing **Hazzat**, the notation used to learn Coptic Orthodox hymns. Hazzat shows the movement of the melody (rises, falls, held notes and beats) as small marks placed between the syllables of the text. This project lets you type a hymn in Coptic or English and see it laid out with Hazzat marks.

🔗 **Live site:** <https://golden-vexy.github.io/Hazzat/>

> 🚧 This project is a work in progress.

## Features

- ✍️ **Input and output panels:** type the hymn on the left and see the formatted version on the right, updated as you type
- ⌨️ **On-screen Coptic keyboard:** the full Coptic alphabet, with shift (tap once for one capital, double-tap to lock) and a jinkim key
- ⌫ **Jinkim-aware backspace:** deletes the jinkim before the letter beneath it
- 🌗 **Light and dark themes:** follows your device setting and remembers your choice
- 🔤 **Coptic typing mode:** type Coptic with your normal keyboard (`a` → ⲁ, `ph` → ⲫ, `ti` → ϯ), with the matching key shown on each on-screen key
- ↩️ **Undo support:** Ctrl+Z works for everything you type, including the on-screen keyboard

### Coptic typing keys

| Letter | Key | Letter | Key | Letter | Key |
| -------- | ----- | -------- | ----- | -------- | ----- |
| ⲁ | a | ⲓ | i | ⲣ | r |
| ⲃ | b | ⲕ | k | ⲥ | s |
| ⲅ | g | ⲗ | l | ⲧ | t |
| ⲇ | d | ⲙ | m | ⲩ | v |
| ⲉ | e | ⲛ | n | ϥ | f |
| ⲍ | z | ⲝ | x | ⲭ | c |
| ⲏ | h | ⲟ | o | ⲯ | ps |
| ⲑ | th | ⲡ | p | ⲱ | w |
| ⲫ | ph | ϣ | sh | ϧ | kh |
| ϭ | ch | ϯ | ti | ϩ | ] |
| ϫ | j | ◌̀ (jinkim) | \` | | |

Hold Shift for capitals. To type two letters that would otherwise combine (like ⲥⲏ in ⲥⲏⲟⲩ), tap the second letter on the on-screen keyboard.

## Planned

- [ ] Hazzat marks (beats, holds, slides, stops) drawn between syllables
- [ ] Auto-save hymns in the browser
- [x] Typing Coptic with the physical keyboard
- [ ] Saving and organizing multiple hymns
- [ ] Printing and exporting

## Built with

- HTML, CSS and JavaScript (no frameworks)
- [Noto Sans Coptic](https://fonts.google.com/noto/specimen/Noto+Sans+Coptic) for Coptic text
- GitHub Pages for hosting

## Running locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Golden-Vexy/Hazzat.git
   ```

2. Open the folder in VS Code.
3. Install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**.

## Project structure

```
├── index.html   # Page structure
├── style.css    # Layout, themes and keyboard styling
└── script.js    # Theme toggle, live preview and Coptic keyboard
```
