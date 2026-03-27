import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-4 bg-background">
      <h2 className="text-5xl font-bold text-foreground/20">404</h2>
      <p className="text-foreground/40 text-sm">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-all duration-300 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
