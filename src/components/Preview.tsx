import { useMemo, useState } from "react";
import "./Preview.css";
import { CheckIcon, CopyIcon, MoonIcon, PdfIcon, SunIcon } from "./icons";

type PreviewProps = {
  source: string;
  focused: boolean;
  onFocus: () => void;
};

// Static markup mirroring the default markdown — preview rendering will be
// wired up when the parser logic lands.
const STATIC_PREVIEW_HTML = `
<h1>Project notes</h1>
<p>A quick rundown of where things stand this week. The editor and preview have settled on <strong>two floating windows</strong> rather than a split pane — each can be moved and resized on its own.</p>
<h2>Status</h2>
<ul>
  <li>Wireframes approved (option C)</li>
  <li>Hi-fi shipped to design review</li>
  <li><em>Open question:</em> keyboard shortcuts</li>
</ul>
<h2>Try editing</h2>
<p>Type in the left window. Use <code>**bold**</code>, <code>*italic*</code>, lists, headings, or fenced code blocks. The preview updates as you type.</p>
<pre data-lang="js"><code>export const render = (md) =&gt; parse(md);</code></pre>
<blockquote>The buttons stay out of the way — a small pill in the corner of each window — until you reach for them.</blockquote>
<hr/>
<ol>
  <li>Copy to clipboard</li>
  <li>Save as PDF</li>
  <li>Reset the editor</li>
</ol>
`;

export function Preview({ source, focused, onFocus }: PreviewProps) {
  const [dark, setDark] = useState(false);
  const [copied] = useState(false);

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
        <div
          className="mp-preview mp-preview--serif"
          dangerouslySetInnerHTML={{ __html: STATIC_PREVIEW_HTML }}
        />

        <div className="mp-status">
          <span className="mp-sync-dot" /> synced · {wordCount} words
        </div>

        <div className="mp-pill mp-pill--br">
          <button
            type="button"
            className={"mp-pillbtn" + (copied ? " mp-pillbtn--done" : "")}
          >
            <span className="mp-pillbtn-icon">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </span>
            <span className="mp-pillbtn-label">
              {copied ? "copied" : "copy"}
            </span>
          </button>
          <button type="button" className="mp-pillbtn mp-pillbtn--primary">
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
