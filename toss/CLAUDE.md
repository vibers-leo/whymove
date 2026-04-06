# whymove/toss — 앱인토스 미니앱

왜 움직여 앱인토스 버전. 급변 종목 AI 원인 피드.

## 앱인토스 개발 가이드

```
@~/.claude/skills/appintoss/SKILL.md
```

## 앱 정보

- **appName**: whymove
- **displayName**: 왜 움직여
- **primaryColor**: #3182F6
- **흐름**: 진입 → 급변 피드 → AI 원인 3줄 → 알림 설정

## 기술 스택

- Vite + React + TypeScript
- Tailwind CSS v4
- framer-motion, lucide-react
- Gemini 2.0 Flash API (원인 분석)
- CoinGecko API 연동 예정

## 개발 명령어

```bash
npm run dev        # localhost:3420
npx vercel dev --listen 3421  # API 서버
npm run build
```

## 핵심 컴포넌트

- `src/components/PriceFeedPage.tsx` — 메인 피드 페이지
- `api/price-feed.ts` — Gemini 원인 분석 API

## 면책조항

투자 권유 아님. 정보 참고용 문구 반드시 유지.

## 콘솔

https://apps-in-toss.toss.im/ (bababapet@naver.com)
