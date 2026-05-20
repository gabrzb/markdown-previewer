import { invoke } from "@tauri-apps/api/core";
import type { MarkdownDocument } from "../types/document";

export function newDocument(): Promise<MarkdownDocument> {
  return invoke("new_document");
}

export function openDocument(): Promise<MarkdownDocument | null> {
  return invoke("open_document");
}

// Returns the saved path, or null if the dialog was cancelled.
export function saveDocument(doc: MarkdownDocument, fileName?: string): Promise<string | null> {
  return invoke("save_document", { doc, file_name: fileName ?? null });
}

// Renames an existing file within its directory. Returns the new absolute path.
export function renameDocument(oldPath: string, newName: string): Promise<string> {
  return invoke("rename_document", { old_path: oldPath, new_name: newName });
}

export function copyToClipboard(content: string): Promise<void> {
  return invoke("copy_to_clipboard", { content });
}

export function exportPdf(): Promise<void> {
  return invoke("export_pdf");
}
