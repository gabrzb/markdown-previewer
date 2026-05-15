# Markdown Previewer Simples — Planejamento

## Objetivo
Criar um app simples de **edição e pré-visualização de Markdown** com foco em produtividade rápida.

## Escopo (MVP)
O app deve ter, além do preview em tempo real:

1. **Resetar**: limpar o conteúdo do editor e restaurar um texto padrão.
2. **Copiar**: copiar o Markdown (ou HTML renderizado, conforme decisão de implementação) para a área de transferência.
3. **Exportar como PDF**: gerar PDF a partir da área de preview.
4. **Sincronizar scroll**: manter editor e preview alinhados durante a rolagem.
5. **Novo**: iniciar um novo documento em branco (ou com template padrão).
6. **Abrir**: carregar arquivo `.md` local para o editor.
7. **Salvar**: salvar o conteúdo atual em arquivo `.md`.

## Requisitos funcionais
- Editor com atualização instantânea no preview.
- Barra de ações com botões: **Novo**, **Abrir**, **Salvar**, **Resetar**, **Copiar**, **Exportar PDF**.
- Feedback visual de ações concluídas (ex.: “copiado com sucesso”).
- Scroll sync bidirecional (editor -> preview e preview -> editor), com proteção contra loop.
- Fluxo de arquivo com seletor nativo para abrir/salvar documentos Markdown.

## Requisitos técnicos sugeridos
- **Frontend:** React + TypeScript.
- **Renderização Markdown:** `react-markdown` (com suporte opcional a GFM).
- **Exportação PDF:** usar mecanismo de impressão/webview (Tauri/Web APIs) para gerar PDF do preview.
- **Clipboard:** API nativa (`navigator.clipboard`) no frontend ou comando Tauri, se necessário.
- **Acesso a arquivos:** diálogo de arquivo + leitura/escrita via APIs do Tauri.

## Estrutura inicial sugerida
- `src/App.tsx`: layout principal, estado do markdown e ações globais.
- `src/components/Editor.tsx`: textarea/editor e eventos de scroll/input.
- `src/components/Preview.tsx`: renderização markdown + controle de scroll.
- `src/utils/scrollSync.ts`: lógica de sincronização de rolagem.
- `src/utils/pdfExport.ts`: utilitário de exportação em PDF.
- `src/utils/fileActions.ts`: utilitários de novo/abrir/salvar arquivo Markdown.

## Plano de implementação
1. Montar layout base (editor + preview + toolbar).
2. Implementar preview em tempo real.
3. Implementar ações de arquivo: **Novo**, **Abrir** e **Salvar**.
4. Implementar ação de reset com conteúdo padrão.
5. Implementar ação de copiar com feedback ao usuário.
6. Implementar exportação para PDF.
7. Implementar sincronização de scroll com controle anti-loop.
8. Refinar UX, tratamento de erros e estados de loading.

## Critérios de aceite
- Alterações no editor refletem imediatamente no preview.
- Botão **Novo** limpa o editor corretamente para iniciar novo documento.
- Botão **Abrir** carrega arquivo Markdown válido no editor.
- Botão **Salvar** grava o conteúdo atual em `.md` sem perda de texto.
- Botão **Resetar** restaura corretamente o estado inicial.
- Botão **Copiar** funciona e informa sucesso/erro.
- Botão **Exportar PDF** gera arquivo válido com o conteúdo do preview.
- Scroll sync funciona sem travamentos ou “efeito ping-pong”.
