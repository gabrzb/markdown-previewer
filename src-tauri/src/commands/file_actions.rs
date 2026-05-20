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

#[tauri::command]
pub fn save_document(app: AppHandle, doc: MarkdownDocument) -> Result<(), AppError> {
    let path = match doc.path {
        Some(p) => p,
        None => {
            let picked = app
                .dialog()
                .file()
                .add_filter("Markdown", &["md"])
                .blocking_save_file();

            let Some(fp) = picked else {
                return Ok(());
            };

            fp.into_path()
                .map_err(|e| AppError::new(e.to_string()))?
        }
    };

    std::fs::write(&path, doc.content)
        .map_err(|e| AppError::new(format!("Erro ao salvar: {e}")))?;

    Ok(())
}
