import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { signToken } from '@/lib/jwt';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password + process.env.JWT_SECRET).digest('hex');
}

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 });
  }

  try {
    const existing = await pool.query('SELECT id FROM whymove.users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: '이미 가입된 이메일입니다.' }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    const result = await pool.query(
      'INSERT INTO whymove.users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, name, passwordHash]
    );
    const user = result.rows[0];

    const token = await signToken({ sub: String(user.id), email: user.email, name: user.name });

    const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
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
