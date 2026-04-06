import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { signToken } from '@/lib/jwt';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password + process.env.JWT_SECRET).digest('hex');
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, name, password_hash FROM whymove.users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const user = result.rows[0];
    if (user.password_hash !== hashPassword(password)) {
      return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

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
