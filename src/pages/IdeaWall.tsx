import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, Heart, ArrowDown } from 'lucide-react';
import { apiClient } from '../api/client';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Idea {
  id: number;
  category: string;
  title: string;
  author: string;
  time: string;
  description: string;
  comments: number;
  likes: number;
  image?: string;
  startupCost: number; // 万元
}

const CATEGORIES = [
  '全部',
  'AI 应用',
  'SaaS',
  '消费品',
  '内容社区',
  '社交产品',
  '在线教育',
  '本地生活',
  '金融科技',
  '企业服务',
  '医疗健康',
  '环保可持续',
];

const FUNDING_RANGES = [
  { label: '全部资金', min: 0, max: Infinity },
  { label: '5万以下', min: 0, max: 5 },
  { label: '5-20万', min: 5, max: 20 },
  { label: '20-50万', min: 20, max: 50 },
  { label: '50-100万', min: 50, max: 100 },
  { label: '100万以上', min: 100, max: Infinity },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay >= 7) return `${Math.floor(diffDay / 7)}周前`;
  if (diffDay >= 1) return `${diffDay}天前`;
  if (diffHour >= 1) return `${diffHour}小时前`;
  if (diffMin >= 1) return `${diffMin}分钟前`;
  return '刚刚';
}

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function IdeaWall() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeFunding, setActiveFunding] = useState('全部资金');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRange = FUNDING_RANGES.find(r => r.label === activeFunding) || FUNDING_RANGES[0];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiClient
      .ideas()
      .then((data) => {
        if (cancelled) return;
        const mapped = data.list.map((item) => ({
          id: item.id,
          category: item.category,
          title: item.title,
          author: item.author,
          time: formatRelativeTime(item.created_at),
          description: item.description,
          comments: item.comments,
          likes: item.likes,
          image: item.image || '',
          startupCost: item.startup_cost,
        }));
        setIdeas(mapped);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : '加载失败');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredIdeas = useMemo(() => {
    let result = ideas;
    if (activeCategory !== '全部') {
      result = result.filter((idea) => idea.category === activeCategory);
    }
    if (activeFunding !== '全部资金') {
      result = result.filter((idea) => idea.startupCost > selectedRange.min && idea.startupCost <= selectedRange.max);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.description.toLowerCase().includes(q) ||
          idea.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, activeFunding, searchQuery, selectedRange, ideas]);

  const visibleIdeas = filteredIdeas.slice(0, visibleCount);
  const hasMore = visibleCount < filteredIdeas.length;

  return (
    <div className="min-h-[100dvh] bg-[#FAF6F1]">
      {/* ========== Hero Section ========== */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-medium tracking-[0.1em] text-[#2C6E63] uppercase"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            点子墙
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
            className="mt-3 text-[#1A1A1A] leading-[1.25] tracking-[0.04em]"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 700,
            }}
          >
            还在脑子里发酵的，
            <br />
            先扔到墙上再说。
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOutExpo }}
            className="mt-4 text-base text-[#6B6B6B] max-w-lg leading-[1.75]"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            没有商业计划书，没有 PPT，没有 pitch。只是把你半夜里冒出来的想法写下来，看看有没有人比你更疯。
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 flex flex-wrap gap-8"
          >
            <span
              className="text-sm font-medium text-[#6B6B6B]"
              style={{ fontFamily: '"Space Grotesk", monospace' }}
            >
              7,429 个野生点子
            </span>
            <span
              className="text-sm font-medium text-[#2C6E63]"
              style={{ fontFamily: '"Space Grotesk", monospace' }}
            >
              本周新增 47 个
            </span>
            <span
              className="text-sm font-medium text-[#C9A96E]"
              style={{ fontFamily: '"Space Grotesk", monospace' }}
            >
              12 个今日热门
            </span>
          </motion.div>
        </div>
      </section>

      {/* ========== Filter & Search Bar ========== */}
      <section className="sticky top-16 z-40 bg-[#FAF6F1] border-b border-[rgba(22,66,60,0.1)] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-md w-full">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]"
              />
              <input
                type="text"
                placeholder="搜索点子关键词..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(12);
                }}
                className="w-full bg-[#F3EDE4] border border-[rgba(22,66,60,0.1)] rounded-full pl-10 pr-5 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B]/60 outline-none focus:border-[#2C6E63] transition-colors duration-300"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                className="bg-transparent border border-[rgba(22,66,60,0.1)] rounded-full px-4 py-2 text-[13px] font-medium text-[#6B6B6B] outline-none cursor-pointer focus:border-[#2C6E63] transition-colors duration-300"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                defaultValue="latest"
              >
                <option value="latest">最新发布</option>
                <option value="hot">最多点赞</option>
                <option value="comments">最多讨论</option>
              </select>

              <Link
                to="/submit"
                className="inline-flex items-center px-5 py-2.5 bg-[#2C6E63] text-[#FAF6F1] text-[13px] font-bold rounded-full transition-transform duration-300 hover:scale-[1.02] whitespace-nowrap"
              >
                + 扔个点子
              </Link>
            </div>
          </div>

          {/* Category Tabs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.03 } },
            }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                }}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(12);
                }}
                className="relative px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-250 whitespace-nowrap"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="ideaCategoryPill"
                    className="absolute inset-0 bg-[#2C6E63] rounded-full"
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-250 ${
                    activeCategory === cat
                      ? 'text-[#FAF6F1]'
                      : 'text-[#6B6B6B] border border-[rgba(22,66,60,0.1)] hover:border-[#2C6E63] hover:text-[#2C6E63]'
                  }`}
                >
                  {cat}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Funding Range Filter */}
          <div className="mt-3 flex flex-wrap gap-2">
            {FUNDING_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  setActiveFunding(range.label);
                  setVisibleCount(12);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFunding === range.label
                    ? 'bg-[#D4A853] text-white'
                    : 'bg-[#F0EDE6] text-[#666666] hover:bg-[#D4A853]/20'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Idea Grid ========== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="text-center py-24">
              <p className="text-[#6B6B6B] text-base" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                加载中...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-24">
              <p className="text-[#6B6B6B] text-base" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                加载失败: {error}
              </p>
            </div>
          )}

          {!loading && !error && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchQuery}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {visibleIdeas.map((idea) => (
                  <motion.div
                    key={idea.id}
                    variants={cardVariant}
                    className="group bg-[#F3EDE4] border border-[rgba(22,66,60,0.1)] rounded-2xl p-5 cursor-pointer transition-all duration-[400ms] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(22,66,60,0.12)] flex flex-col"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)' }}
                  >
                    {/* Category pill + Startup cost */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[rgba(44,110,99,0.15)] text-[#2C6E63]"
                        style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                      >
                        {idea.category}
                      </span>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[#D4A853]/15 text-[#8B6F47]">
                        启动 ¥{idea.startupCost}万
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-base font-bold text-[#1A1A1A] leading-[1.4] tracking-[0.02em] line-clamp-2"
                      style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                    >
                      {idea.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="mt-2 text-[13px] text-[#1A1A1A]/80 leading-[1.75] line-clamp-2 flex-1"
                      style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                    >
                      {idea.description}
                    </p>

                    {/* Author & Time */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#6B6B6B]">
                      <span style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>{idea.author}</span>
                      <span className="text-[#6B6B6B]/40">·</span>
                      <span style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>{idea.time}</span>
                    </div>

                    {/* Stats */}
                    <div className="mt-3 pt-3 border-t border-[rgba(22,66,60,0.08)] flex items-center gap-4">
                      <span className="flex items-center gap-1 text-[13px] text-[#6B6B6B]" style={{ fontFamily: '"Space Grotesk", monospace' }}>
                        <MessageCircle size={14} />
                        {idea.comments}
                      </span>
                      <span className="flex items-center gap-1 text-[13px] text-[#6B6B6B]" style={{ fontFamily: '"Space Grotesk", monospace' }}>
                        <Heart size={14} />
                        {idea.likes}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Empty state */}
          {!loading && !error && visibleIdeas.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-[#6B6B6B] text-base" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                没有找到匹配的点子，换个关键词试试？
              </p>
            </motion.div>
          )}

          {/* Load More */}
          {!loading && !error && hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + 12)}
                className="inline-flex items-center gap-2 px-8 py-3 border border-[#2C6E63] text-[#2C6E63] rounded-full text-sm font-medium transition-all duration-300 hover:bg-[#2C6E63] hover:text-[#FAF6F1]"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
              >
                加载更多野生点子
                <ArrowDown size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========== Submit CTA Banner ========== */}
      <section className="bg-[#16423C] py-16 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="text-[28px] font-bold text-[#FAF6F1]"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            脑子里有个疯狂的想法？
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
            className="mt-3 text-[15px] text-[#FAF6F1]/70 max-w-md mx-auto leading-[1.75]"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            不需要商业计划书，不需要 PPT。写下来，扔到墙上，让社区帮你打磨。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.4, ease: easeOutExpo }}
            className="mt-6"
          >
            <Link
              to="/submit"
              className="inline-flex items-center px-8 py-3 bg-[#C9A96E] text-[#16423C] rounded-full text-sm font-bold transition-transform duration-300 hover:scale-[1.03]"
              style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
            >
              分享我的点子
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
