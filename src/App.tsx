import { useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import "./App.css";
import { Editor } from "./components/Editor";
import { Preview } from "./components/Preview";
import { Toolbar } from "./components/Toolbar";
import {
  copyToClipboard,
  exportPdf,
  newDocument,
  openDocument,
  saveDocument,
} from "./api/tauriCommands";
import type { MarkdownDocument } from "./types/document";

type FocusedWindow = "editor" | "preview";

function App() {
  const [markdown, setMarkdown] = useState("");
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [focused, setFocused] = useState<FocusedWindow>("preview");

  // Refs so menu listeners always read the latest state without stale closures
  const markdownRef = useRef(markdown);
  markdownRef.current = markdown;
  const currentPathRef = useRef(currentPath);
  currentPathRef.current = currentPath;

  const applyDocument = (doc: MarkdownDocument) => {
    setMarkdown(doc.content);
    setCurrentPath(doc.path);
  };

  useEffect(() => {
    newDocument().then(applyDocument).catch(console.error);
  }, []);

  // Subscribe to native menu events once; handlers read state through refs
  useEffect(() => {
    const unlisteners = [
      listen("menu:new", () =>
        newDocument().then(applyDocument).catch(console.error),
      ),
      listen("menu:open", () =>
        openDocument()
          .then((doc) => { if (doc) applyDocument(doc); })
          .catch(console.error),
      ),
      listen("menu:save", () =>
        saveDocument({
          path: currentPathRef.current,
          content: markdownRef.current,
        }).catch(console.error),
      ),
      listen("menu:save-as", () =>
        saveDocument({ path: null, content: markdownRef.current }).catch(
          console.error,
        ),
      ),
      listen("menu:copy", () =>
        copyToClipboard(markdownRef.current).catch(console.error),
      ),
      listen("menu:export-pdf", () => exportPdf().catch(console.error)),
    ];

    return () => {
      Promise.all(unlisteners).then((fns) => fns.forEach((fn) => fn()));
    };
  }, []);

  const handleNew = () => {
    newDocument().then(applyDocument).catch(console.error);
  };

  const handleOpen = () => {
    openDocument()
      .then((doc) => { if (doc) applyDocument(doc); })
      .catch(console.error);
  };

  const handleSave = () => {
    saveDocument({ path: currentPath, content: markdown }).catch(console.error);
  };

  const handleReset = () => {
    newDocument().then(applyDocument).catch(console.error);
  };

  return (
    <div className="mp-app">
      <Toolbar
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onReset={handleReset}
        onCopy={async () => {
          await copyToClipboard(markdown);
        }}
        onExportPdf={() => {
          exportPdf().catch(console.error);
        }}
      />
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
    </div>
  );
}

export default App;
