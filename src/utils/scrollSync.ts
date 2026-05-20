import { useEffect, useRef, type RefObject } from "react";

export function useScrollSync(
  editorRef: RefObject<HTMLTextAreaElement>,
  previewRef: RefObject<HTMLDivElement>,
) {
  const isSyncing = useRef(false);

  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    const syncTo = (source: Element, target: Element) => {
      if (isSyncing.current) return;
      isSyncing.current = true;
      requestAnimationFrame(() => {
        const scrollable = source.scrollHeight - source.clientHeight;
        if (scrollable > 0) {
          target.scrollTop =
            (source.scrollTop / scrollable) *
            (target.scrollHeight - target.clientHeight);
        }
        // Second rAF ensures the scroll event fired by the assignment above
        // has already been processed before we release the guard.
        requestAnimationFrame(() => {
          isSyncing.current = false;
        });
      });
    };

    const onEditorScroll = () => syncTo(editor, preview);
    const onPreviewScroll = () => syncTo(preview, editor);

    editor.addEventListener("scroll", onEditorScroll);
    preview.addEventListener("scroll", onPreviewScroll);

    return () => {
      editor.removeEventListener("scroll", onEditorScroll);
      preview.removeEventListener("scroll", onPreviewScroll);
    };
  }, [editorRef, previewRef]);
}
