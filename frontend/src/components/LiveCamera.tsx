"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, CameraOff, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Track {
  id: number;
  bbox: [number, number, number, number];
  label: string;
  conf: number;
  trail?: Array<{ x: number; y: number }>;
}

interface LiveCameraProps {
  tracks: Track[];
  showTrackHistory: boolean;
  onTrackUpdate?: (tracks: Track[]) => void;
}

const TRACK_COLORS = [
  "hsl(187, 100%, 42%)", // Cyan
  "hsl(292, 84%, 61%)", // Magenta
  "hsl(45, 100%, 50%)",  // Gold
  "hsl(120, 70%, 50%)", // Green
  "hsl(200, 100%, 60%)", // Blue
  "hsl(350, 80%, 60%)", // Red
  "hsl(270, 80%, 60%)", // Purple
  "hsl(30, 100%, 55%)", // Orange
];

const LiveCamera = ({ tracks, showTrackHistory }: LiveCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const animationRef = useRef<number | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setHasPermission(true);
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const getTrackColor = (id: number) => {
    return TRACK_COLORS[id % TRACK_COLORS.length];
  };

  const drawOverlays = useCallback(function draw() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !isStreaming) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas size to video
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw tracks
    tracks.forEach((track) => {
      const [x1, y1, x2, y2] = track.bbox;
      const color = getTrackColor(track.id);
      const width = x2 - x1;
      const height = y2 - y1;

      // Draw trail if enabled
      if (showTrackHistory && track.trail && track.trail.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.moveTo(track.trail[0].x, track.trail[0].y);
        track.trail.forEach((point, i) => {
          if (i > 0) {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw bounding box with glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, width, height);

      // Draw corner accents
      const cornerSize = 15;
      ctx.lineWidth = 4;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(x1, y1 + cornerSize);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1 + cornerSize, y1);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(x2 - cornerSize, y1);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x2, y1 + cornerSize);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(x1, y2 - cornerSize);
      ctx.lineTo(x1, y2);
      ctx.lineTo(x1 + cornerSize, y2);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(x2 - cornerSize, y2);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2, y2 - cornerSize);
      ctx.stroke();

      // Reset shadow for label
      ctx.shadowBlur = 0;

      // Draw label background
      const labelValue = `${track.label.toUpperCase()} [ID: ${track.id}] - ${Math.round(track.conf * 100)}%`;
      ctx.font = "bold 14px Rajdhani";
      const labelWidth = ctx.measureText(labelValue).width + 16;
      const labelHeight = 24;

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(x1, y1 - labelHeight - 4, labelWidth, labelHeight);
      ctx.globalAlpha = 1;

      // Draw label text
      ctx.fillStyle = "#0a0a0f";
      ctx.fillText(labelValue, x1 + 8, y1 - 10);
    });

    animationRef.current = requestAnimationFrame(draw);
  }, [tracks, showTrackHistory, isStreaming]);

  useEffect(() => {
    if (isStreaming) {
      animationRef.current = requestAnimationFrame(drawOverlays);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isStreaming, drawOverlays]);

  return (
    <div className={cn(
      "glass-panel overflow-hidden transition-all duration-300",
      isFullscreen && "fixed inset-4 z-50"
    )}>
      <div className="relative aspect-video bg-background/80">
        {!isStreaming ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300",
              hasPermission === false
                ? "bg-destructive/20"
                : "bg-neon-cyan/20 animate-pulse-glow"
            )}>
              {hasPermission === false ? (
                <CameraOff className="w-12 h-12 text-destructive" />
              ) : (
                <Camera className="w-12 h-12 text-neon-cyan" />
              )}
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {hasPermission === false ? "CAMERA ACCESS DENIED" : "INITIALIZE CAMERA"}
            </h3>
            <p className="text-muted-foreground font-body mb-6 text-center max-w-md">
              {hasPermission === false
                ? "Please enable camera permissions in your browser settings"
                : "Click below to activate real-time object detection"}
            </p>
            <Button
              variant="neon"
              size="lg"
              onClick={startCamera}
              disabled={hasPermission === false}
            >
              <Camera className="w-5 h-5 mr-2" />
              START LIVE FEED
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent h-[200%] animate-scan" />
            </div>

            {/* Controls overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="glass"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
              <Button variant="glass" size="icon" onClick={stopCamera}>
                <CameraOff className="w-4 h-4" />
              </Button>
            </div>

            {/* Live indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/90 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
              <span className="text-xs font-body font-bold text-foreground">LIVE</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveCamera;
