"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
  isLoading?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFileAccepted, isLoading }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          setPreview(URL.createObjectURL(file));
          onFileAccepted(file);
        }
      }
    },
    [onFileAccepted]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type.startsWith("image/")) {
          setPreview(URL.createObjectURL(file));
          onFileAccepted(file);
        }
      }
    },
    [onFileAccepted]
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!preview ? (
        <div
          className={cn(
            "relative group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out cursor-pointer glass-panel",
            isDragActive
              ? "border-primary bg-primary/10 scale-[1.02] glow-primary"
              : "border-white/20 hover:border-primary/50 hover:bg-white/5"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            accept="image/*"
            onChange={handleChange}
            disabled={isLoading}
          />
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className="p-4 mb-4 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
              <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <p className="mb-2 text-lg font-medium text-gray-200">
              <span className="text-primary font-bold">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-400">SVG, PNG, JPG or GIF</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-white/20 p-2">
          <div className="relative h-64 w-full bg-black/50 rounded-xl overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Upload preview" className="max-h-full max-w-full object-contain" />
            {isLoading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white font-medium animate-pulse">Analyzing UI with FlowSense AI...</p>
              </div>
            )}
          </div>
          {!isLoading && (
            <button
              onClick={() => {
                setPreview(null);
              }}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white backdrop-blur-md transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
