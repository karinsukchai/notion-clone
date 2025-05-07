"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import * as React from "react";
import {
  UploaderProvider,
  type UploadFn,
} from "@/components/upload/uploader-provider";


 // const onChange = async (file?: File) => {
  //   if (file) {
  //     setIsSubmitting(true);
  //     setFile(file);

  //     const res = await edgestore.publicFiles.upload({
  //       file,
  //     });

  //     await update({
  //       id: params.documentId as Id<"documents">,
  //       coverImage: res.url,
  //     });

  //     onClose();
  //   }
  // };
export const CoverImageModal = () => {
  
  const params = useParams();
  const update = useMutation(api.documents.update);
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { edgestore } = useEdgeStore();
  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const coverImage = useCoverImage();

  
  console.log("CoverImageModal",coverImage);
 

  const uploadFn: UploadFn = React.useCallback(
    async ({ file, onProgressChange, signal }) => {
      // Set submitting state and file in the upload function
      setIsSubmitting(true);
      setFile(file);
      console.log("File to upload:", coverImage);
      console.log("Cover Image URL:", coverImage.url);

      const res = await edgestore.publicFiles.upload({
        file,
        signal,
        onProgressChange,
        options:{
          replaceTargetUrl: coverImage.url,
        }
      });

      await update({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      });

      onClose(); // Close the modal or perform any additional actions here

      // Log the response
      console.log(res);
      return res;
    },
    [edgestore, params.documentId,coverImage]
  );

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Cover Image
          </DialogTitle>
        </DialogHeader>
        <UploaderProvider uploadFn={uploadFn} autoUpload>
          <SingleImageDropzone
            className="w-full outline-none"
            disabled={isSubmitting}
            dropzoneOptions={{
              maxSize: 1024 * 1024 * 1, // 1 MB
            }}
          />
        </UploaderProvider>
        {/* <SingleImageDropzone
       
       
        value={file}
        // Removed unsupported 'value' prop
        onChange={(event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          onChange(file);
        }}
       /> */}
      </DialogContent>
    </Dialog>
  );
};
