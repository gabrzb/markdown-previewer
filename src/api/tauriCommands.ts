import { invoke } from "@tauri-apps/api/core";
import type { MarkdownDocument } from "../types/document";

export function newDocument(): Promise<MarkdownDocument> {
  return invoke("new_document");
}

export function openDocument(): Promise<MarkdownDocument | null> {
  return invoke("open_document");
}

export function saveDocument(doc: MarkdownDocument): Promise<void> {
  return invoke("save_document", { doc });
}

export function copyToClipboard(content: string): Promise<void> {
  return invoke("copy_to_clipboard", { content });
}

export function exportPdf(): Promise<void> {
  return invoke("export_pdf");
}
