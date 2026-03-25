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
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">문제가 발생했습니다</h2>
      <p className="text-foreground/60">잠시 후 다시 시도해 주세요.</p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80"
      >
        다시 시도
      </button>
    </div>
  );
}
