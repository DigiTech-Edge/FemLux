"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Image } from "@nextui-org/react";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // TODO: Implement actual file upload to storage
      // For now, create a temporary URL
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      onChange(url);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-neutral-200 hover:border-primary"
          }
        `}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative w-full aspect-video">
            <Image
              src={value}
              alt="Upload preview"
              className="object-cover rounded-lg"
              width={400}
              height={300}
            />
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-default-400" />
            <div className="text-sm text-default-500">
              {isDragActive ? (
                <p>Drop the image here</p>
              ) : (
                <p>
                  Drag & drop an image here, or{" "}
                  <span className="text-primary">click to select</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
