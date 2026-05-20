use std::error::Error;

use tauri::{
    menu::{Menu, MenuEvent, MenuItem, PredefinedMenuItem, Submenu},
    App, AppHandle, Emitter, Runtime,
};

mod menu_id {
    pub const NEW_DOCUMENT: &str = "novo";
    pub const OPEN_DOCUMENT: &str = "abrir";
    pub const SAVE_DOCUMENT: &str = "salvar";
    pub const SAVE_AS: &str = "salvar-como";
    pub const EXPORT_PDF: &str = "exportar-pdf";
    pub const COPY: &str = "copiar";
    pub const EXIT: &str = "sair";
    pub const ABOUT: &str = "sobre";
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum AppMenuItem {
    NewDocument,
    OpenDocument,
    SaveDocument,
    SaveAs,
    ExportPdf,
    Copy,
    Exit,
    About,
}

impl AppMenuItem {
    const fn id(self) -> &'static str {
        match self {
            Self::NewDocument => menu_id::NEW_DOCUMENT,
            Self::OpenDocument => menu_id::OPEN_DOCUMENT,
            Self::SaveDocument => menu_id::SAVE_DOCUMENT,
            Self::SaveAs => menu_id::SAVE_AS,
            Self::ExportPdf => menu_id::EXPORT_PDF,
            Self::Copy => menu_id::COPY,
            Self::Exit => menu_id::EXIT,
            Self::About => menu_id::ABOUT,
        }
    }

    fn from_id(id: &str) -> Option<Self> {
        match id {
            menu_id::NEW_DOCUMENT => Some(Self::NewDocument),
            menu_id::OPEN_DOCUMENT => Some(Self::OpenDocument),
            menu_id::SAVE_DOCUMENT => Some(Self::SaveDocument),
            menu_id::SAVE_AS => Some(Self::SaveAs),
            menu_id::EXPORT_PDF => Some(Self::ExportPdf),
            menu_id::COPY => Some(Self::Copy),
            menu_id::EXIT => Some(Self::Exit),
            menu_id::ABOUT => Some(Self::About),
            _ => None,
        }
    }
}

pub fn setup<R: Runtime>(app: &mut App<R>) -> Result<(), Box<dyn Error>> {
    let menu = build_menu(app)?;
    app.set_menu(menu)?;
    Ok(())
}

pub fn handle_event<R: Runtime>(app: &AppHandle<R>, event: MenuEvent) {
    match AppMenuItem::from_id(event.id().as_ref()) {
        Some(AppMenuItem::NewDocument) => {
            let _ = app.emit("menu:new", ());
        }
        Some(AppMenuItem::OpenDocument) => {
            let _ = app.emit("menu:open", ());
        }
        Some(AppMenuItem::SaveDocument) => {
            let _ = app.emit("menu:save", ());
        }
        Some(AppMenuItem::SaveAs) => {
            let _ = app.emit("menu:save-as", ());
        }
        Some(AppMenuItem::ExportPdf) => {
            let _ = app.emit("menu:export-pdf", ());
        }
        Some(AppMenuItem::Copy) => {
            let _ = app.emit("menu:copy", ());
        }
        Some(AppMenuItem::Exit) => {
            app.exit(0);
        }
        Some(AppMenuItem::About) | None => {}
    }
}

fn build_menu<R: Runtime>(app: &App<R>) -> tauri::Result<Menu<R>> {
    let file_new = MenuItem::with_id(
        app,
        AppMenuItem::NewDocument.id(),
        "Novo",
        true,
        Some("Ctrl+N"),
    )?;
    let file_open = MenuItem::with_id(
        app,
        AppMenuItem::OpenDocument.id(),
        "Abrir...",
        true,
        Some("Ctrl+O"),
    )?;
    let file_save = MenuItem::with_id(
        app,
        AppMenuItem::SaveDocument.id(),
        "Salvar",
        true,
        Some("Ctrl+S"),
    )?;
    let file_save_as = MenuItem::with_id(
        app,
        AppMenuItem::SaveAs.id(),
        "Salvar como...",
        true,
        Some("Ctrl+Shift+S"),
    )?;
    let file_export = MenuItem::with_id(
        app,
        AppMenuItem::ExportPdf.id(),
        "Exportar PDF",
        true,
        Some("Ctrl+P"),
    )?;
    let file_exit = MenuItem::with_id(
        app,
        AppMenuItem::Exit.id(),
        "Sair",
        true,
        Some("Ctrl+Q"),
    )?;

    let sep1 = PredefinedMenuItem::separator(app)?;
    let sep2 = PredefinedMenuItem::separator(app)?;

    let file_menu = Submenu::with_items(
        app,
        "Arquivo",
        true,
        &[
            &file_new,
            &file_open,
            &file_save,
            &file_save_as,
            &sep1,
            &file_export,
            &sep2,
            &file_exit,
        ],
    )?;

    let edit_copy = MenuItem::with_id(
        app,
        AppMenuItem::Copy.id(),
        "Copiar",
        true,
        Some("Ctrl+Shift+C"),
    )?;
    let edit_menu = Submenu::with_items(app, "Editar", true, &[&edit_copy])?;

    let options_about =
        MenuItem::with_id(app, AppMenuItem::About.id(), "Sobre", true, None::<&str>)?;
    let options_menu = Submenu::with_items(app, "Opções", true, &[&options_about])?;

    Menu::with_items(app, &[&file_menu, &edit_menu, &options_menu])
}
