import { useEffect, useState } from "react";
import "./App.css";
import { Editor } from "./components/Editor";
import { Preview } from "./components/Preview";
import { Toolbar } from "./components/Toolbar";
import { newDocument, openDocument, saveDocument } from "./api/tauriCommands";

type FocusedWindow = "editor" | "preview";

function App() {
  const [markdown, setMarkdown] = useState("");
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [focused, setFocused] = useState<FocusedWindow>("preview");

  useEffect(() => {
    newDocument()
      .then((doc) => {
        setMarkdown(doc.content);
        setCurrentPath(doc.path);
      })
      .catch(console.error);
  }, []);

  const handleNew = () => {
    newDocument()
      .then((doc) => {
        setMarkdown(doc.content);
        setCurrentPath(doc.path);
      })
      .catch(console.error);
  };

  const handleOpen = () => {
    openDocument()
      .then((doc) => {
        if (doc) {
          setMarkdown(doc.content);
          setCurrentPath(doc.path);
        }
      })
      .catch(console.error);
  };

  const handleSave = () => {
    saveDocument({ path: currentPath, content: markdown }).catch(console.error);
  };

  const handleReset = () => {
    newDocument()
      .then((doc) => {
        setMarkdown(doc.content);
        setCurrentPath(doc.path);
      })
      .catch(console.error);
  };

  return (
    <div className="mp-app">
      <Toolbar
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onReset={handleReset}
        onCopy={async () => {
          await navigator.clipboard.writeText(markdown);
        }}
        onExportPdf={() => window.print()}
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
