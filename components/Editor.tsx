"use client";

import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const  handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
        file,

    });
    return response.url;
  }

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
      uploadFile : handleUpload,
  });

  const uploadToDatabase = () => {
    if (onChange) {
      onChange(JSON.stringify(editor.document, null, 2));
    }
  };

  return (
    <BlockNoteView
      onChange={uploadToDatabase}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      editable={editable}
      editor={editor}
    />
  );
};
export default Editor;