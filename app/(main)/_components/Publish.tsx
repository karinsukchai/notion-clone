"use client";

import { Doc } from "@/convex/_generated/dataModel";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {  useState } from "react";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";

interface PublishProps {
  initialData: Doc<"documents">;
}

export const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);
    const promise = update({ id: initialData._id, isPublished: true }).finally(
      () => setIsSubmitting(false)
    );
    setIsSubmitting(false);

    toast.promise(promise, {
      loading: "Publishing note...",
      success: "Note published successfully",
      error: "Failed to publishing note",
    });
  };

  const onUnpublish = () => {
    setIsSubmitting(true);
    const promise = update({ id: initialData._id, isPublished: false }).finally(
      () => setIsSubmitting(false)
    );
    setIsSubmitting(false);
    toast.promise(promise, {
      loading: "Unpublishing note...",
      success: "Note unpublished successfully",
      error: "Failed to unpublishing note",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on the web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8
                bg-muted truncate"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none "
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              disabled={isSubmitting}
              onClick={onUnpublish}
              className="w-full text-xs"
              size="sm"
              
            >
              Unpublish
            </Button>
            
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="text-muted-foreground w-8 h-8 mb-2" />
            <p className="text-sm font-medium mb-2">Publish this note </p>
            <span className="text-sm text-muted-foreground mb-4">
              share your work with the others.
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
