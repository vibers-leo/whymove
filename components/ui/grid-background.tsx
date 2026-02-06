import React from "react";
import { cn } from "@/lib/utils";

export function GridBackground({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "h-screen w-full bg-background dark:bg-grid-white/[0.05] bg-grid-black/[0.05] relative flex items-center justify-center",
        containerClassName
      )}
    >
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
}

export function DotBackground({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "h-screen w-full bg-background dark:bg-dot-white/[0.1] bg-dot-black/[0.1] relative flex items-center justify-center",
        containerClassName
      )}
    >
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
}
