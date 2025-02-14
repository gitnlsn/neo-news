import type { Editor } from "@tiptap/react";
import { UndoIcon } from "lucide-react";
import { RichTextButton } from "./button";

interface RichTextUndoProps {
  editor: Editor;
}

export const RichTextUndo = ({ editor }: RichTextUndoProps) => {
  return (
    <>
      <RichTextButton
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <UndoIcon />
      </RichTextButton>
    </>
  );
};
