import type { Editor } from "@tiptap/react";
import { RichTextButton } from "./button";

interface TextMarksMenuProps {
  editor: Editor;
}

export const TextMarksMenu = ({ editor }: TextMarksMenuProps) => {
  return (
    <>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      >
        Negrito
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        Italico
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
      >
        Riscado
      </RichTextButton>
    </>
  );
};
