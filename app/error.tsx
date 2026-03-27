"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-4 bg-background">
      <h2 className="text-lg font-bold text-foreground/60">문제가 발생했습니다</h2>
      <p className="text-foreground/30 text-sm">잠시 후 다시 시도해 주세요.</p>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-all duration-300 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]"
      >
        다시 시도
      </button>
    </div>
  );
}
