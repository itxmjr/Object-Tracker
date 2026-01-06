"use client";
import { useState, useCallback } from "react";
import { Upload, FileVideo, Play, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  onVideoUploaded: (file: File) => void;
}

const VideoUpload = ({ onVideoUploaded }: VideoUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsProcessed(true);
          onVideoUploaded(selectedFile);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  }, [onVideoUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleReset = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsProcessed(false);
  };

  if (isProcessed && file) {
    return (
      <div className="glass-panel p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
              <FileVideo className="w-5 h-5 text-neon-cyan" />
            </div>
            <div>
              <p className="font-body font-semibold text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Processed
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative aspect-video rounded-lg overflow-hidden bg-background/50 border border-border/50">
          <video
            src={URL.createObjectURL(file)}
            className="w-full h-full object-contain"
            controls
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="glass" size="sm">
              Before
            </Button>
            <Button variant="neon" size="sm">
              After
            </Button>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button variant="cyber" className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            View Detection Results
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Upload New
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "glass-panel p-8 border-2 border-dashed transition-all duration-300 cursor-pointer group",
        isDragOver
          ? "border-neon-cyan bg-neon-cyan/5 shadow-[0_0_30px_hsl(var(--neon-cyan)/0.3)]"
          : "border-border/50 hover:border-neon-cyan/50 hover:bg-muted/20"
      )}
    >
      {isUploading ? (
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-cyan/20 flex items-center justify-center">
            <FileVideo className="w-8 h-8 text-neon-cyan animate-pulse" />
          </div>
          <p className="font-body font-semibold text-foreground mb-2">
            Processing: {file?.name}
          </p>
          <Progress value={uploadProgress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            {Math.round(uploadProgress)}% Complete
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className={cn(
            "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300",
            isDragOver
              ? "bg-neon-cyan/30 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]"
              : "bg-muted/50 group-hover:bg-neon-cyan/20"
          )}>
            <Upload className={cn(
              "w-10 h-10 transition-all duration-300",
              isDragOver ? "text-neon-cyan scale-110" : "text-muted-foreground group-hover:text-neon-cyan"
            )} />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            DROP VIDEO FILE HERE
          </h3>
          <p className="text-muted-foreground font-body mb-4">
            or click to browse your files
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded bg-muted/50">MP4</span>
            <span className="px-2 py-1 rounded bg-muted/50">AVI</span>
            <span className="px-2 py-1 rounded bg-muted/50">MOV</span>
            <span className="px-2 py-1 rounded bg-muted/50">WEBM</span>
          </div>
          <input
            type="file"
            accept="video/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileSelect(selectedFile);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
