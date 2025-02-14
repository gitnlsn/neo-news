import type { Editor } from "@tiptap/react";
import { BoldIcon, ItalicIcon, StrikethroughIcon } from "lucide-react";
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
        <BoldIcon />
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        <ItalicIcon />
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
      >
        <StrikethroughIcon />
      </RichTextButton>
    </>
  );
};
