import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('wm_token')?.value;
  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    const result = await pool.query(
      'SELECT id, email, name, avatar_url, created_at FROM whymove.users WHERE id = $1',
      [payload.sub]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ user: result.rows[0] });
  } catch {
    return NextResponse.json({ error: '인증이 만료되었습니다.' }, { status: 401 });
  }
}
