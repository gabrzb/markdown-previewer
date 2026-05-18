import { useState } from "react";
import "./App.css";
import { Editor } from "./components/Editor";
import { Preview } from "./components/Preview";

const DEFAULT_MD = `# Project notes

A quick rundown of where things stand this week. The editor and
preview have settled on **two floating windows** rather than a split
pane — each can be moved and resized on its own.

## Status

- Wireframes approved (option C)
- Hi-fi shipped to design review
- *Open question:* keyboard shortcuts

## Try editing

Type in the left window. Use \`**bold**\`, \`*italic*\`, lists, headings,
or fenced code blocks. The preview updates as you type.

\`\`\`js
export const render = (md) => parse(md);
\`\`\`

> The buttons stay out of the way — a small pill in the corner of
> each window — until you reach for them.

---

1. Copy to clipboard
2. Save as PDF
3. Reset the editor
`;

type FocusedWindow = "editor" | "preview";

function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [focused, setFocused] = useState<FocusedWindow>("preview");

  return (
    <div className="mp-desktop">
      <Editor
        value={markdown}
        onChange={setMarkdown}
        focused={focused === "editor"}
        onFocus={() => setFocused("editor")}
      />
      <Preview
        source={markdown}
        focused={focused === "preview"}
        onFocus={() => setFocused("preview")}
      />
    </div>
  );
}

export default App;
