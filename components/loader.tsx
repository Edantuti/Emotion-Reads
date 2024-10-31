import { cn } from "@/lib/utils";

interface AnimatedSVGLoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
}

export function Loader({
  size = "medium",
  color = "currentColor",
  className,
}: AnimatedSVGLoaderProps) {
  const sizeMap = {
    small: 24,
    medium: 48,
    large: 72,
  };

  const pixelSize = sizeMap[size];

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      role="status"
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <style>{`
          @keyframes rotate {
            100% {
              transform: rotate(360deg);
            }
          }
          @keyframes dash {
            0% {
              stroke-dasharray: 1, 150;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 90, 150;
              stroke-dashoffset: -35;
            }
            100% {
              stroke-dasharray: 90, 150;
              stroke-dashoffset: -124;
            }
          }
          .loader-circle {
            animation: rotate 2s linear infinite, dash 1.5s ease-in-out infinite;
            transform-origin: center;
          }
        `}</style>
        <circle className="loader-circle" cx="12" cy="12" r="10" />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
