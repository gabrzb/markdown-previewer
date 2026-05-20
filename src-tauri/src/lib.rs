mod commands;
mod domain;
mod native_menu;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .setup(native_menu::setup)
        .on_menu_event(native_menu::handle_event)
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::file_actions::new_document,
            commands::file_actions::open_document,
            commands::file_actions::save_document,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
