import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Document from "@tiptap/extension-document";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";

import type { File as UploadedFile } from "@prisma/client";
import { forwardRef, useImperativeHandle, useState } from "react";
import { RichTextAddImageButton } from "./add-image-button";
import { RichTextAddYoutubeVideoButton } from "./add-youtube-video";
import { RichTextAlignment } from "./alignment";
import { RichTextContainer } from "./container";
import { RichTextHeadings } from "./headings";
import { RichTextLists } from "./lists";
import { RichTextSeparator } from "./separator";
import { TextMarksMenu } from "./text-marks-menu";
import { RichTextUndo } from "./undo";

interface EditorProps {
  onChange: (content: string) => void;
  onUploadImage?: (file: UploadedFile) => void;
}

/**
 * Imperative interface to set the content of the editor.
 * Using a prop to update the editor content lead to bug.
 */
export interface RichTextEditorRef {
  //
  setContent: (content: string) => void;
}

/**
 * This editor is used to create and edit rich text content.
 * When having to force the content to be set, use the ref imperative method.
 */
export const RichTextEditor = forwardRef<RichTextEditorRef, EditorProps>(
  ({ onChange, onUploadImage }, ref) => {
    const [innerModalOpen, setInnerModalOpen] = useState(false);

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
          class:
            "border border-input focus-visible:ring-1 focus:outline-none focus-visible:ring-ring rounded-b-md px-2 py-1 transition-colors",
        },
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });

    useImperativeHandle(ref, () => ({
      setContent: (content: string) => {
        if (editor) {
          editor.commands.setContent(content);
        }
      },
    }));

    if (!editor) return null;

    const renderTextMenu = () => (
      <>
        <TextMarksMenu editor={editor} />
        <RichTextSeparator />
        <RichTextHeadings editor={editor} />
        <RichTextSeparator />
        <RichTextAlignment editor={editor} />
        <RichTextSeparator />
        <RichTextLists editor={editor} />
      </>
    );

    return (
      <div>
        <RichTextContainer className="w-full bg-muted">
          {renderTextMenu()}
          <RichTextSeparator />
          <RichTextAddImageButton
            editor={editor}
            onUploadImage={onUploadImage}
            onOpen={(open) => setInnerModalOpen(open)}
          />
          <RichTextAddYoutubeVideoButton
            editor={editor}
            onOpen={(open) => setInnerModalOpen(open)}
          />
          <RichTextSeparator />
          <RichTextUndo editor={editor} />
        </RichTextContainer>

        <BubbleMenu editor={editor}>
          <RichTextContainer className="backdrop-blur-lg bg-white shadow-md border border-input p-1">
            {renderTextMenu()}
            <RichTextSeparator />
            <RichTextUndo editor={editor} />
          </RichTextContainer>
        </BubbleMenu>

        <FloatingMenu
          editor={editor}
          className={innerModalOpen ? "hidden" : ""}
        >
          <RichTextContainer>
            <RichTextAddImageButton
              editor={editor}
              onUploadImage={onUploadImage}
              onOpen={(open) => setInnerModalOpen(open)}
            />
            <RichTextAddYoutubeVideoButton
              editor={editor}
              onOpen={(open) => setInnerModalOpen(open)}
            />
          </RichTextContainer>
        </FloatingMenu>

        <EditorContent editor={editor} />
      </div>
    );
  },
);
