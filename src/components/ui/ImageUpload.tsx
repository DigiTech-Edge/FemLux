"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { uploadMultipleImages } from "@/utils/supabase/storage";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import { Progress } from "@nextui-org/react";
import { cn } from "@/helpers/utils";

interface ImageUploadProps {
  value?: string[];
  disabled?: boolean;
  onChange: (urls: string[]) => void;
  onRemove?: (url: string) => void;
  bucket?: string;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  className?: string;
  compact?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  disabled,
  onChange,
  onRemove,
  bucket = "default",
  maxFileSize = MAX_FILE_SIZE,
  maxFiles = MAX_FILES,
  className,
  compact = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: maxFileSize / (1024 * 1024), // Convert to MB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  const handleDelete = async (url: string) => {
    if (onRemove) {
      onRemove(url);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setError(null);
        setLoading(true);

        // Validate number of files
        if (value.length + acceptedFiles.length > maxFiles) {
          setError(`Maximum ${maxFiles} files allowed`);
          return;
        }

        // Validate file sizes and types
        for (const file of acceptedFiles) {
          if (file.size > maxFileSize) {
            setError(
              `File ${file.name} is larger than ${
                maxFileSize / (1024 * 1024)
              }MB`
            );
            return;
          }
        }

        // Compress images
        const compressedFiles = await Promise.all(
          acceptedFiles.map(compressImage)
        );

        // Upload compressed images
        const urls = await uploadMultipleImages(
          compressedFiles,
          bucket,
          (progress) => {
            setUploadProgress(progress);
          }
        );

        // Add new URLs to existing ones
        onChange([...value, ...urls]);
      } catch (error) {
        console.error("Error uploading images:", error);
        setError("Failed to upload images. Please try again.");
      } finally {
        setLoading(false);
        setUploadProgress(0);
      }
    },
    [value, onChange, maxFileSize, maxFiles, bucket]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    disabled: disabled || loading,
    maxFiles,
  });

  return (
    <>
      <div className="space-y-4 w-full">
        <div
          {...getRootProps()}
          className={cn(
            "relative cursor-pointer rounded-lg border-2 border-dashed transition-colors",
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-default-300 hover:border-primary",
            disabled && "cursor-not-allowed opacity-60",
            compact ? "aspect-square" : "min-h-[200px]",
            className
          )}
        >
          <input {...getInputProps()} />
          <div
            className={cn(
              "flex flex-col items-center justify-center h-full gap-2",
              compact ? "p-2" : "p-4"
            )}
          >
            {loading ? (
              <>
                <Loader2
                  className={cn(
                    "animate-spin text-default-500",
                    compact ? "h-6 w-6" : "h-10 w-10"
                  )}
                />
                {!compact && (
                  <Progress
                    size="sm"
                    value={uploadProgress}
                    className="max-w-md"
                    showValueLabel={true}
                  />
                )}
              </>
            ) : (
              <>
                <Upload
                  className={cn(
                    "text-default-500",
                    compact ? "h-6 w-6" : "h-10 w-10"
                  )}
                />
                {!compact && (
                  <>
                    <p className="text-default-600 font-medium">
                      Drop your images here
                    </p>
                    <p className="text-default-400 text-sm">
                      PNG, JPG, GIF up to {maxFileSize / (1024 * 1024)}MB
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {error && <p className="text-danger text-sm mt-2">{error}</p>}

        {value.length > 0 && !compact && (
          <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>
              {value.map((url, index) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-default-300"
                >
                  <Image
                    src={url}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <button
                    onClick={() => handleDelete(url)}
                    className="absolute top-2 right-2 p-1 bg-danger rounded-full text-white hover:bg-danger-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageUpload;
