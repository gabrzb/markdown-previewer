mod commands;
mod native_menu;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(native_menu::setup)
        .on_menu_event(native_menu::handle_event)
        .invoke_handler(tauri::generate_handler![commands::greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
