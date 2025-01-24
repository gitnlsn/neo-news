import type { Editor } from "@tiptap/react";
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
        Esquerda
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
      >
        Centralizado
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
      >
        Direita
      </RichTextButton>
      <RichTextButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
      >
        Justificado
      </RichTextButton>
    </>
  );
};
