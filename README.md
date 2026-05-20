# Markdown Preview

A focused desktop Markdown editor built with React, TypeScript, Vite, and Tauri. Write Markdown on one side and instantly see the rendered output on the other — all in a native desktop application.

---

## Demo

![Demo](docs/demo.gif)

---

## Features

- **Live preview** — Markdown is rendered in real time as you type.
- **File operations** — Create new documents, open existing `.md` files, save, and save as.
- **Editable document title** — Rename the document directly from the editor header; renames the file on disk if it has been saved.
- **Unsaved-changes indicator** — A dot (`•`) appears in the toolbar and window title whenever there are unsaved changes. A confirmation dialog prevents accidental data loss.
- **Copy to clipboard** — Copies the Markdown source with a brief visual confirmation.
- **PDF export** — Exports the rendered preview as a PDF file.
- **Scroll synchronization** — The editor and preview panels scroll together proportionally.
- **Native menu integration** — File menu with keyboard shortcuts mirrors all toolbar actions.
- **Error notifications** — Toast-style messages surface errors from any file or export operation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18 |
| Language | TypeScript |
| Build tool | Vite |
| Desktop runtime | Tauri 2 |

---

## Project Structure

```
src/
├── App.tsx                  # Root component and application state
├── App.css
├── api/
│   └── tauriCommands.ts     # Typed wrappers around Tauri backend commands
├── components/
│   ├── Editor.tsx / .css    # Textarea with editable filename header
│   ├── Preview.tsx / .css   # Rendered Markdown panel
│   ├── Toolbar.tsx / .css   # Action buttons with busy/dirty/done states
│   └── icons.tsx            # SVG icon components
├── types/
│   └── document.ts          # MarkdownDocument type
└── utils/
    └── scrollSync.ts        # Proportional scroll synchronization hook

src-tauri/                   # Rust backend (Tauri)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install) (required by Tauri)
- [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your platform

### Installation

```bash
npm install
```

### Running in development

Start the Tauri application with hot reload:

```bash
npm run tauri dev
```

To run only the Vite frontend (browser, no desktop features):

```bash
npm run dev
```

### Building for production

```bash
npm run tauri build
```

The installer is placed in `src-tauri/target/release/bundle/`.

---

## License

This project is licensed under the [MIT License](LICENSE).
