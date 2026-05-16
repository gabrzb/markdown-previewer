import "./App.css";
import { Editor } from "./components/Editor";
import { Preview } from "./components/Preview";

function App() {
  return (
    <main className="app-shell">
      <section className="workspace" aria-label="Markdown Editor and Preview">
        <Editor />
        <Preview />
      </section>
    </main>
  );
}

export default App;
