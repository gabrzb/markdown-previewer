import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Preview.css";
import { CheckIcon, CopyIcon, MoonIcon, PdfIcon, SunIcon } from "./icons";

type PreviewProps = {
  source: string;
  focused: boolean;
  onFocus: () => void;
};

export function Preview({ source, focused, onFocus }: PreviewProps) {
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const wordCount = useMemo(
    () => (source.trim().match(/\S+/g) || []).length,
    [source],
  );

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
  };

  const handleCopy = async () => {
    const text = previewRef.current?.innerText ?? source;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    window.print();
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
        <div ref={previewRef} className="mp-preview mp-preview--serif">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
        </div>

        <div className="mp-status">
          <span className="mp-sync-dot" /> synced · {wordCount} words
        </div>

        <div className="mp-pill mp-pill--br">
          <button
            type="button"
            className={"mp-pillbtn" + (copied ? " mp-pillbtn--done" : "")}
            onClick={handleCopy}
          >
            <span className="mp-pillbtn-icon">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </span>
            <span className="mp-pillbtn-label">
              {copied ? "copied" : "copy"}
            </span>
          </button>
          <button
            type="button"
            className="mp-pillbtn mp-pillbtn--primary"
            onClick={handleDownloadPdf}
          >
            <span className="mp-pillbtn-icon">
              <PdfIcon />
            </span>
            <span className="mp-pillbtn-label">pdf</span>
          </button>
        </div>
      </div>
    </div>
  );
}
