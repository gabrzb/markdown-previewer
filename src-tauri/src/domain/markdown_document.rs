use std::path::PathBuf;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarkdownDocument {
    pub path: Option<PathBuf>,
    pub content: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppError {
    pub message: String,
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl std::error::Error for AppError {}

impl AppError {
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }
}

pub const DEFAULT_CONTENT: &str = r#"# Project notes

A quick rundown of where things stand this week. The editor and
preview have settled on **two floating windows** rather than a split
pane — each can be moved and resized on its own.

## Status

- Wireframes approved (option C)
- Hi-fi shipped to design review
- *Open question:* keyboard shortcuts

## Try editing

Type in the left window. Use `**bold**`, `*italic*`, lists, headings,
or fenced code blocks. The preview updates as you type.

```js
export const render = (md) => parse(md);
```

> The buttons stay out of the way — a small pill in the corner of
> each window — until you reach for them.

---

1. Copy to clipboard
2. Save as PDF
3. Reset the editor
"#;
