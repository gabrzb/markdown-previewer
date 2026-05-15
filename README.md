# Markdown Preview

A simple desktop Markdown editor and previewer built with React, TypeScript, Vite, and Tauri.

The goal of the project is to provide a focused workspace where users can write Markdown on one side and inspect the rendered preview on the other side.

## Current Status

The application currently includes the base visual structure:

- A top toolbar for document actions.
- A split workspace with an editor panel and a preview panel.
- Separate React components for the toolbar, editor, and preview.
- Separate CSS files per component to keep styling responsibilities clear.

Markdown rendering, file actions, clipboard support, PDF export, and scroll synchronization are planned but not implemented yet.

## Planned Features

- Live Markdown preview.
- New document action.
- Open local `.md` files.
- Save Markdown files.
- Reset editor content to a default template.
- Copy Markdown or rendered HTML to the clipboard.
- Export the preview as PDF.
- Synchronized scrolling between the editor and preview.
- Visual feedback for completed or failed actions.

## Tech Stack

- React
- TypeScript
- Vite
- Tauri

## Project Structure

```text
src/
  App.tsx
  App.css
  components/
    Editor.tsx
    Editor.css
    Preview.tsx
    Preview.css
    Toolbar.tsx
    Toolbar.css
src-tauri/
  Tauri desktop application source
```

## Development

Install dependencies:

```bash
npm install
```

Run the Vite development server:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

Run the Tauri application:

```bash
npm run tauri dev
```

## Implementation Roadmap

1. Build the base layout with toolbar, editor, and preview.
2. Add Markdown state management.
3. Implement real-time Markdown rendering.
4. Add document actions: new, open, and save.
5. Add reset and copy actions with user feedback.
6. Add PDF export from the preview area.
7. Add bidirectional scroll synchronization.
8. Refine error handling and loading states.
