import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Editor.css";

type EditorProps = {
  scrollRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (next: string) => void;
  focused: boolean;
  onFocus: () => void;
  fileName: string;
  isDirty: boolean;
  onRename: (newName: string) => void;
};

export function Editor({ scrollRef, value, onChange, focused, onFocus, fileName, isDirty, onRename }: EditorProps) {
  const lineCount = useMemo(() => value.split("\n").length, [value]);
  const wordCount = useMemo(
    () => (value.trim().match(/\S+/g) || []).length,
    [value],
  );
  const charCount = value.length;

  const gutterRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(22.95);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(fileName);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditingTitle) setEditTitle(fileName);
  }, [fileName, isEditingTitle]);

  useEffect(() => {
    if (isEditingTitle) titleInputRef.current?.select();
  }, [isEditingTitle]);

  useEffect(() => {
    const ta = scrollRef.current;
    if (!ta) return;

    const measure = () => {
      const lh = parseFloat(window.getComputedStyle(ta).lineHeight);
      if (!isNaN(lh)) setLineHeight(lh);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ta);
    return () => ro.disconnect();
  }, [scrollRef]);

  const syncGutter = () => {
    if (gutterRef.current && scrollRef.current) {
      gutterRef.current.scrollTop = scrollRef.current.scrollTop;
    }
  };

  const commitTitle = () => {
    setIsEditingTitle(false);
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== fileName) onRename(trimmed);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTitle();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setEditTitle(fileName);
    }
  };

  return (
    <div
      className={"mp-win mp-win--editor" + (focused ? " mp-win--focused" : "")}
      onMouseDown={onFocus}
      style={{ zIndex: focused ? 2 : 1 }}
    >
      <div className="mp-titlebar">
        <div className="mp-close" />
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            className="mp-title mp-title-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onBlur={commitTitle}
          />
        ) : (
          <div
            className="mp-title"
            onDoubleClick={() => { setEditTitle(fileName); setIsEditingTitle(true); }}
            title="Clique duplo para renomear"
          >
            {fileName}{isDirty ? " •" : ""}
          </div>
        )}
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
            ref={scrollRef}
            className="mp-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={syncGutter}
            spellCheck={false}
            aria-label="Markdown editor"
          />
        </div>

        <div className="mp-status">
          {wordCount} palavras · {charCount} caracteres
        </div>
      </div>
    </div>
  );
}
