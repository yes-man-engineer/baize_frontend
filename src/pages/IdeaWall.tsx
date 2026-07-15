import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, Heart, ArrowDown } from 'lucide-react';

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

const IDEAS: Idea[] = [
  {
    id: 1,
    category: 'AI 应用',
    title: '帮老年人读的「AI 剪报翻译器」',
    author: '@银发科技侠',
    time: '2天前',
    description: '每天自动抓取新闻，用大白话讲给爸妈听，还支持语音播报和一键转发到家庭群。',
    comments: 12,
    likes: 248,
    startupCost: 15,
    image: '/idea-ai-agent.jpg',
  },
  {
    id: 2,
    category: '内容社区',
    title: '专门接收的分龄营养盲盒',
    author: '@健康狂魔',
    time: '5天前',
    description: '根据年龄段定制营养补剂盲盒，每个月一盒，附带营养师视频讲解。',
    comments: 27,
    likes: 155,
    startupCost: 50,
        image: '/idea-community.jpg',
  },
  {
    id: 3,
    category: 'SaaS',
    title: '小团队专用的「定期提醒管家」',
    author: '@效率达人',
    time: '1天前',
    description: '比日历更智能，比项目管理工具更轻量，专门为5人以下小团队设计。',
    comments: 42,
    likes: 189,
    startupCost: 8,
        image: '/idea-saas.jpg',
  },
  {
    id: 4,
    category: '本地生活',
    title: '给独居青年的「周末有人陪」服务',
    author: '@城市孤岛',
    time: '3天前',
    description: '匹配同城兴趣相投的独居青年，周末一起做饭、看电影、逛展。',
    comments: 18,
    likes: 334,
    startupCost: 20,
        image: '/idea-wellness.jpg',
  },
  {
    id: 5,
    category: 'AI 应用',
    title: '用 AI 生成「孩子睡前故事」的语音版',
    author: '@新手爸爸',
    time: '6天前',
    description: '输入孩子当天经历，AI 生成带有教育意义的睡前故事，还能克隆爸妈声音。',
    comments: 56,
    likes: 412,
    startupCost: 10,
        image: '/idea-ai-agent.jpg',
  },
  {
    id: 6,
    category: '消费品',
    title: '可降解的「宠物便便袋」订阅制',
    author: '@铲屎官Pro',
    time: '4天前',
    description: '玉米淀粉做的全降解便便袋，按月订阅送到家，附赠除臭喷雾小样。',
    comments: 9,
    likes: 127,
    startupCost: 30,
        image: '/idea-community.jpg',
  },
  {
    id: 7,
    category: '社交产品',
    title: '「城市漫游者」线下偶遇地图',
    author: '@社恐反转',
    time: '1周前',
    description: '不聊天，先见面。在城市里标记你想偶遇的地方，系统匹配同路人。',
    comments: 33,
    likes: 276,
    startupCost: 15,
        image: '/idea-wellness.jpg',
  },
  {
    id: 8,
    category: '企业服务',
    title: '自由职业者的「自动报税助手」',
    author: '@数字游民',
    time: '2天前',
    description: '自动抓取各平台收入数据，生成报税表，支持多币种和跨境收入。',
    comments: 21,
    likes: 198,
    startupCost: 5,
        image: '/idea-saas.jpg',
  },
  {
    id: 9,
    category: '在线教育',
    title: '「沉浸式历史」VR 课堂体验',
    author: '@历史迷',
    time: '3天前',
    description: '用 VR 重现历史场景，让学生「站在」兵马俑坑里上历史课。',
    comments: 15,
    likes: 167,
    startupCost: 80,
        image: '/idea-education.jpg',
  },
  {
    id: 10,
    category: '金融科技',
    title: '年轻人的「第一支基金」模拟器',
    author: '@理财小白',
    time: '5天前',
    description: '用虚拟资金练习基金投资，附带AI教练讲解每个操作背后的逻辑。',
    comments: 38,
    likes: 289,
    startupCost: 20,
        image: '/idea-fintech.jpg',
  },
  {
    id: 11,
    category: '医疗健康',
    title: '慢性病患者的「用药提醒」手环',
    author: '@健康守护者',
    time: '1周前',
    description: '不只是提醒吃药，还能监测服药后的生理指标变化，同步给家属。',
    comments: 11,
    likes: 145,
    startupCost: 60,
        image: '/idea-wellness.jpg',
  },
  {
    id: 12,
    category: '环保可持续',
    title: '「旧衣再造」本地裁缝对接平台',
    author: '@循环生活家',
    time: '4天前',
    description: '把旧衣服交给本地裁缝改造，支持在线选款、量体、预约上门取件。',
    comments: 24,
    likes: 212,
    startupCost: 10,
        image: '/idea-community.jpg',
  },
  {
    id: 13,
    category: 'AI 应用',
    title: '「会议纪要自动生成器」专注中文版',
    author: '@产品经理阿伟',
    time: '1天前',
    description: '专门针对中文会议场景优化，支持方言识别、Action Item 自动提取。',
    comments: 63,
    likes: 521,
    startupCost: 12,
        image: '/idea-ai-agent.jpg',
  },
  {
    id: 14,
    category: '消费品',
    title: '「办公室绿植租赁+养护」一条龙',
    author: '@植物疗愈师',
    time: '3天前',
    description: '每周上门换一批新鲜绿植，死去的我们带走，让你工位永远有生机。',
    comments: 17,
    likes: 188,
    startupCost: 25,
        image: '/idea-community.jpg',
  },
  {
    id: 15,
    category: '社交产品',
    title: '「技能交换」社区 — 用技能代替货币',
    author: '@交换人生',
    time: '5天前',
    description: '你会做PPT，我会弹吉他，我们交换一小时。平台提供信用担保。',
    comments: 44,
    likes: 367,
    startupCost: 8,
        image: '/idea-wellness.jpg',
  },
  {
    id: 16,
    category: '本地生活',
    title: '「邻居食堂」—— 在家做饭顺便卖给邻居',
    author: '@厨房达人',
    time: '2天前',
    description: '认证家庭厨师，每天多做几份饭，邻居线上下单、下楼自取。',
    comments: 89,
    likes: 634,
    startupCost: 5,
        image: '/idea-community.jpg',
  },
];

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

  const selectedRange = FUNDING_RANGES.find(r => r.label === activeFunding) || FUNDING_RANGES[0];

  const filteredIdeas = useMemo(() => {
    let result = IDEAS;
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
  }, [activeCategory, activeFunding, searchQuery, selectedRange]);

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

          {/* Empty state */}
          {visibleIdeas.length === 0 && (
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
          {hasMore && (
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
