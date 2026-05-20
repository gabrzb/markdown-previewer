import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Editor.css";

type EditorProps = {
  value: string;
  onChange: (next: string) => void;
  focused: boolean;
  onFocus: () => void;
};

export function Editor({ value, onChange, focused, onFocus }: EditorProps) {
  const lineCount = useMemo(() => value.split("\n").length, [value]);
  const wordCount = useMemo(
    () => (value.trim().match(/\S+/g) || []).length,
    [value],
  );
  const charCount = value.length;

  const gutterRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [lineHeight, setLineHeight] = useState(22.95);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;

    const measure = () => {
      const lh = parseFloat(window.getComputedStyle(ta).lineHeight);
      if (!isNaN(lh)) setLineHeight(lh);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ta);
    return () => ro.disconnect();
  }, []);

  const syncGutter = () => {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
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
        <div className="mp-titlebar-right" />
      </div>

      <div className="mp-body">
        <div
          className="mp-editor"
          style={{ "--editor-lh": `${lineHeight}px` } as React.CSSProperties}
        >
          <div ref={gutterRef} className="mp-gutter" aria-hidden="true">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={taRef}
            className="mp-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={syncGutter}
            spellCheck={false}
            aria-label="Markdown editor"
          />
        </div>

        <div className="mp-status">
          {wordCount} words · {charCount} chars
        </div>
      </div>
    </div>
  );
}
