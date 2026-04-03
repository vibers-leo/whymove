## 전략 문서 (개발 전 반드시 숙지)
- **전략 진단 리포트**: `data/STRATEGY_ANALYSIS.md`
- **PM 공통 지침**: 맥미니 루트 `pm.md`
- **gstack 빌더 철학**: 맥미니 루트 `gstack.md` — Boil the Lake, Search Before Building, 스프린트 프로세스
- **개발 프로세스**: Think → Plan → Build → Review → Test → Ship → Reflect
- **핵심 규칙**: 테스트 동시 작성, 새 패턴 도입 전 검색, 압축률 기반 추정

### 전략 핵심 요약
- 차별화: 위젯 기반 개인화 레이아웃이 기존 앱 대비 유일한 경쟁력
- 데이터 API 비용이 생존 과제: CoinGecko(무료) → Alpha Vantage로 시작하여 구독료로 커버
- 실시간 데이터 연동이 Phase 1 필수 과제 (현재 목 데이터만 있음)
- 프로토타입 수준에서 실제 제품으로의 전환: 인증 + 포트폴리오 추적 + 알림이 MVP 완성 기준
- 경쟁 치열한 시장(트래딩뷰), 빠른 시장 선점과 커뮤니티(Reddit/Discord) 확보가 성패 결정

---

# WhyMove (와이무브)

## 프로젝트 개요
암호화폐/금융 실시간 대시보드 웹앱. Supabase 실시간 기능 + 드래그 가능한 위젯 대시보드.

## 기술 스택
- Framework: Next.js 16 (canary)
- Language: TypeScript
- 스타일링: Tailwind CSS v4
- 상태 관리: 컴포넌트 로컬 state
- 백엔드: Supabase (실시간 DB)
- 차트: Lightweight Charts (TradingView)
- 레이아웃: react-grid-layout (드래그 가능 위젯)
- 애니메이션: Framer Motion
- 테마: next-themes (다크/라이트)

## 개발 규칙

### 코드 스타일
- TypeScript strict mode 사용
- 한글 우선 원칙: 모든 UI 텍스트와 주석은 한국어
- 시맨틱 라인 브레이크: UI 텍스트는 의미 단위로 줄바꿈

### 디자인 준수
- Tailwind CSS v4 유틸리티 클래스 사용
- CSS 변수 기반 테마 시스템 (globals.css 참조)
- 다크모드 기본 (`defaultTheme="dark"`)

### Git 규칙
- 커밋 메시지: 한글 (feat:, fix:, refactor:, chore: 접두사)
- 브랜치: main → feature/기능명

## 주요 명령어
```bash
bun install        # 의존성 설치
bun dev            # 개발 서버
bun run build      # 빌드
bun run lint       # 린트
```

## 디렉토리 구조
```
app/
├── layout.tsx       # 루트 레이아웃 (ThemeProvider, AuthProvider)
├── page.tsx         # 메인 대시보드 (실시간 티커, 위젯)
├── globals.css      # 테마 변수, 커스텀 유틸리티
├── about/           # 소개 페이지
└── auth/            # 인증 (Supabase OAuth 콜백)
components/
├── ui/              # 공통 UI (GridBackground, Spotlight, LiveTicker)
├── layout/          # 레이아웃 (Header)
├── dashboard/       # 대시보드 위젯
├── auth/            # 인증 관련
└── theme-provider   # 다크/라이트 테마
lib/
└── supabase.ts      # Supabase 클라이언트
```

## AI Recipe 이미지 API

이 프로젝트는 **AI Recipe 중앙 이미지 서비스**를 사용합니다.

### 사용 가능한 함수

```typescript
import { searchStockImage, generateAIImage } from '@/lib/ai-recipe-client';
```

### Stock Image 검색
```typescript
const image = await searchStockImage('cryptocurrency trading dashboard', {
  orientation: 'landscape',
  size: 'large',
});
// → { url, provider, alt, photographer, ... }
```

### AI 이미지 생성
```typescript
const image = await generateAIImage('financial data visualization chart, dark theme neon colors', {
  size: 'large',
  provider: 'auto',
});
// → { url, prompt, provider }
```

### 주요 용도
- 대시보드 시각 자료
- 위젯 배경 이미지
- 차트/데이터 시각화 보조

### 주의사항
- Server Action이나 API Route에서만 사용 (API 키 보호)
- Rate Limit: 1000회/일
- AI Recipe 서버 실행 필요: http://localhost:3300

## 상위 브랜드
- 회사: 계발자들 (Vibers)
- 도메인: vibers.co.kr


## 세션로그 기록 (필수)
- 모든 개발 대화의 주요 내용을 `session-logs/` 폴더에 기록할 것
- 파일명: `YYYY-MM-DD_한글제목.md` / 내용: 한글
- 세션 종료 시, 마일스톤 달성 시, **컨텍스트 압축 전**에 반드시 저장
- 상세 포맷은 상위 CLAUDE.md 참조
