"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  
  const params = useParams();
  const coverImage = useCoverImage();
  const {edgestore} = useEdgeStore();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const onRemove = async() =>{
    
    if(url){
     await edgestore.publicFiles.delete({
        url : url
      })
}

    removeCoverImage({
      id : params.documentId as Id<"documents">
    });
  };
  
    return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill alt="cover" className="object-cover" />}
      {url && !preview && (
        <div
          className="opacity-0 group-hover:opacity-100 absolute 
            bottom-5 right-5 flex items-center gap-x-2"
        >
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change Cover
          </Button>

          <ConfirmModal onConfirm={onRemove}>
          <Button
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
              </ConfirmModal>
          
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return(
    <Skeleton className="w-full h-[20vh] " />
  )
}