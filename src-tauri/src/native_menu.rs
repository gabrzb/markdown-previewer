use std::error::Error;

use tauri::{
    menu::{Menu, MenuEvent, MenuItem, Submenu},
    App, AppHandle, Runtime,
};

mod menu_id {
    pub const NEW_DOCUMENT: &str = "novo";
    pub const EXIT: &str = "sair";
    pub const ABOUT: &str = "sobre";
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum AppMenuItem {
    NewDocument,
    Exit,
    About,
}

impl AppMenuItem {
    const fn id(self) -> &'static str {
        match self {
            Self::NewDocument => menu_id::NEW_DOCUMENT,
            Self::Exit => menu_id::EXIT,
            Self::About => menu_id::ABOUT,
        }
    }

    fn from_id(id: &str) -> Option<Self> {
        match id {
            menu_id::NEW_DOCUMENT => Some(Self::NewDocument),
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
            println!("Novo clicado");
        }
        Some(AppMenuItem::Exit) => {
            app.exit(0);
        }
        Some(AppMenuItem::About) => {
            println!("Sobre clicado");
        }
        None => {}
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
    let file_exit = MenuItem::with_id(app, AppMenuItem::Exit.id(), "Sair", true, Some("Ctrl+Q"))?;

    let file_menu = Submenu::with_items(app, "Arquivo", true, &[&file_new, &file_exit])?;

    let options_about =
        MenuItem::with_id(app, AppMenuItem::About.id(), "Sobre", true, None::<&str>)?;

    let options_menu = Submenu::with_items(app, "Opções", true, &[&options_about])?;

    Menu::with_items(app, &[&file_menu, &options_menu])
}
