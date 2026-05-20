use tauri::AppHandle;
use tauri_plugin_clipboard_manager::ClipboardExt;

use crate::domain::markdown_document::AppError;

#[tauri::command]
pub fn copy_to_clipboard(app: AppHandle, content: String) -> Result<(), AppError> {
    app.clipboard()
        .write_text(content)
        .map_err(|e| AppError::new(e.to_string()))
}
