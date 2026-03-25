import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-foreground/60">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
