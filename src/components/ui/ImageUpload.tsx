"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { uploadMultipleImages, deleteImage } from "@/utils/supabase/storage";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import { Progress } from "@nextui-org/react";

interface ImageUploadProps {
  value: string[];
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  bucket?: string;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  disabled,
  onChange,
  onRemove,
  bucket = "default",
  maxFileSize = MAX_FILE_SIZE,
  maxFiles = MAX_FILES,
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

  const handleRemove = async (url: string) => {
    try {
      const result = await deleteImage(url, bucket);
      if (result.success) {
        onRemove(url);
      } else {
        setError("Failed to remove image. Please try again.");
      }
    } catch (error) {
      console.error("Error removing image:", error);
      setError("Failed to remove image. Please try again.");
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

        onChange([...value, ...urls]);
      } catch (error) {
        console.error("Error uploading images:", error);
        setError("Failed to upload images. Please try again.");
      } finally {
        setLoading(false);
        setUploadProgress(0);
      }
    },
    [onChange, value, bucket, maxFileSize, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".webp"],
    },
    disabled: disabled || loading,
    maxFiles,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative
          border-2
          border-dashed
          rounded-lg
          p-4
          h-32
          flex
          flex-col
          items-center
          justify-center
          gap-2
          hover:bg-neutral-50
          transition
          cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-neutral-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
            <div className="w-full mt-2">
              <Progress value={uploadProgress} />
            </div>
          </div>
        ) : (
          <>
            <Upload className="h-6 w-6 text-gray-400" />
            <p className="text-sm text-gray-500">
              Drag & drop or click to upload
            </p>
          </>
        )}
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence>
          {value.map((url) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square"
            >
              <Image
                src={url}
                alt="Upload"
                className="object-cover rounded-lg"
                fill
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-sm hover:scale-110 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageUpload;
