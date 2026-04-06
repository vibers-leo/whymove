import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Bell, BellOff, ChevronRight, Info } from 'lucide-react';

interface FeedItem {
  symbol: string;
  name: string;
  price: string;
  change: number;
  changePercent: number;
  reasons: string[];
  category: 'crypto' | 'futures';
}

const MOCK_FEED: FeedItem[] = [
  {
    symbol: 'BTC',
    name: '비트코인',
    price: '$83,240',
    change: -3200,
    changePercent: -3.7,
    reasons: [
      '미 연준 금리 동결 발표 후 위험자산 매도세 확산',
      'ETF 대형 투자자 5억 달러 규모 포지션 청산 감지',
      '기술적 지지선 $84,000 하방 돌파 후 패닉셀 가속',
    ],
    category: 'crypto',
  },
  {
    symbol: 'ETH',
    name: '이더리움',
    price: '$1,842',
    change: -78,
    changePercent: -4.1,
    reasons: [
      '비트코인 하락에 연동된 알트코인 전반적 약세',
      'Dencun 업그레이드 이후 가스비 수익 급감 우려',
      '온체인 활동 지표 60일 최저 기록',
    ],
    category: 'crypto',
  },
  {
    symbol: 'GOLD',
    name: '금 선물',
    price: '$3,118',
    change: 42,
    changePercent: +1.4,
    reasons: [
      '중동 지정학적 긴장 고조로 안전자산 수요 급증',
      '달러 인덱스 0.8% 하락하며 금 매력도 상승',
      '중국 중앙은행 금 보유량 추가 확대 보도',
    ],
    category: 'futures',
  },
];

function ReasonCard({ item, onClose }: { item: FeedItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed inset-0 bg-black/40 flex items-end z-50"
      onClick={onClose}
    >
      <motion.div
        className="w-full bg-white rounded-t-3xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#E5E5EA] rounded-full mx-auto mb-5" />
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.changePercent > 0 ? 'bg-[#E8F5E9]' : 'bg-[#FFEBEE]'}`}>
            {item.changePercent > 0
              ? <TrendingUp size={22} color="#22C55E" />
              : <TrendingDown size={22} color="#EF4444" />}
          </div>
          <div>
            <div className="font-bold text-[#191919] text-lg">{item.name} ({item.symbol})</div>
            <div className={`font-semibold text-sm ${item.changePercent > 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {item.changePercent > 0 ? '+' : ''}{item.changePercent}% 지금 왜 이러는 걸까?
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {item.reasons.map((r, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[#3182F6] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-[#191919] text-sm leading-relaxed">{r}</p>
            </div>
          ))}
        </div>

        <p className="text-[#8B8B9B] text-xs text-center leading-relaxed">
          투자 권유가 아닙니다. 정보 참고용으로만 활용하세요.
        </p>
      </motion.div>
    </motion.div>
  );
}

function PriceFeedItem({ item, onTap }: { item: FeedItem; onTap: () => void }) {
  const [alerted, setAlerted] = useState(false);
  const isUp = item.changePercent > 0;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      className="bg-white border border-[#F0F0F3] rounded-2xl p-4 cursor-pointer active:bg-[#F8F8FA]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isUp ? 'bg-[#E8F5E9]' : 'bg-[#FFEBEE]'}`}>
            {isUp
              ? <TrendingUp size={20} color="#22C55E" />
              : <TrendingDown size={20} color="#EF4444" />}
          </div>
          <div>
            <div className="font-bold text-[#191919] text-sm">{item.name}</div>
            <div className="text-[#8B8B9B] text-xs">{item.symbol} · {item.category === 'crypto' ? '가상자산' : '선물'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-bold text-[#191919] text-sm">{item.price}</div>
            <div className={`text-xs font-semibold ${isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {isUp ? '+' : ''}{item.changePercent}%
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAlerted((v) => !v);
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#F5F5F7]"
          >
            {alerted
              ? <Bell size={16} color="#3182F6" />
              : <BellOff size={16} color="#C4C4CF" />}
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <Info size={12} color="#8B8B9B" />
        <span className="text-[#8B8B9B] text-xs truncate">{item.reasons[0]}</span>
        <ChevronRight size={12} color="#C4C4CF" />
      </div>
    </motion.div>
  );
}

export default function PriceFeedPage() {
  const [selected, setSelected] = useState<FeedItem | null>(null);
  const [tab, setTab] = useState<'all' | 'crypto' | 'futures'>('all');

  const filtered = MOCK_FEED.filter((item) => tab === 'all' || item.category === tab);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8FA]">
      {/* 헤더 */}
      <div className="bg-white px-5 pt-14 pb-5">
        <h1 className="text-2xl font-black text-[#191919] mb-1">지금 왜 떨어져?</h1>
        <p className="text-[#8B8B9B] text-sm">급변하는 종목, AI가 원인을 3줄로 요약해드려요</p>

        {/* 탭 */}
        <div className="flex gap-2 mt-4">
          {(['all', 'crypto', 'futures'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${tab === t ? 'bg-[#3182F6] text-white' : 'bg-[#F0F0F3] text-[#8B8B9B]'}`}
            >
              {t === 'all' ? '전체' : t === 'crypto' ? '가상자산' : '선물'}
            </button>
          ))}
        </div>
      </div>

      {/* 피드 */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-3">
        <AnimatePresence>
          {filtered.map((item) => (
            <motion.div
              key={item.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <PriceFeedItem item={item} onTap={() => setSelected(item)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 프리미엄 CTA */}
      <div className="px-5 pb-10 pt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full bg-[#3182F6] text-white font-bold text-base py-4 rounded-2xl"
        >
          프리미엄 피드 구독 — 월 4,900원
        </motion.button>
        <p className="text-[#C4C4CF] text-xs text-center mt-3">
          투자 권유 아님. 정보 참고용입니다.
        </p>
      </div>

      {/* 원인 카드 바텀시트 */}
      <AnimatePresence>
        {selected && (
          <ReasonCard item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
