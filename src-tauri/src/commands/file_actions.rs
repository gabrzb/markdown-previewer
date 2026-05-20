use std::path::PathBuf;

use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

use crate::domain::markdown_document::{AppError, MarkdownDocument, DEFAULT_CONTENT};

#[tauri::command]
pub fn new_document() -> MarkdownDocument {
    MarkdownDocument {
        path: None,
        content: DEFAULT_CONTENT.to_string(),
    }
}

#[tauri::command]
pub fn open_document(app: AppHandle) -> Result<Option<MarkdownDocument>, AppError> {
    let picked = app
        .dialog()
        .file()
        .add_filter("Markdown", &["md", "txt"])
        .blocking_pick_file();

    let Some(file_path) = picked else {
        return Ok(None);
    };

    let path = file_path
        .into_path()
        .map_err(|e| AppError::new(e.to_string()))?;

    let content = std::fs::read_to_string(&path)
        .map_err(|e| AppError::new(format!("Erro ao ler arquivo: {e}")))?;

    Ok(Some(MarkdownDocument {
        path: Some(path),
        content,
    }))
}

// Returns the actual path where the file was saved, or None if the dialog was cancelled.
#[tauri::command]
pub fn save_document(
    app: AppHandle,
    doc: MarkdownDocument,
    file_name: Option<String>,
) -> Result<Option<String>, AppError> {
    let path = match doc.path {
        Some(p) => p,
        None => {
            let builder = app.dialog().file().add_filter("Markdown", &["md"]);
            let builder = if let Some(name) = file_name {
                builder.set_file_name(name)
            } else {
                builder
            };
            let Some(fp) = builder.blocking_save_file() else {
                return Ok(None);
            };
            fp.into_path().map_err(|e| AppError::new(e.to_string()))?
        }
    };

    std::fs::write(&path, doc.content.as_bytes())
        .map_err(|e| AppError::new(format!("Erro ao salvar: {e}")))?;

    Ok(Some(path.to_string_lossy().into_owned()))
}

// Renames a file within its current directory and returns the new absolute path.
#[tauri::command]
pub fn rename_document(old_path: String, new_name: String) -> Result<String, AppError> {
    if new_name.trim().is_empty() {
        return Err(AppError::new("Nome não pode ser vazio"));
    }
    if new_name.contains('/') || new_name.contains('\\') {
        return Err(AppError::new("Nome não pode conter separadores de caminho"));
    }
    let old = PathBuf::from(&old_path);
    let dir = old
        .parent()
        .ok_or_else(|| AppError::new("Caminho inválido"))?;
    let new_path = dir.join(&new_name);
    std::fs::rename(&old, &new_path)
        .map_err(|e| AppError::new(format!("Erro ao renomear: {e}")))?;
    Ok(new_path.to_string_lossy().into_owned())
}
