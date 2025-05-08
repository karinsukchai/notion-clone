"use client";

import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    try {
      const response = await edgestore.publicFiles.upload({ file });
      return response.url;
    } catch (error) {
      console.error("File upload failed:", error);
      return ""; // Handle error appropriately
    }
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });

  const uploadToDatabase = () => {
    if (onChange) {
      onChange(JSON.stringify(editor.document, null, 2));
    } else {
      console.warn("onChange is not defined.");
    }
  };

  return (
    <BlockNoteView
      onChange={uploadToDatabase}
      editable={editable ?? false} // Default to false if not provided
      editor={editor}
    />
  );
};

export default Editor;
