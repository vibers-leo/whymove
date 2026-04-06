import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol, name, changePercent } = req.body as {
    symbol: string;
    name: string;
    changePercent: number;
  };

  if (!symbol || !name) {
    return res.status(400).json({ error: '필수 파라미터 누락' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API 키 미설정' });
  }

  try {
    const direction = changePercent > 0 ? '급등' : '급락';
    const prompt = `${name}(${symbol})이 최근 ${Math.abs(changePercent)}% ${direction}했습니다.
원인을 투자 전문가처럼 간결하게 3가지 이유로 설명해주세요.
각 이유는 한 문장(30자 이내)으로, 번호 없이 배열 JSON으로 응답하세요.
예시: ["이유1", "이유2", "이유3"]
투자 권유는 하지 마세요.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API 호출 실패');
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';

    const jsonMatch = raw.match(/\[[\s\S]*?\]/);
    const reasons: string[] = jsonMatch ? JSON.parse(jsonMatch[0]) : ['분석 중 오류가 발생했습니다.'];

    return res.status(200).json({ reasons, disclaimer: '투자 권유 아님. 정보 참고용입니다.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '원인 분석에 실패했습니다.' });
  }
}
