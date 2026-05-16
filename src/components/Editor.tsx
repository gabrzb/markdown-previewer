import "./Editor.css";

const initialMarkdown = `# Markdown Document

Use this area as a base for the editor.

- Initial structure
- Split screen
- Preview side by side`;

export function Editor() {
  return (
    <section className="editor-pane" aria-labelledby="editor-title">
      <div className="editor-pane__header">
        <h2 id="editor-title">Editor</h2>
      </div>

      <textarea
        className="editor-pane__textarea"
        aria-label="Markdown Editor"
        defaultValue={initialMarkdown}
        spellCheck="false"
      />
    </section>
  );
}
