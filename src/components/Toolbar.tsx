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
  onSave: () => void;
  onReset: () => void;
  onCopy: () => Promise<void>;
  onExportPdf: () => void;
};

export function Toolbar({
  onNew,
  onOpen,
  onSave,
  onReset,
  onCopy,
  onExportPdf,
}: ToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mp-toolbar">
      <div className="mp-toolbar-group">
        <button type="button" className="mp-toolbar-btn" onClick={onNew}>
          <NewDocIcon /> Novo
        </button>
        <button type="button" className="mp-toolbar-btn" onClick={onOpen}>
          <OpenFileIcon /> Abrir
        </button>
        <button type="button" className="mp-toolbar-btn" onClick={onSave}>
          <SaveFileIcon /> Salvar
        </button>
      </div>

      <div className="mp-toolbar-group">
        <button type="button" className="mp-toolbar-btn" onClick={onReset}>
          <ResetIcon /> Resetar
        </button>
        <button
          type="button"
          className={"mp-toolbar-btn" + (copied ? " mp-toolbar-btn--done" : "")}
          onClick={handleCopy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copiado" : "Copiar"}
        </button>
        <button
          type="button"
          className="mp-toolbar-btn mp-toolbar-btn--primary"
          onClick={onExportPdf}
        >
          <PdfIcon /> Exportar PDF
        </button>
      </div>
    </div>
  );
}
