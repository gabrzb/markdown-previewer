import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Preview.css";
import { MoonIcon, SunIcon } from "./icons";

type PreviewProps = {
  source: string;
  focused: boolean;
  onFocus: () => void;
};

export function Preview({ source, focused, onFocus }: PreviewProps) {
  const [dark, setDark] = useState(false);

  const wordCount = useMemo(
    () => (source.trim().match(/\S+/g) || []).length,
    [source],
  );

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
  };

  return (
    <div
      className={"mp-win" + (focused ? " mp-win--focused" : "")}
      onMouseDown={onFocus}
      style={{ zIndex: focused ? 2 : 1 }}
    >
      <div className="mp-titlebar">
        <div className="mp-close" />
        <div className="mp-title">notes.md</div>
        <div className="mp-titlebar-right">
          <button
            type="button"
            className="mp-themetoggle"
            title={dark ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>

      <div className="mp-body">
        <div className="mp-preview mp-preview--serif">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
        </div>

        <div className="mp-status">
          <span className="mp-sync-dot" /> synced · {wordCount} words
        </div>
      </div>
    </div>
  );
}
