"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Sparkles, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": []
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // 1. Upload to Python backend for Gemini Analysis
      const formData = new FormData();
      formData.append("file", file);

      // We default to localhost:8000 for local Python backend
      const pythonApiUrl = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/analysis`
        : "http://127.0.0.1:8000/api/analysis";
      
      const analysisResponse = await axios.post(pythonApiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const report = analysisResponse.data;

      // 2. Convert image to base64 to save with report (for simplicity in MVP)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        try {
          // 3. Save to Next.js API (Prisma)
          const saveResponse = await axios.post("/api/save-analysis", {
            report,
            image: base64Image
          });

          const { analysisId } = saveResponse.data;

          // 4. Redirect to report page
          router.push(`/dashboard/reports/${analysisId}`);
        } catch (saveError) {
          console.error("Error saving analysis:", saveError);
          setError("Analysis succeeded, but failed to save to database.");
          setIsAnalyzing(false);
        }
      };
    } catch (analyzeError) {
      console.error("Error analyzing image:", analyzeError);
      setError("Failed to analyze image. Please ensure the Python backend is running.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-medium tracking-tight mb-2">New Analysis</h1>
        <p className="text-gray-500">Upload an interface screenshot to get instant UX feedback.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        {!file ? (
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              isDragActive ? "border-black bg-gray-50" : "border-gray-200 hover:border-black hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Drag and drop your screenshot</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Support for JPG, PNG and WEBP. High resolution recommended for best AI accuracy.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
              Browse Files
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center min-h-[300px] max-h-[600px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={preview!} 
                alt="Upload preview" 
                className="max-w-full max-h-[600px] object-contain"
              />
              <button 
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                disabled={isAnalyzing}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:bg-white transition-colors disabled:opacity-50"
              >
                Change Image
              </button>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-black text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70 text-lg shadow-lg shadow-black/10"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Interface
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
