import type { Editor } from "@tiptap/react";
import { RichTextButton } from "./button";

interface RichTextListsProps {
  editor: Editor;
}

export const RichTextLists = ({ editor }: RichTextListsProps) => {
  return (
    <>
      <RichTextButton
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
      >
        Marcadores
      </RichTextButton>
      <RichTextButton
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
      >
        Numeração
      </RichTextButton>
    </>
  );
};
