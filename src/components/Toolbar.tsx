import { useState } from "react";
import "./Toolbar.css";
import {
  CheckIcon,
  CopyIcon,
  NewDocIcon,
  OpenFileIcon,
  PdfIcon,
  ResetIcon,
  SaveFileIcon,
} from "./icons";

type ToolbarProps = {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => Promise<void>;
  onReset: () => void;
  onCopy: () => Promise<void>;
  onExportPdf: () => void;
  isBusy: boolean;
  isDirty: boolean;
};

export function Toolbar({
  onNew,
  onOpen,
  onSave,
  onReset,
  onCopy,
  onExportPdf,
  isBusy,
  isDirty,
}: ToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    try {
      await onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // error UX handled in PR #6
    }
  };

  const showDirty = isDirty && !isBusy && !saved;

  return (
    <div className="mp-toolbar">
      <div className="mp-toolbar-group">
        <button
          type="button"
          className="mp-toolbar-btn"
          onClick={onNew}
          disabled={isBusy}
        >
          <NewDocIcon /> Novo
        </button>
        <button
          type="button"
          className="mp-toolbar-btn"
          onClick={onOpen}
          disabled={isBusy}
        >
          <OpenFileIcon /> Abrir
        </button>
        <button
          type="button"
          className={
            "mp-toolbar-btn" +
            (saved ? " mp-toolbar-btn--done" : "") +
            (showDirty ? " mp-toolbar-btn--dirty" : "")
          }
          onClick={handleSave}
          disabled={isBusy}
        >
          {saved ? <CheckIcon /> : <SaveFileIcon />}
          {saved ? "Salvo" : showDirty ? "Salvar •" : "Salvar"}
        </button>
      </div>

      <div className="mp-toolbar-group">
        <button
          type="button"
          className="mp-toolbar-btn"
          onClick={onReset}
          disabled={isBusy}
        >
          <ResetIcon /> Resetar
        </button>
        <button
          type="button"
          className={"mp-toolbar-btn" + (copied ? " mp-toolbar-btn--done" : "")}
          onClick={handleCopy}
          disabled={isBusy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copiado" : "Copiar"}
        </button>
        <button
          type="button"
          className="mp-toolbar-btn mp-toolbar-btn--primary"
          onClick={onExportPdf}
          disabled={isBusy}
        >
          <PdfIcon /> Exportar PDF
        </button>
      </div>
    </div>
  );
}
