"use client";

import { useState, useCallback } from "react";
import { getPresignedUrl } from "@/lib/api";

interface UploadedImage {
  fileUrl: string;
  file: File;
  preview: string;
}

export function useImageUpload(maxImages: number = 5) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const addImages = useCallback(
    async (files: File[]) => {
      const remaining = maxImages - images.length;
      const filesToUpload = files.slice(0, remaining);
      if (filesToUpload.length === 0) return;

      setIsUploading(true);
      try {
        const uploaded = await Promise.all(
          filesToUpload.map(async (file) => {
            const { uploadUrl, fileUrl } = await getPresignedUrl(
              file.name,
              file.type
            );
            await fetch(uploadUrl, {
              method: "PUT",
              body: file,
              headers: { "Content-Type": file.type },
            });
            return {
              fileUrl,
              file,
              preview: URL.createObjectURL(file),
            };
          })
        );
        setImages((prev) => [...prev, ...uploaded]);
      } finally {
        setIsUploading(false);
      }
    },
    [images.length, maxImages]
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const clearImages = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  }, [images]);

  const imageUrls = images.map((img) => img.fileUrl);

  return {
    images,
    imageUrls,
    isUploading,
    addImages,
    removeImage,
    clearImages,
  };
}
