# WhyMove 디자인 가이드

## 색상 시스템

### 라이트 모드
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--background` | `#f8fafc` | 배경 |
| `--foreground` | `#0f172a` | 텍스트 |
| `--color-primary` | `#10b981` | 주요 (에메랄드) |
| `--color-secondary` | `#d946ef` | 보조 (퍼플핑크) |
| `--color-accent` | `#0ea5e9` | 강조 (스카이블루) |
| `--selection-bg` | `rgba(14, 165, 233, 0.2)` | 텍스트 선택 |

### 다크 모드 (기본)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--background` | `#020617` | 배경 (슬레이트 950) |
| `--foreground` | `#f1f5f9` | 텍스트 |
| `--color-primary` | `#34d399` | 주요 (밝은 에메랄드) |
| `--color-secondary` | `#e879f9` | 보조 (밝은 퍼플핑크) |
| `--color-accent` | `#38bdf8` | 강조 (밝은 스카이블루) |
| `--selection-bg` | `rgba(56, 189, 248, 0.3)` | 텍스트 선택 |

## 타이포그래피

### 폰트 패밀리
- **sans:** Geist Sans (`--font-geist-sans`)
- **mono:** Geist Mono (`--font-geist-mono`)

## 레이아웃
- 전체 화면 대시보드 (`h-screen`, `overflow-hidden`)
- 최대 너비: `1920px`
- 패딩: `p-3`
- 티커 바: 높이 `h-12`, `backdrop-blur-md`

## 애니메이션
| 이름 | 설정 | 용도 |
|------|------|------|
| `spotlight` | 2초 ease 0.75초 딜레이 | 스포트라이트 효과 |
| `scroll` | 가변 시간 linear infinite | 마키 스크롤 |
| `pulse-subtle` | 3초 ease-in-out infinite | 미세 펄스 |

## 커스텀 유틸리티
| 클래스 | 효과 |
|--------|------|
| `bg-grid-white` / `bg-grid-black` | 그리드 배경 패턴 (32px) |
| `bg-grid-small-white` / `bg-grid-small-black` | 작은 그리드 패턴 (8px) |
| `bg-dot-white` / `bg-dot-black` | 도트 패턴 |

## 다크모드
- `defaultTheme="dark"` (next-themes)
- `enableSystem` 활성화
- 전환 시 `disableTransitionOnChange`
- body: `antialiased transition-colors duration-300`
