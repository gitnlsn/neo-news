import type { Editor } from "@tiptap/react";
import { Circle, CircleIcon } from "lucide-react";
import { RichTextButton } from "./button";

interface RichTextListsProps {
  editor: Editor;
}

export const RichTextLists = ({ editor }: RichTextListsProps) => {
  return (
    <>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        className="text-base font-semibold px-2 py-0"
      >
        •
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        className="font-semibold text-base px-2 py-0"
      >
        1.
      </RichTextButton>
    </>
  );
};
