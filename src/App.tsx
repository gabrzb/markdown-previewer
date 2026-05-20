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
  renameDocument,
  saveDocument,
} from "./api/tauriCommands";
import type { MarkdownDocument } from "./types/document";
import { useScrollSync } from "./utils/scrollSync";

type FocusedWindow = "editor" | "preview";

function baseName(path: string): string {
  return path.split(/[\\/]/).pop() ?? path;
}

function App() {
  const [markdown, setMarkdown] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [fileName, setFileName] = useState("sem título");
  const [focused, setFocused] = useState<FocusedWindow>("preview");
  const [isBusy, setIsBusy] = useState(false);

  const isDirty = markdown !== savedContent;

  // Scroll sync
  const editorScrollRef = useRef<HTMLTextAreaElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  useScrollSync(editorScrollRef, previewScrollRef);

  // Refs for menu listeners (avoid stale closures)
  const markdownRef = useRef(markdown);
  markdownRef.current = markdown;
  const currentPathRef = useRef(currentPath);
  currentPathRef.current = currentPath;
  const fileNameRef = useRef(fileName);
  fileNameRef.current = fileName;
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  // Window title reflects file name and dirty state
  useEffect(() => {
    document.title = isDirty ? `${fileName} •` : fileName;
  }, [isDirty, fileName]);

  const applyDocument = (doc: MarkdownDocument) => {
    setMarkdown(doc.content);
    setSavedContent(doc.content);
    setCurrentPath(doc.path);
    setFileName(doc.path ? baseName(doc.path) : "sem título");
  };

  // Returns true if safe to proceed (not dirty, or user confirmed discard)
  const confirmDiscard = () =>
    !isDirtyRef.current ||
    window.confirm("Há alterações não salvas. Deseja descartá-las?");

  // Init on mount
  useEffect(() => {
    newDocument().then(applyDocument).catch(console.error);
  }, []);

  // Subscribe to native menu events once; read live state through refs
  useEffect(() => {
    const unlisteners = [
      listen("menu:new", () => {
        if (!confirmDiscard()) return;
        newDocument().then(applyDocument).catch(console.error);
      }),
      listen("menu:open", () => {
        if (!confirmDiscard()) return;
        setIsBusy(true);
        openDocument()
          .then((doc) => { if (doc) applyDocument(doc); })
          .catch(console.error)
          .finally(() => setIsBusy(false));
      }),
      listen("menu:save", () => {
        const content = markdownRef.current;
        const path = currentPathRef.current;
        const name = fileNameRef.current;
        setIsBusy(true);
        saveDocument({ path, content }, path ? undefined : name)
          .then((savedPath) => {
            if (savedPath === null) return;
            setSavedContent(content);
            if (path === null) {
              setCurrentPath(savedPath);
              setFileName(baseName(savedPath));
            }
          })
          .catch(console.error)
          .finally(() => setIsBusy(false));
      }),
      listen("menu:save-as", () => {
        const content = markdownRef.current;
        const name = fileNameRef.current;
        setIsBusy(true);
        saveDocument({ path: null, content }, name)
          .then((savedPath) => {
            if (savedPath === null) return;
            setSavedContent(content);
            setCurrentPath(savedPath);
            setFileName(baseName(savedPath));
          })
          .catch(console.error)
          .finally(() => setIsBusy(false));
      }),
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
    if (!confirmDiscard()) return;
    newDocument().then(applyDocument).catch(console.error);
  };

  const handleOpen = () => {
    if (!confirmDiscard()) return;
    setIsBusy(true);
    openDocument()
      .then((doc) => { if (doc) applyDocument(doc); })
      .catch(console.error)
      .finally(() => setIsBusy(false));
  };

  const handleSave = async () => {
    const content = markdown;
    setIsBusy(true);
    try {
      const savedPath = await saveDocument(
        { path: currentPath, content },
        currentPath ? undefined : fileName,
      );
      if (savedPath === null) return; // dialog cancelled
      setSavedContent(content);
      if (currentPath === null) {
        setCurrentPath(savedPath);
        setFileName(baseName(savedPath));
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleReset = () => {
    if (!confirmDiscard()) return;
    newDocument().then(applyDocument).catch(console.error);
  };

  const handleRename = async (newName: string) => {
    if (currentPath) {
      try {
        const newPath = await renameDocument(currentPath, newName);
        setCurrentPath(newPath);
        setFileName(baseName(newPath));
      } catch (e) {
        console.error(e);
      }
    } else {
      setFileName(newName);
    }
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
        isBusy={isBusy}
        isDirty={isDirty}
      />
      <div className="mp-desktop">
        <Editor
          scrollRef={editorScrollRef}
          value={markdown}
          onChange={setMarkdown}
          focused={focused === "editor"}
          onFocus={() => setFocused("editor")}
          fileName={fileName}
          isDirty={isDirty}
          onRename={handleRename}
        />
        <Preview
          scrollRef={previewScrollRef}
          source={markdown}
          focused={focused === "preview"}
          onFocus={() => setFocused("preview")}
          fileName={fileName}
          isDirty={isDirty}
        />
      </div>
    </div>
  );
}

export default App;
