import type { Editor } from "@tiptap/react";
import { RichTextButton } from "./button";

interface RichTextHeadingsProps {
  editor: Editor;
}

export const RichTextHeadings = ({ editor }: RichTextHeadingsProps) => {
  return (
    <>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive({ level: 1 })}
      >
        h1
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive({ level: 2 })}
      >
        h2
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive({ level: 3 })}
      >
        h3
      </RichTextButton>
    </>
  );
};
