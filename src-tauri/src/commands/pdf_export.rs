use tauri::{AppHandle, Manager};

use crate::domain::markdown_document::AppError;

#[tauri::command]
pub fn export_pdf(app: AppHandle) -> Result<(), AppError> {
    app.get_webview_window("main")
        .ok_or_else(|| AppError::new("Janela principal não encontrada"))?
        .print()
        .map_err(|e| AppError::new(e.to_string()))
}
