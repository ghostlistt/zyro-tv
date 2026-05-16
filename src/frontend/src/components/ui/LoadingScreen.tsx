import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"enter" | "pulse" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("pulse"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 1200);
    const t3 = setTimeout(() => onComplete(), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "oklch(0.08 0.01 280)",
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.7s ease-out" : "none",
        pointerEvents: phase === "exit" ? "none" : "all",
      }}
      data-ocid="loading-screen"
      aria-label="Loading Zyro TV"
    >
      {/* Ambient glow background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.65 0.24 295 / 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Lightning bolt SVG */}
        <div
          style={{
            transform:
              phase === "enter"
                ? "scale(0.3)"
                : phase === "pulse"
                  ? "scale(1.05)"
                  : "scale(1.2)",
            opacity: phase === "enter" ? 0 : 1,
            transition:
              phase === "enter"
                ? "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease-out"
                : phase === "pulse"
                  ? "transform 0.8s ease-in-out"
                  : "transform 0.4s ease-in, opacity 0.3s ease-in",
            filter:
              phase === "pulse"
                ? "drop-shadow(0 0 40px oklch(0.65 0.24 295)) drop-shadow(0 0 80px oklch(0.65 0.24 295 / 0.6))"
                : "drop-shadow(0 0 20px oklch(0.65 0.24 295 / 0.8))",
          }}
        >
          <svg
            width="80"
            height="120"
            viewBox="0 0 80 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Lightning bolt"
          >
            {/* Bolt paths */}
            <path
              d="M50 4L8 68H36L30 116L72 48H44L50 4Z"
              fill="oklch(0.65 0.24 295 / 0.3)"
              strokeWidth="0"
            />
            {/* Main bolt */}
            <path
              d="M50 4L8 68H36L30 116L72 48H44L50 4Z"
              fill="url(#boltGradient)"
              stroke="oklch(0.8 0.18 295)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Inner highlight */}
            <path
              d="M48 14L18 62H40L34 100L62 52H40L48 14Z"
              fill="url(#boltHighlight)"
              opacity="0.6"
            />
            <defs>
              <linearGradient
                id="boltGradient"
                x1="40"
                y1="4"
                x2="40"
                y2="116"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="oklch(0.85 0.22 290)" />
                <stop offset="50%" stopColor="oklch(0.65 0.28 295)" />
                <stop offset="100%" stopColor="oklch(0.45 0.22 300)" />
              </linearGradient>
              <linearGradient
                id="boltHighlight"
                x1="40"
                y1="14"
                x2="40"
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                <stop offset="100%" stopColor="white" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            opacity: phase === "enter" ? 0 : 1,
            transform: phase === "enter" ? "translateY(12px)" : "translateY(0)",
            transition:
              "opacity 0.5s ease-out 0.3s, transform 0.5s ease-out 0.3s",
          }}
        >
          <span
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "2rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              background:
                "linear-gradient(135deg, oklch(0.85 0.18 285), oklch(0.65 0.28 295))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ZYRO TV
          </span>
        </div>

        {/* Loading dots */}
        <div
          className="flex gap-1.5"
          style={{
            opacity: phase === "enter" ? 0 : 0.7,
            transition: "opacity 0.4s ease-out 0.5s",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "oklch(0.65 0.24 295)",
                animation: `boltDot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes boltDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
