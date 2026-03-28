"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  TrendingUp,
  MessageCircle,
  Bell,
  Clock,
  Shield,
  ChevronRight,
  BarChart3,
  AlertTriangle,
  Globe,
  ArrowRight,
  CheckCircle2,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 애니메이션 카운터
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

// 기능 카드
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) => (
  <div
    className="group relative p-6 rounded-2xl glass-card hover:border-emerald-500/20 transition-all duration-500"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/15 transition-colors">
      <Icon className="w-5 h-5 text-emerald-400" />
    </div>
    <h3 className="text-base font-bold text-foreground mb-2 break-keep-all">{title}</h3>
    <p className="text-sm text-foreground/50 leading-relaxed break-keep-all">{description}</p>
  </div>
);

export default function AboutPage() {
  return (
    <main className="min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      {/* 노이즈 텍스처 */}
      <div className="noise-overlay" />

      {/* 내비게이션 — 글래스 */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-white/[0.04]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-zinc-950 text-sm transition-transform duration-300 group-hover:scale-105">
              W
            </div>
            <span className="font-bold text-base tracking-tight">WhyMove</span>
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-sm hover:bg-emerald-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
          >
            대시보드 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* 히어로 — 스플릿 레이아웃 */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85dvh] flex items-center">
        {/* 배경 그래디언트 메시 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-600/[0.04] rounded-full blur-[128px]" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* 좌측 텍스트 — 60% */}
            <div className="lg:col-span-3">
              {/* 배지 */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 tracking-wide">선물 트레이더를 위한 변동성 알림</span>
              </div>

              {/* 헤드라인 */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight break-keep-all">
                <span className="text-emerald-400">&ldquo;왜 움직이는 거야?&rdquo;</span>
                <br />
                그 답을 가장 먼저
                <br />
                알려드립니다
              </h1>

              {/* 서브헤드라인 */}
              <p className="text-base md:text-lg text-foreground/50 max-w-[540px] mb-10 leading-relaxed break-keep-all">
                트럼프 발언, 경제지표 발표, 인플루언서 트윗 등
                시장에 변동성을 일으키는 이슈를 실시간으로 전달합니다.
                방향 예측이 아닌, 변동성 발생 사실만 알립니다.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/"
                  className="px-8 py-4 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-base hover:bg-emerald-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  지금 시작하기 <ChevronRight className="w-5 h-5" />
                </Link>
                <a
                  href="#features"
                  className="px-8 py-4 rounded-xl border border-white/[0.08] text-foreground/80 font-medium text-base hover:bg-white/[0.04] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  기능 살펴보기
                </a>
              </div>
            </div>

            {/* 우측 비주얼 — 40% */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="relative">
                {/* 메인 카드 */}
                <div className="glass-card rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Alert</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-subtle" />
                  </div>

                  {/* 알림 아이템들 */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground/80 break-keep-all">트럼프, 비트코인 전략 비축 서명</p>
                        <p className="text-[10px] text-foreground/30 mt-0.5">0.5초 전</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                        <BarChart3 className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground/80 break-keep-all">CPI 3.4% — 예상치 상회</p>
                        <p className="text-[10px] text-foreground/30 mt-0.5">2분 전</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground/80 break-keep-all">BTC 고래 12,400 BTC 매집 감지</p>
                        <p className="text-[10px] text-foreground/30 mt-0.5">5분 전</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 플로팅 뱃지 */}
                <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold animate-float">
                  0.5초 알림
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 경고 배너 */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/10">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-400/70 break-keep-all">
              우리는 방향을 예측하지 않습니다. 변동성 발생을 알릴 뿐입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 무엇을 하는가 / 하지 않는가 — 비대칭 레이아웃 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-6">
            {/* 하지 않는 것 — 2fr */}
            <div className="md:col-span-2 p-6 rounded-2xl border border-red-500/10 bg-red-500/[0.02]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                  <span className="text-red-400 text-xs font-bold">X</span>
                </div>
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">하지 않는 것</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "방향 예측 (오른다/내린다)",
                  "매수/매도 시그널 제공",
                  "투자 조언이나 추천",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/50 break-keep-all">
                    <span className="text-red-400/60 mt-0.5 text-xs">--</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* 하는 것 — 3fr */}
            <div className="md:col-span-3 p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">WhyMove가 하는 것</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "이슈가 발생했다는 팩트를 즉시 전달",
                  "변동성이 생기고 있다, 또는 생길 수 있다는 알림",
                  "트레이더들 간의 실시간 정보 교류 공간 제공",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/60 break-keep-all">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400/60 mt-0.5 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 수치 지표 — 메트릭 바 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 500, suffix: "ms", label: "평균 알림 속도" },
              { value: 50, suffix: "+", label: "추적 인플루언서" },
              { value: 24, suffix: "/7", label: "실시간 모니터링" },
              { value: 1000, suffix: "+", label: "활성 트레이더" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-xl p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 tabular-nums mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs text-foreground/40 font-medium tracking-wide break-keep-all">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 문제점 / 해결책 — 지그재그 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          {/* 문제 */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                <span className="text-xs font-bold text-red-400 tracking-wide">PROBLEM</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight leading-tight break-keep-all">
                선물 트레이더의 <span className="text-red-400">고통</span>
              </h2>
              <p className="text-foreground/40 mb-8 break-keep-all">
                갑자기 차트가 움직인다. 왜 움직이는 거야?
                이유를 모르면 대응할 수 없습니다.
              </p>
              <div className="space-y-4">
                {[
                  "급등락이 시작됐는데, 왜 움직이는지 모른다",
                  "알고 보니 10분 전에 트럼프가 무슨 말을 했다",
                  "변동성의 원인을 찾느라 텔레그램, X, 뉴스를 다 뒤진다",
                  "내가 알았을 땐 이미 움직임이 끝났다",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-red-400 text-[10px] font-bold">X</span>
                    </div>
                    <p className="text-sm text-foreground/50 break-keep-all">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-72 lg:h-80 rounded-2xl glass-card flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.03] to-orange-500/[0.02]" />
              <div className="relative text-center">
                <AlertTriangle className="w-12 h-12 text-red-400/30 mx-auto mb-4" />
                <p className="text-foreground/30 text-lg font-bold break-keep-all">&ldquo;왜 움직이는 거야?&rdquo;</p>
                <p className="text-foreground/20 text-sm mt-2 break-keep-all">이유를 모르면 대응 불가</p>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold animate-pulse-subtle">
                급락 중...
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold animate-pulse-subtle">
                원인 검색 중...
              </div>
            </div>
          </div>

          {/* 해결 — 반대 방향 */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative h-72 lg:h-80 rounded-2xl glass-card flex items-center justify-center overflow-hidden order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-teal-500/[0.02]" />
              <div className="relative text-center">
                <Zap className="w-12 h-12 text-emerald-400/30 mx-auto mb-4" />
                <p className="text-foreground/30 text-lg font-bold break-keep-all">&ldquo;트럼프가 방금 트윗했어&rdquo;</p>
                <p className="text-foreground/20 text-sm mt-2 break-keep-all">변동성 예상 → 대비 가능</p>
              </div>
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold animate-float">
                0.5초 전 알림
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                변동성 주의
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <span className="text-xs font-bold text-emerald-400 tracking-wide">SOLUTION</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight leading-tight break-keep-all">
                WhyMove의 <span className="text-emerald-400">해답</span>
              </h2>
              <p className="text-foreground/40 mb-8 break-keep-all">
                움직이는 이유를 가장 먼저 알려주고,
                다가올 변동성을 미리 대비하게 합니다.
              </p>
              <div className="space-y-4">
                {[
                  "X, 스레드, 트루스소셜에서 주요 인플루언서 게시물 실시간 수집",
                  "트럼프, 머스크 등 마켓 무버 발언 즉시 알림",
                  "CPI, FOMC 등 경제 이벤트 일정 미리 알림",
                  "트레이더들과 실시간 채팅으로 빠른 정보 교류",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400/60 shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/60 break-keep-all">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 메시지 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight break-keep-all">
              우리는 <span className="text-amber-400">&ldquo;방향&rdquo;</span>을 알려주지 않습니다
            </h3>
            <p className="text-base text-foreground/50 mb-4 break-keep-all">
              하지만 <span className="text-emerald-400 font-bold">&ldquo;변동성이 온다&rdquo;</span>는 것은
              누구보다 빠르게 알려드립니다.
            </p>
            <p className="text-foreground/30 text-sm break-keep-all">
              방향은 여러분이 판단하세요. 우리는 판단할 시간을 드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* 기능 — 벤토 그리드 */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="text-xs font-bold text-emerald-400 tracking-wide">FEATURES</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight break-keep-all">핵심 기능</h2>
            <p className="text-foreground/40 mt-3 break-keep-all">변동성에 대비하기 위한 모든 도구</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={Globe}
              title="소셜 미디어 추적"
              description="X, 스레드, 트루스소셜에서 주요 인플루언서의 게시물을 실시간으로 수집하고 번역합니다."
              delay={0}
            />
            <FeatureCard
              icon={Bell}
              title="변동성 알림"
              description="시장에 영향을 줄 수 있는 이슈 발생 시 즉시 알림을 받아보세요. 대비할 시간을 드립니다."
              delay={100}
            />
            <FeatureCard
              icon={BarChart3}
              title="경제 캘린더"
              description="CPI, FOMC, 고용지표 등 변동성을 유발하는 경제 이벤트 일정을 미리 확인하세요."
              delay={200}
            />
            <FeatureCard
              icon={MessageCircle}
              title="실시간 채팅"
              description="다른 트레이더들과 실시간으로 정보를 교류하세요. 혼자보다 빠릅니다."
              delay={300}
            />
            <FeatureCard
              icon={TrendingUp}
              title="실시간 차트"
              description="TradingView 차트와 알림을 함께 보면서 상황을 즉시 파악하세요."
              delay={400}
            />
            <FeatureCard
              icon={Shield}
              title="정보 검증"
              description="가짜 뉴스와 루머를 필터링합니다. 신뢰할 수 있는 소스만 전달합니다."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* 동작 방식 — 3단계 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight break-keep-all">이렇게 동작합니다</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: Globe,
                title: "수집",
                desc: "전세계 소셜 미디어와 뉴스에서 시장 관련 정보를 24시간 모니터링",
              },
              {
                step: "02",
                icon: AlertTriangle,
                title: "감지",
                desc: "변동성을 유발할 수 있는 이슈 발생 감지",
              },
              {
                step: "03",
                icon: Clock,
                title: "알림",
                desc: "변동성 주의 알림을 대시보드와 푸시로 즉시 전달",
              },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-xl p-6 text-center relative overflow-hidden group">
                <div className="absolute top-3 right-4 text-[10px] font-bold text-foreground/10 tracking-widest">
                  STEP {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/15 transition-colors">
                  <item.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold mb-2 break-keep-all">{item.title}</h3>
                <p className="text-sm text-foreground/40 break-keep-all">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — 풀블리드 */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/[0.04]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[128px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight break-keep-all">
            <span className="text-emerald-400">&ldquo;왜 움직이지?&rdquo;</span>
            <br />
            더 이상 혼자 찾지 마세요
          </h2>
          <p className="text-base text-foreground/40 mb-10 break-keep-all">
            변동성의 원인을 가장 먼저 알고,
            대비할 시간을 가지세요.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-lg hover:bg-emerald-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            무료로 시작하기 <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 면책 조항 */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-amber-500/[0.02] border-t border-amber-500/[0.06]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-amber-400/50 break-keep-all">
            WhyMove는 투자 조언을 제공하지 않습니다. 모든 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
          </p>
        </div>
      </section>

      {/* 푸터 — 미니멀 */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-[10px]">W</span>
            </div>
            <span className="font-bold text-sm">WhyMove</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-foreground/30">
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">이용약관</Link>
          </div>
          <p className="text-xs text-foreground/30">
            2026 WhyMove. 선물 트레이더를 위한 변동성 알림 서비스.
          </p>
        </div>
      </footer>
    </main>
  );
}
