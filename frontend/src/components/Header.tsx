import { Activity, Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="glass-panel border-b border-border/30 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center animate-glow-pulse">
              <Activity className="w-6 h-6 text-background" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider neon-text-cyan">
              NEXUS TRACKER
            </h1>
            <p className="text-xs text-muted-foreground font-body tracking-wide">
              REAL-TIME OBJECT DETECTION SYSTEM
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-xs font-body text-muted-foreground">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
            <Zap className="w-3 h-3 text-neon-magenta" />
            <span className="text-xs font-body text-muted-foreground">v2.0.4</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
