import type { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react";
import { RichTextButton } from "./button";

interface RichTextAlignmentProps {
  editor: Editor;
}

export const RichTextAlignment = ({ editor }: RichTextAlignmentProps) => {
  return (
    <>
      <RichTextButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
      >
        <AlignLeftIcon />
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
      >
        <AlignCenterIcon />
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
      >
        <AlignRightIcon />
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
      >
        <AlignJustifyIcon />
      </RichTextButton>
    </>
  );
};
