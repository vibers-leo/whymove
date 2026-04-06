import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const protectedPaths = ['/dashboard', '/community', '/feed', '/notification'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('wm_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/community/:path*', '/feed/:path*', '/notification/:path*'],
};
