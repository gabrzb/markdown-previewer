import "./Preview.css";

export function Preview() {
  return (
    <section className="preview-pane" aria-labelledby="preview-title">
      <div className="preview-pane__header">
        <h2 id="preview-title">Preview</h2>
      </div>

      <article className="preview-pane__content" aria-label="Markdown Preview">
        <h1>Markdown Document</h1>
        <p>Use this area as a base for the markdown preview.</p>
        <ul>
          <li>Initial structure</li>
          <li>Split screen</li>
          <li>Preview side by side</li>
        </ul>
      </article>
    </section>
  );
}
