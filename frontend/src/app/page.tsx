"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/Header";
import ModeToggle from "@/components/ModeToggle";
import VideoUpload from "@/components/VideoUpload";
import LiveCamera from "@/components/LiveCamera";
import ControlPanel from "@/components/ControlPanel";
import StatsSidebar from "@/components/StatsSidebar";

const queryClient = new QueryClient();

interface Track {
  id: number;
  bbox: [number, number, number, number];
  label: string;
  conf: number;
  trail?: Array<{ x: number; y: number }>;
}

export default function Home() {
  const [mode, setMode] = useState<"upload" | "live">("upload");
  const [showTrackHistory, setShowTrackHistory] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [iouThreshold, setIouThreshold] = useState(0.45);
  const [modelSize, setModelSize] = useState("small");

  // Simulated tracking data
  const [tracks, setTracks] = useState<Track[]>([]);
  const [stats, setStats] = useState({
    totalTracked: 0,
    currentFps: 0,
    activeIds: [] as number[],
    processingTime: 0,
  });

  // Simulate WebSocket data for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const numTracks = Math.floor(Math.random() * 5) + 1;
      const newTracks: Track[] = Array.from({ length: numTracks }, (_, i) => ({
        id: i + 1,
        bbox: [
          100 + Math.random() * 400,
          100 + Math.random() * 200,
          300 + Math.random() * 400,
          300 + Math.random() * 200,
        ] as [number, number, number, number],
        label: ["person", "car", "bicycle", "dog", "cat"][Math.floor(Math.random() * 5)],
        conf: 0.7 + Math.random() * 0.3,
      }));

      setTracks(newTracks);
      setStats({
        totalTracked: Math.floor(Math.random() * 500) + 100,
        currentFps: 25 + Math.random() * 10,
        activeIds: newTracks.map((t) => t.id),
        processingTime: 15 + Math.random() * 20,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVideoUploaded = (file: File) => {
    console.log("Video uploaded:", file.name);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background cyber-grid">
        <Header />

        <main className="container mx-auto px-4 py-6">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main View */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {mode === "upload" ? (
                <VideoUpload onVideoUploaded={handleVideoUploaded} />
              ) : (
                <LiveCamera
                  tracks={tracks}
                  showTrackHistory={showTrackHistory}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5 xl:col-span-4 grid grid-cols-1 xl:grid-cols-1 gap-4 content-start">
              <ControlPanel
                showTrackHistory={showTrackHistory}
                onShowTrackHistoryChange={setShowTrackHistory}
                confidenceThreshold={confidenceThreshold}
                onConfidenceThresholdChange={setConfidenceThreshold}
                iouThreshold={iouThreshold}
                onIouThresholdChange={setIouThreshold}
                modelSize={modelSize}
                onModelSizeChange={setModelSize}
              />

              <StatsSidebar
                totalTracked={stats.totalTracked}
                currentFps={stats.currentFps}
                activeIds={stats.activeIds}
                processingTime={stats.processingTime}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-sm text-muted-foreground font-body">
            <p>NEXUS TRACKER v2.0.4 • Real-time Object Detection System</p>
            <p className="mt-1 text-xs">
              Powered by YOLOv8 • WebSocket Connection Ready
            </p>
          </footer>
        </main>
      </div>
    </QueryClientProvider>
  );
}
