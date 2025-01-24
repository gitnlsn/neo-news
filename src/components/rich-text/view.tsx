import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Document from "@tiptap/extension-document";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";

interface RichTextViewProps {
  content: string;
}

export const RichTextView = ({ content }: RichTextViewProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
      Youtube,
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none px-2 py-1 transition-colors",
      },
    },
    editable: false,
    content,
  });

  return <EditorContent editor={editor} className="group" />;
};
