import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { signToken } from '@/lib/jwt';

// Google OAuth callback — receives { googleId, email, name, avatarUrl } from client
export async function POST(req: NextRequest) {
  const { googleId, email, name, avatarUrl } = await req.json();

  if (!googleId || !email) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  try {
    let user;
    const existing = await pool.query(
      'SELECT id, email, name FROM whymove.users WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );

    if (existing.rows.length > 0) {
      // 기존 유저 — google_id, avatar 업데이트
      const updated = await pool.query(
        'UPDATE whymove.users SET google_id = $1, avatar_url = $2, updated_at = NOW() WHERE id = $3 RETURNING id, email, name',
        [googleId, avatarUrl, existing.rows[0].id]
      );
      user = updated.rows[0];
    } else {
      const result = await pool.query(
        'INSERT INTO whymove.users (email, name, google_id, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id, email, name',
        [email, name, googleId, avatarUrl]
      );
      user = result.rows[0];
    }

    const token = await signToken({ sub: String(user.id), email: user.email, name: user.name });

    const response = NextResponse.json({ user });
    response.cookies.set('wm_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
