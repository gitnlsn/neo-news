import type { Editor } from "@tiptap/react";
import { Heading1Icon, Heading2Icon, Heading3Icon } from "lucide-react";
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
        <Heading1Icon />
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive({ level: 2 })}
      >
        <Heading2Icon />
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive({ level: 3 })}
      >
        <Heading3Icon />
      </RichTextButton>
    </>
  );
};
