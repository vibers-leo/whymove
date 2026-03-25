"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Zap, 
  TrendingUp, 
  MessageCircle, 
  Bell, 
  Twitter, 
  Clock, 
  Shield, 
  ChevronRight,
  BarChart3,
  AlertTriangle,
  Globe,
  ArrowRight,
  CheckCircle2,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// Animated Counter Component
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

// Feature Card Component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color,
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  color: string;
  delay: number;
}) => (
  <div 
    className={cn(
      "group relative p-6 rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-md",
      "hover:border-foreground/20 hover:bg-foreground/10 transition-all duration-500",
      "animate-in fade-in slide-in-from-bottom-4"
    )}
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
  >
    <div className={cn(
      "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
      "bg-gradient-to-br",
      color
    )}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-foreground/60 leading-relaxed">{description}</p>
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
  </div>
);

// Pain Point Card
const PainPoint = ({ text, index }: { text: string; index: number }) => (
  <div 
    className="flex items-start gap-3 animate-in fade-in slide-in-from-left-4"
    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
  >
    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-red-400 text-xs">✕</span>
    </div>
    <p className="text-foreground/70">{text}</p>
  </div>
);

// Solution Point
const SolutionPoint = ({ text, index }: { text: string; index: number }) => (
  <div 
    className="flex items-start gap-3 animate-in fade-in slide-in-from-right-4"
    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
  >
    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    </div>
    <p className="text-foreground/70">{text}</p>
  </div>
);

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-bold text-lg">WhyMove</span>
          </Link>
          <Link 
            href="/"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Activity className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-foreground/70">선물 트레이더를 위한 변동성 알림 서비스</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '100ms' }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              "왜 움직이는 거야?"
            </span>
            <br />
            그 답을 가장 먼저 알려드립니다
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-foreground/60 max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>
            트럼프 발언, 경제지표 발표, 인플루언서 트윗...
            <br className="hidden md:block" />
            <strong className="text-foreground">시장에 변동성을 일으키는 이슈를 실시간으로 알려드립니다.</strong>
          </p>

          {/* Disclaimer Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/80 text-sm mb-8 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '250ms' }}>
            <AlertTriangle className="w-4 h-4" />
            <span>우리는 방향을 예측하지 않습니다. 변동성 발생을 알릴 뿐입니다.</span>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms' }}>
            <Link 
              href="/"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              지금 시작하기 <ChevronRight className="w-5 h-5" />
            </Link>
            <a 
              href="#features"
              className="px-8 py-4 rounded-xl border border-foreground/20 text-foreground font-medium text-lg hover:bg-foreground/5 transition-all flex items-center justify-center gap-2"
            >
              기능 살펴보기
            </a>
          </div>
        </div>
      </section>

      {/* What We Do / Don't Do Section */}
      <section className="py-16 px-6 border-y border-foreground/5 bg-foreground/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* What We DON'T Do */}
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <span className="text-xl">✕</span> 우리가 하지 않는 것
              </h3>
              <ul className="space-y-3 text-foreground/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  "오른다" 또는 "내린다" 방향 예측
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  매수/매도 시그널 제공
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  투자 조언이나 추천
                </li>
              </ul>
            </div>

            {/* What We DO */}
            <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <span className="text-xl">✓</span> 우리가 하는 것
              </h3>
              <ul className="space-y-3 text-foreground/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  "이슈가 발생했다" 는 팩트 전달
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  "변동성이 생기고 있다/생길 수 있다" 알림
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  트레이더들 간의 실시간 정보 교류
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              <AnimatedNumber value={500} suffix="ms" />
            </div>
            <p className="text-sm text-foreground/50 mt-2">평균 알림 속도</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              <AnimatedNumber value={50} suffix="+" />
            </div>
            <p className="text-sm text-foreground/50 mt-2">추적 인플루언서</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              <AnimatedNumber value={24} suffix="/7" />
            </div>
            <p className="text-sm text-foreground/50 mt-2">실시간 모니터링</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-500">
              <AnimatedNumber value={1000} suffix="+" />
            </div>
            <p className="text-sm text-foreground/50 mt-2">활성 트레이더</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              선물 트레이더의 <span className="text-red-400">고통</span>
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              갑자기 차트가 움직인다. "왜 움직이는 거야?" 이유를 모르면 대응할 수 없습니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Pain Points */}
            <div className="space-y-6">
              <PainPoint text="급등락이 시작됐는데, 왜 움직이는지 모른다" index={0} />
              <PainPoint text="알고 보니 10분 전에 트럼프가 무슨 말을 했다" index={1} />
              <PainPoint text="변동성의 원인을 찾느라 텔레그램, X, 뉴스를 다 뒤진다" index={2} />
              <PainPoint text="내가 알았을 땐 이미 움직임이 끝났다" index={3} />
              <PainPoint text="다음 변동성이 언제 올지 예상할 수 없다" index={4} />
            </div>
            
            {/* Visual */}
            <div className="relative h-80 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">❓</div>
                <p className="text-foreground/50 text-lg font-medium">"왜 움직이는 거야?"</p>
                <p className="text-foreground/30 text-sm mt-2">이유를 모르면 대응 불가</p>
              </div>
              {/* Floating elements */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs animate-pulse">
                급락 중...
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs animate-pulse">
                원인 검색 중...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              WhyMove의 <span className="text-cyan-400">해답</span>
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              "움직이는 이유"를 가장 먼저 알려주고, 다가올 변동성을 미리 대비하게 합니다
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Visual */}
            <div className="relative h-80 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center order-2 md:order-1">
              <div className="text-center">
                <div className="text-6xl mb-4">⚡</div>
                <p className="text-foreground/50 text-lg font-medium">"트럼프가 방금 트윗했어!"</p>
                <p className="text-foreground/30 text-sm mt-2">변동성 예상됨 → 대비 가능</p>
              </div>
              {/* Floating elements */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs animate-pulse">
                ⚡ 0.5초 전 알림
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs">
                ⚠️ 변동성 주의
              </div>
            </div>
            
            {/* Solution Points */}
            <div className="space-y-6 order-1 md:order-2">
              <SolutionPoint text="X, 스레드, 트루스소셜에서 주요 인플루언서 게시물 실시간 수집" index={0} />
              <SolutionPoint text="트럼프, 머스크 등 마켓 무버 발언 즉시 알림" index={1} />
              <SolutionPoint text="CPI, FOMC 등 경제 이벤트 일정 미리 알림" index={2} />
              <SolutionPoint text="트레이더들과 실시간 채팅으로 빠른 정보 교류" index={3} />
              <SolutionPoint text="변동성의 원인을 즉시 파악 → 빠른 판단 가능" index={4} />
            </div>
          </div>
        </div>
      </section>

      {/* Core Message */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-2xl border border-foreground/10 bg-foreground/5">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              우리는 <span className="text-yellow-400">"방향"</span>을 알려주지 않습니다
            </h3>
            <p className="text-lg text-foreground/60 mb-6">
              하지만 <span className="text-cyan-400 font-bold">"변동성이 온다"</span>는 것은 누구보다 빠르게 알려드립니다.
            </p>
            <p className="text-foreground/40 text-sm">
              방향은 여러분이 판단하세요. 우리는 판단할 시간을 드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">핵심 기능</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              변동성에 대비하기 위한 모든 도구
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Twitter}
              title="소셜 미디어 추적"
              description="X, 스레드, 트루스소셜에서 주요 인플루언서의 게시물을 실시간으로 수집하고 번역합니다."
              color="from-blue-500 to-cyan-500"
              delay={0}
            />
            <FeatureCard 
              icon={Bell}
              title="변동성 알림"
              description="시장에 영향을 줄 수 있는 이슈 발생 시 즉시 알림을 받아보세요. 대비할 시간을 드립니다."
              color="from-orange-500 to-red-500"
              delay={100}
            />
            <FeatureCard 
              icon={BarChart3}
              title="경제 캘린더"
              description="CPI, FOMC, 고용지표 등 변동성을 유발하는 경제 이벤트 일정을 미리 확인하세요."
              color="from-purple-500 to-pink-500"
              delay={200}
            />
            <FeatureCard 
              icon={MessageCircle}
              title="실시간 채팅"
              description="다른 트레이더들과 실시간으로 정보를 교류하세요. 혼자보다 빠릅니다."
              color="from-emerald-500 to-teal-500"
              delay={300}
            />
            <FeatureCard 
              icon={TrendingUp}
              title="실시간 차트"
              description="TradingView 차트와 알림을 함께 보면서 상황을 즉시 파악하세요."
              color="from-cyan-500 to-blue-500"
              delay={400}
            />
            <FeatureCard 
              icon={Shield}
              title="정보 검증"
              description="가짜 뉴스와 루머를 필터링합니다. 신뢰할 수 있는 소스만 전달합니다."
              color="from-indigo-500 to-purple-500"
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">이렇게 동작합니다</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-cyan-400 font-medium mb-2">STEP 1</div>
              <h3 className="text-lg font-bold mb-2">수집</h3>
              <p className="text-sm text-foreground/60">
                전세계 소셜 미디어와 뉴스에서 시장 관련 정보를 24시간 모니터링
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-yellow-400 font-medium mb-2">STEP 2</div>
              <h3 className="text-lg font-bold mb-2">감지</h3>
              <p className="text-sm text-foreground/60">
                변동성을 유발할 수 있는 이슈 발생 감지
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-emerald-400 font-medium mb-2">STEP 3</div>
              <h3 className="text-lg font-bold mb-2">알림</h3>
              <p className="text-sm text-foreground/60">
                "변동성 주의" 알림을 대시보드와 푸시로 즉시 전달
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-foreground/[0.02] border-t border-foreground/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">"왜 움직이지?"</span>
            <br />
            더 이상 혼자 찾지 마세요
          </h2>
          <p className="text-lg text-foreground/60 mb-10">
            변동성의 원인을 가장 먼저 알고,
            <br />
            대비할 시간을 가지세요.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-cyan-500/25"
          >
            무료로 시작하기 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-6 bg-yellow-500/5 border-t border-yellow-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-yellow-500/70">
            ⚠️ WhyMove는 투자 조언을 제공하지 않습니다. 모든 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-foreground/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="font-bold">WhyMove</span>
          </div>
          <p className="text-sm text-foreground/40">
            © 2026 WhyMove. 선물 트레이더를 위한 변동성 알림 서비스.
          </p>
        </div>
      </footer>
    </main>
  );
}
