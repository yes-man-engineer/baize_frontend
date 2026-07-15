import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, ArrowDown } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface FailureCase {
  id: number;
  name: string;
  category: string;
  deathDate: string;
  moneyBurned: string;
  lifespan: string;
  quote: string;
  coverImage: string;
}

const CATEGORIES = [
  '全部',
  '共享办公',
  '在线教育',
  '消费品',
  '社交产品',
  'SaaS',
  '本地生活',
  'AI 应用',
  '金融科技',
  '企业服务',
];

const FAILURES: FailureCase[] = [
  {
    id: 1,
    name: 'Meowspace',
    category: '共享办公',
    deathDate: '2023.11',
    moneyBurned: '¥1,200万',
    lifespan: '18个月',
    quote: '那时候以为有了一个空间就有了生态，后来才发现，空间是最不值钱的。',
    coverImage: '/fail-meowspace.jpg',
  },
  {
    id: 2,
    name: '晨读岛',
    category: '在线教育',
    deathDate: '2022.8',
    moneyBurned: '¥860万',
    lifespan: '14个月',
    quote: '做了6个月才发现，用户要的不是早起，而是「我已经努力了」的感觉。',
    coverImage: '/fail-morning-island.jpg',
  },
  {
    id: 3,
    name: 'Fikaa 咖啡',
    category: '消费品',
    deathDate: '2024.1',
    moneyBurned: '¥2,400万',
    lifespan: '26个月',
    quote: '第4家门店开业那天，两个合伙人同时在微信里跟我说，要不我们别开了。',
    coverImage: '/fail-fikaa-coffee.jpg',
  },
  {
    id: 4,
    name: '邻友圈',
    category: '社交产品',
    deathDate: '2023.5',
    moneyBurned: '¥3,100万',
    lifespan: '32个月',
    quote: 'DAU 涨到10万的那天，我们烧完了最后一笔钱。庆祝和倒闭发生在同一个下午。',
    coverImage: '/fail-social-app.jpg',
  },
  {
    id: 5,
    name: '智学宝',
    category: '在线教育',
    deathDate: '2022.12',
    moneyBurned: '¥1,800万',
    lifespan: '22个月',
    quote: '家长说我们的产品很好，但「等孩子考完试再说」。这个「再说」永远不会来。',
    coverImage: '/fail-edtech.jpg',
  },
  {
    id: 6,
    name: '鲜集',
    category: '本地生活',
    deathDate: '2023.9',
    moneyBurned: '¥4,500万',
    lifespan: '38个月',
    quote: '前置仓的模式是对的，只是我们城市不对、时机不对、团队也不对。',
    coverImage: '/fail-marketplace.jpg',
  },
  {
    id: 7,
    name: '算力云',
    category: 'AI 应用',
    deathDate: '2024.3',
    moneyBurned: '¥6,200万',
    lifespan: '16个月',
    quote: 'GPT-4发布的那天，我们整个团队沉默了两个小时。然后有人开始改简历。',
    coverImage: '/fail-meowspace.jpg',
  },
  {
    id: 8,
    name: '易账通',
    category: '金融科技',
    deathDate: '2022.6',
    moneyBurned: '¥900万',
    lifespan: '20个月',
    quote: '监管文件下来的那天，我才明白「合规成本」不是一个词，是一个死刑判决。',
    coverImage: '/fail-morning-island.jpg',
  },
  {
    id: 9,
    name: '绿途',
    category: '企业服务',
    deathDate: '2023.2',
    moneyBurned: '¥1,500万',
    lifespan: '28个月',
    quote: '用户都说「这个概念很好」，但好概念和付费之间隔着一条银河。',
    coverImage: '/fail-fikaa-coffee.jpg',
  },
  {
    id: 10,
    name: '一起画',
    category: '社交产品',
    deathDate: '2023.7',
    moneyBurned: '¥2,100万',
    lifespan: '24个月',
    quote: '我们搭了一个很好的创作工具，但忘了问用户：你真的想画画吗？',
    coverImage: '/fail-social-app.jpg',
  },
  {
    id: 11,
    name: '农掌柜',
    category: '本地生活',
    deathDate: '2022.10',
    moneyBurned: '¥3,800万',
    lifespan: '30个月',
    quote: '从田间到餐桌的路，比我们PPT上写的要远十倍。冷链不是钱能砸出来的。',
    coverImage: '/fail-marketplace.jpg',
  },
  {
    id: 12,
    name: '语伴说',
    category: '在线教育',
    deathDate: '2024.2',
    moneyBurned: '¥1,600万',
    lifespan: '20个月',
    quote: '真人外教打不过AI，AI打不过抖音。用户学英语的耐心只有15秒。',
    coverImage: '/fail-edtech.jpg',
  },
  {
    id: 13,
    name: '碳迹',
    category: '企业服务',
    deathDate: '2023.4',
    moneyBurned: '¥2,700万',
    lifespan: '26个月',
    quote: '碳中和是未来的生意，但企业今天连工资都要拖欠，谁管你碳排放。',
    coverImage: '/fail-meowspace.jpg',
  },
  {
    id: 14,
    name: '小饭桌',
    category: '本地生活',
    deathDate: '2022.11',
    moneyBurned: '¥750万',
    lifespan: '12个月',
    quote: '食品安全许可证办下来的那天，我们的现金流刚好断了。命运真会开玩笑。',
    coverImage: '/fail-fikaa-coffee.jpg',
  },
  {
    id: 15,
    name: '医陪通',
    category: '企业服务',
    deathDate: '2023.8',
    moneyBurned: '¥1,950万',
    lifespan: '22个月',
    quote: '医院愿意试点，患者愿意付费，但护士宁愿辞职也不干这活。人力是死穴。',
    coverImage: '/fail-morning-island.jpg',
  },
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FailureArchive() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredFailures = useMemo(() => {
    let result = FAILURES;
    if (activeCategory !== '全部') {
      result = result.filter((f) => f.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.quote.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  const visibleFailures = filteredFailures.slice(0, visibleCount);
  const hasMore = visibleCount < filteredFailures.length;

  return (
    <div className="min-h-[100dvh] bg-[#16423C]">
      {/* ========== Hero Section ========== */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-medium tracking-[0.1em] text-[#2C6E63] uppercase"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            失败档案
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.2, ease: easeOutExpo }}
            className="mt-4 text-[#FAF6F1] leading-[1.25] tracking-[0.03em]"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 700,
            }}
          >
            这里安葬着 2,183 个
            <br />
            曾经被寄予厚望的项目。
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: easeOutExpo }}
            className="mt-6 text-base text-[#FAF6F1]/70 max-w-lg mx-auto leading-[1.75]"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            每一条都由创始人亲笔下葬。
            <br />
            金额真实，时间真实，眼泪也是真实的。
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-8 sm:gap-12"
          >
            <span
              className="text-sm font-medium text-[#C9A96E]"
              style={{ fontFamily: '"Space Grotesk", monospace' }}
            >
              2,183 条失败复盘
            </span>
            <span
              className="text-sm font-medium text-[#FAF6F1]/70"
              style={{ fontFamily: '"Space Grotesk", monospace' }}
            >
              ¥14.2亿 烧掉的钱
            </span>
            <span
              className="text-sm font-medium text-[#2C6E63]"
              style={{ fontFamily: '"Space Grotesk", monospace' }}
            >
              本周新增 8 条
            </span>
          </motion.div>
        </div>
      </section>

      {/* ========== Filter & Search Bar ========== */}
      <section className="sticky top-16 z-40 bg-[#16423C] border-b border-[rgba(250,246,241,0.1)] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-md w-full">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FAF6F1]/50"
              />
              <input
                type="text"
                placeholder="搜索失败案例..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(9);
                }}
                className="w-full bg-[rgba(250,246,241,0.08)] border border-[rgba(250,246,241,0.2)] rounded-full pl-10 pr-5 py-2.5 text-sm text-[#FAF6F1] placeholder:text-[#FAF6F1]/40 outline-none focus:border-[#2C6E63] transition-colors duration-300"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                className="bg-transparent border border-[rgba(250,246,241,0.2)] rounded-full px-4 py-2 text-[13px] font-medium text-[#FAF6F1]/70 outline-none cursor-pointer focus:border-[#2C6E63] transition-colors duration-300"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                defaultValue="latest"
              >
                <option value="latest" className="bg-[#16423C] text-[#FAF6F1]">最新下葬</option>
                <option value="oldest" className="bg-[#16423C] text-[#FAF6F1]">最早下葬</option>
                <option value="money" className="bg-[#16423C] text-[#FAF6F1]">烧钱最多</option>
              </select>

              <Link
                to="/submit"
                className="inline-flex items-center px-5 py-2.5 bg-[#FAF6F1] text-[#16423C] text-[13px] font-bold rounded-full transition-transform duration-300 hover:scale-[1.02] whitespace-nowrap"
              >
                + 写下我的墓志铭
              </Link>
            </div>
          </div>

          {/* Category Tabs — dark variant */}
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
                  setVisibleCount(9);
                }}
                className="relative px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-250 whitespace-nowrap"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="failureCategoryPill"
                    className="absolute inset-0 bg-[#2C6E63] rounded-full"
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-250 ${
                    activeCategory === cat
                      ? 'text-[#FAF6F1]'
                      : 'text-[#FAF6F1]/60 border border-[rgba(250,246,241,0.2)] hover:border-[#2C6E63] hover:text-[#FAF6F1]'
                  }`}
                >
                  {cat}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== Failure Case Grid ========== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {visibleFailures.map((failure) => (
                <motion.div
                  key={failure.id}
                  variants={cardVariant}
                  className="group bg-[#16423C] border border-[rgba(250,246,241,0.15)] rounded-[20px] overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
                  style={{ transitionTimingFunction: 'ease' }}
                >
                  {/* Cover Image */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={failure.coverImage}
                      alt={failure.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Category tag */}
                    <span
                      className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#8B6F47] text-[#FAF6F1]"
                      style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                    >
                      {failure.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Company name */}
                    <h3
                      className="text-[22px] font-bold text-[#FAF6F1] leading-[1.3]"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      {failure.name}
                    </h3>

                    {/* Death date */}
                    <p
                      className="mt-1 text-xs text-[#8B6F47]"
                      style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                    >
                      卒于 {failure.deathDate} · {failure.lifespan} · {failure.moneyBurned}
                    </p>

                    {/* Quote */}
                    <p
                      className="mt-3 text-sm text-[#FAF6F1]/80 leading-[1.75] line-clamp-3 italic"
                      style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                    >
                      &ldquo;{failure.quote}&rdquo;
                    </p>

                    {/* View detail link */}
                    <Link
                      to={`/failures/${failure.id}`}
                      className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#2C6E63] transition-all duration-300 group/link hover:gap-2"
                      style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                    >
                      查看全部
                      <ArrowRight size={12} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {visibleFailures.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-[#FAF6F1]/60 text-base" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                没有找到匹配的案例，换个关键词试试？
              </p>
            </motion.div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + 9)}
                className="inline-flex items-center gap-2 px-8 py-3 border border-[rgba(250,246,241,0.3)] text-[#FAF6F1] rounded-full text-sm font-medium transition-all duration-300 hover:bg-[rgba(250,246,241,0.1)]"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
              >
                加载更多墓志铭
                <ArrowDown size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========== Submit CTA Banner ========== */}
      <section className="bg-[#FAF6F1] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="text-[28px] font-bold text-[#16423C]"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            你的失败，值得被记住。
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
            className="mt-3 text-[15px] text-[#6B6B6B] max-w-md mx-auto leading-[1.75]"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            写下你的故事不是为了被同情，而是为了不让下一个人踩同一个坑。
            <br />
            匿名提交，我们帮你整理成墓志铭。
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
              className="inline-flex items-center px-8 py-3 bg-[#16423C] text-[#FAF6F1] rounded-full text-sm font-bold transition-colors duration-300 hover:bg-[#2C6E63]"
              style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
            >
              写下我的墓志铭
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
