import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const EASE_OUT_EXPO = 'power3.out';

/* ─────────────────────── chart data ─────────────────────── */

const FAILURE_CAUSES_DATA = [
  { rank: '01', cause: '没有 PMF（产品与市场不匹配）', count: 829, pct: 38 },
  { rank: '02', cause: '合伙人决裂', count: 589, pct: 27 },
  { rank: '03', cause: '过早扩张', count: 458, pct: 21 },
  { rank: '04', cause: '现金流断裂', count: 415, pct: 19 },
  { rank: '05', cause: '伪需求', count: 371, pct: 17 },
  { rank: '06', cause: '竞品降维打击', count: 262, pct: 12 },
  { rank: '07', cause: '监管政策变化', count: 198, pct: 9 },
  { rank: '08', cause: '技术无法实现', count: 153, pct: 7 },
];

const INDUSTRY_MORTALITY_DATA = [
  { industry: 'AI 应用', rate: 92, annotation: '大模型一夜颠覆', color: '#8B2942' },
  { industry: '社交产品', rate: 89, annotation: '获客成本爆表', color: '#8B2942' },
  { industry: '在线教育', rate: 76, annotation: '政策+同质化', color: '#16423C' },
  { industry: '本地生活', rate: 71, annotation: '地推永无止境', color: '#16423C' },
  { industry: '消费金融', rate: 68, annotation: '监管天花板', color: '#2C6E63' },
  { industry: 'SaaS', rate: 64, annotation: '慢生意需要快钱', color: '#2C6E63' },
  { industry: '企业服务', rate: 61, annotation: '销售周期太长', color: '#4A9B8C' },
  { industry: '消费品', rate: 58, annotation: '供应链是深渊', color: '#4A9B8C' },
];

const BURN_RATE_DATA = [
  { month: 0, ai: 5, consumer: 8, saas: 3, local: 12 },
  { month: 3, ai: 15, consumer: 12, saas: 5, local: 18 },
  { month: 6, ai: 45, consumer: 18, saas: 8, local: 15 },
  { month: 9, ai: 78, consumer: 25, saas: 12, local: 28 },
  { month: 12, ai: 62, consumer: 32, saas: 15, local: 22 },
  { month: 15, ai: 55, consumer: 38, saas: 18, local: 35 },
  { month: 18, ai: 48, consumer: 42, saas: 22, local: 30 },
  { month: 21, ai: 35, consumer: 48, saas: 25, local: 25 },
  { month: 24, ai: 28, consumer: 52, saas: 28, local: 20 },
  { month: 27, ai: 20, consumer: 55, saas: 32, local: 18 },
  { month: 30, ai: 15, consumer: 58, saas: 35, local: 15 },
  { month: 33, ai: 10, consumer: 60, saas: 38, local: 12 },
  { month: 36, ai: 5, consumer: 62, saas: 42, local: 10 },
];

const SURVIVAL_RULES = [
  {
    number: '01',
    title: '先验证，再开发',
    description: '在写第一行代码之前，用 Landing Page 或原型验证需求。花 2 周验证能省下 6 个月的开发时间。',
    stat: '违反者失败率高 3.2x',
  },
  {
    number: '02',
    title: '合伙人比商业计划重要',
    description: '27% 的失败来自合伙人决裂。选择合伙人要像选择配偶一样谨慎——价值观、沟通能力、抗压性比能力互补更重要。',
    stat: '签署股东协议前必须谈好退出机制',
  },
  {
    number: '03',
    title: '控制烧钱速度',
    description: '月烧钱超过收入的 3 倍时，你有 6 个月的倒计时。保持至少 12 个月的 runway，永远准备一个「最差情况」预算。',
    stat: '83% 的失败公司 runway < 6 个月时死亡',
  },
  {
    number: '04',
    title: '别追风口，追问题',
    description: '风口创业的成功率是 8%，解决问题创业的成功率是 23%。找到一个人群的真实痛点，比找到一个热门赛道重要 10 倍。',
    stat: 'AI 应用 92% 死亡率就是最好的提醒',
  },
  {
    number: '05',
    title: '知道什么时候该 quit',
    description: '最昂贵的失败不是倒闭，而是明知不行还硬撑。设定清晰的「止损线」——如果 6 个月内达不到 X 指标，就优雅地退出。',
    stat: '硬撑超过 24 个月的创始人，恢复时间平均多 8 个月',
  },
];

/* ─────────────────────── custom tooltip ─────────────────────── */

function CustomMortalityTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof INDUSTRY_MORTALITY_DATA[0] }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-[#16423C] text-[#FAF6F1] px-3 py-2 rounded-lg text-sm shadow-xl border border-[rgba(250,246,241,0.15)]">
      <p className="font-medium">{data.industry}</p>
      <p className="text-[#C9A96E]" style={{ fontFamily: '"Space Grotesk", monospace' }}>
        死亡率 {data.rate}%
      </p>
      <p className="text-[#FAF6F1]/60 text-xs mt-1">{data.annotation}</p>
    </div>
  );
}

/* ─────────────────────── sections ─────────────────────── */

function PageHero() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT_EXPO } });
    tl.from('.di-eyebrow', { opacity: 0, duration: 0.4 })
      .from('.di-title', { y: 40, opacity: 0, duration: 0.8 }, 0.1)
      .from('.di-desc', { y: 20, opacity: 0, duration: 0.6 }, 0.3)
      .from('.di-freshness', { opacity: 0, duration: 0.5 }, 0.5);
  }, { scope: ref });

  return (
    <div ref={ref} className="bg-[#FAF6F1] pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p
          className="di-eyebrow text-[#2C6E63] text-xs font-medium"
          style={{ fontFamily: '"Noto Sans SC", sans-serif', letterSpacing: '0.1em' }}
        >
          数据洞察
        </p>
        <h1
          className="di-title mt-4 text-[#1A1A1A] leading-tight whitespace-pre-line"
          style={{
            fontFamily: '"Noto Serif SC", serif',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 700,
            letterSpacing: '0.03em',
          }}
        >
          {"这些项目死了，\n但它们留下的教训还活着。"}
        </h1>
        <p
          className="di-desc mt-4 text-[#6B6B6B] text-base max-w-lg"
          style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.75 }}
        >
          我们把 2,183 个失败故事的死因、烧钱金额、行业分布做了聚合分析。下面这些数据，可能会让你多睡 3 秒钟再决定要不要 quit。
        </p>
        <p
          className="di-freshness mt-4 text-[#6B6B6B] text-[13px]"
          style={{ fontFamily: '"Space Grotesk", monospace' }}
        >
          数据更新于 2025年1月15日 · 基于 2,183 条经过验证的失败复盘
        </p>
      </div>
    </div>
  );
}

function TopFailureCauses() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.from('.di-causes-left', {
      opacity: 0, x: -30, duration: 0.8,
      ease: EASE_OUT_EXPO,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 75%',
        onEnter: () => setAnimated(true),
      },
    });
    gsap.from('.di-causes-right', {
      opacity: 0, x: 30, duration: 0.8, delay: 0.3,
      ease: EASE_OUT_EXPO,
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
    });
  }, { scope: ref });

  // Custom horizontal bar using divs for precise gradient control
  const maxPct = Math.max(...FAILURE_CAUSES_DATA.map((d) => d.pct));

  return (
    <div ref={ref} className="bg-[#FAF6F1] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left — Horizontal bars */}
          <div className="di-causes-left lg:w-[55%]">
            <h2
              className="text-[#1A1A1A] text-xl font-bold mb-8"
              style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
            >
              项目都是怎么死的？
            </h2>

            <div className="flex flex-col gap-5">
              {FAILURE_CAUSES_DATA.map((item, i) => (
                <div key={item.rank} className="group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span
                      className="text-[#6B6B6B] text-[13px] w-6"
                      style={{ fontFamily: '"Space Grotesk", monospace', fontWeight: 500 }}
                    >
                      {item.rank}
                    </span>
                    <span
                      className="text-[#1A1A1A] text-[15px] font-medium flex-1 transition-transform duration-300 group-hover:translate-x-1"
                      style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                    >
                      {item.cause}
                    </span>
                    <span
                      className="text-[#2C6E63] text-lg font-bold"
                      style={{ fontFamily: '"Space Grotesk", monospace' }}
                    >
                      {animated ? `${item.pct}%` : '0%'}
                    </span>
                  </div>
                  <div className="ml-9 h-3 bg-[rgba(22,66,60,0.1)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: animated ? `${(item.pct / maxPct) * 100}%` : '0%',
                        background: 'linear-gradient(90deg, #16423C, #4A9B8C)',
                        transitionDelay: `${i * 80}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Insight text */}
          <div className="di-causes-right lg:w-[45%] lg:pl-12 flex flex-col justify-center">
            <h3
              className="text-[#1A1A1A] text-[22px] font-bold"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              最大的杀手不是钱
            </h3>
            <p
              className="mt-4 text-[#6B6B6B] text-[15px] leading-relaxed"
              style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.8 }}
            >
              38% 的失败源于「没有 PMF」——这意味着近四成的创业团队在验证需求之前就开始烧钱。
            </p>
            <p
              className="mt-4 text-[#6B6B6B] text-[15px] leading-relaxed"
              style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.8 }}
            >
              更让人警醒的是，27% 的失败来自合伙人决裂。这比「没钱了」更致命，因为钱可以再融，信任一旦破裂就很难修复。
            </p>

            <div className="mt-6 bg-[#F3EDE4] border-l-[3px] border-[#C9A96E] pl-4 py-3 rounded-r-lg">
              <p
                className="text-[#1A1A1A] text-sm font-medium flex items-start gap-2"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
              >
                <Lightbulb size={16} className="text-[#C9A96E] shrink-0 mt-0.5" />
                启示：在写第一行代码之前，先找 10 个陌生人聊聊你的产品。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IndustryMortality() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.from('.di-mortality-title', {
      y: 30, opacity: 0, duration: 0.7,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 75%',
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="bg-[#F3EDE4] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="di-mortality-title text-center mb-12">
          <h2
            className="text-[#1A1A1A]"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 700,
            }}
          >
            死亡率最高的赛道
          </h2>
          <p
            className="mt-3 text-[#6B6B6B] text-sm"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            以下行业的创业项目中，有多少比例在 3 年内宣告失败
          </p>
        </div>

        {/* Vertical Bar Chart with Recharts */}
        <div className="w-full" style={{ height: '420px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={INDUSTRY_MORTALITY_DATA}
              margin={{ top: 30, right: 20, left: 0, bottom: 20 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(22,66,60,0.1)"
                vertical={false}
              />
              <XAxis
                dataKey="industry"
                tick={{ fill: '#1A1A1A', fontSize: 13, fontFamily: '"Noto Sans SC", sans-serif', fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(22,66,60,0.15)' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#6B6B6B', fontSize: 12, fontFamily: '"Space Grotesk", monospace' }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip content={<CustomMortalityTooltip />} cursor={{ fill: 'rgba(22,66,60,0.05)' }} />
              <Bar dataKey="rate" radius={[6, 6, 0, 0]} animationDuration={1200} animationEasing="ease-out">
                {INDUSTRY_MORTALITY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Annotations */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
          {INDUSTRY_MORTALITY_DATA.map((item) => (
            <div key={item.industry} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[#6B6B6B] text-[11px]" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                {item.industry}: {item.annotation}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom insight */}
        <p
          className="mt-10 text-center text-[#6B6B6B] text-sm italic max-w-lg mx-auto"
          style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.7 }}
        >
          AI 应用的死亡率高达 92% — 不是因为 AI 不行，而是因为 AI 变化太快。昨天还能用的技术路线，今天可能就被一个开源模型颠覆了。
        </p>
      </div>
    </div>
  );
}

function BurnRateAnalysis() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.from('.di-burn-left', {
      opacity: 0, x: -30, duration: 0.8,
      ease: EASE_OUT_EXPO,
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
    });
    gsap.from('.di-burn-right', {
      opacity: 0, x: 20, stagger: 0.15, duration: 0.6,
      ease: EASE_OUT_EXPO,
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="bg-[#FAF6F1] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left — Line Chart */}
          <div className="di-burn-left lg:w-[60%]">
            <h2
              className="text-[#1A1A1A] text-xl font-bold mb-6"
              style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
            >
              烧钱速度曲线
            </h2>
            <div className="w-full" style={{ height: '380px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={BURN_RATE_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(22,66,60,0.1)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#6B6B6B', fontSize: 12, fontFamily: '"Space Grotesk", monospace' }}
                    axisLine={{ stroke: 'rgba(22,66,60,0.15)' }}
                    tickLine={false}
                    label={{ value: '月', position: 'insideBottomRight', offset: -5, fill: '#6B6B6B', fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: '#6B6B6B', fontSize: 12, fontFamily: '"Space Grotesk", monospace' }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: '月烧钱(万)', angle: -90, position: 'insideLeft', fill: '#6B6B6B', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#16423C',
                      border: '1px solid rgba(250,246,241,0.15)',
                      borderRadius: '10px',
                      color: '#FAF6F1',
                      fontFamily: '"Noto Sans SC", sans-serif',
                      fontSize: '13px',
                    }}
                    formatter={(value: number, name: string) => {
                      const names: Record<string, string> = { ai: 'AI 应用', consumer: '消费品', saas: 'SaaS', local: '本地生活' };
                      return [`¥${value}万`, names[name] || name];
                    }}
                    labelFormatter={(label: number) => `第 ${label} 个月`}
                  />
                  <Legend
                    formatter={(value: string) => {
                      const names: Record<string, string> = { ai: 'AI 应用', consumer: '消费品', saas: 'SaaS', local: '本地生活' };
                      return <span style={{ color: '#1A1A1A', fontFamily: '"Noto Sans SC", sans-serif', fontSize: '13px' }}>{names[value] || value}</span>;
                    }}
                  />
                  <Line type="monotone" dataKey="ai" stroke="#8B2942" strokeWidth={2.5} dot={{ r: 4, fill: '#8B2942' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="consumer" stroke="#C9A96E" strokeWidth={2.5} dot={{ r: 4, fill: '#C9A96E' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="saas" stroke="#2C6E63" strokeWidth={2.5} dot={{ r: 4, fill: '#2C6E63' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="local" stroke="#16423C" strokeWidth={2.5} dot={{ r: 4, fill: '#16423C' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right — Insights */}
          <div className="lg:w-[40%] lg:pl-8 flex flex-col justify-center">
            <h3
              className="di-burn-right text-[#1A1A1A] text-[22px] font-bold"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              什么时候最危险？
            </h3>

            <div className="di-burn-right mt-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-[#8B2942]" />
                <h4
                  className="text-[#1A1A1A] text-base font-bold"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                >
                  Month 6–12: 扩张陷阱
                </h4>
              </div>
              <p
                className="text-[#6B6B6B] text-sm leading-relaxed"
                style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.7 }}
              >
                大多数团队在拿到第一笔融资后的第6-12个月开始扩张。这时候月烧钱速度会翻2-3倍，但收入往往还没跟上。
              </p>
            </div>

            <div className="di-burn-right mt-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-[#C9A96E]" />
                <h4
                  className="text-[#1A1A1A] text-base font-bold"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                >
                  Month 18: 续命关头
                </h4>
              </div>
              <p
                className="text-[#6B6B6B] text-sm leading-relaxed"
                style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.7 }}
              >
                18个月是很多创业公司的生死线。如果这时候还没有稳定的现金流或新一轮融资，倒闭概率会急剧上升。
              </p>
            </div>

            <div className="di-burn-right mt-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-[#2C6E63]" />
                <h4
                  className="text-[#8B2942] text-base font-bold"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                >
                  Month 24+: 慢性死亡
                </h4>
              </div>
              <p
                className="text-[#6B6B6B] text-sm leading-relaxed"
                style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.7 }}
              >
                能撑过24个月的公司往往陷入「僵尸状态」——半死不活，既没死透也没活好。这种状态比快速死亡更消耗创始人。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FounderSurvivalGuide() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
    });
    tl.from('.di-survival-header', { y: 30, opacity: 0, duration: 0.7 })
      .from('.di-survival-rule', {
        y: 20, opacity: 0, stagger: 0.12, duration: 0.5,
        ease: EASE_OUT_EXPO,
      }, 0.2);
  }, { scope: ref });

  return (
    <div ref={ref} className="bg-[#16423C] py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="di-survival-header text-center">
          <h2
            className="text-[#FAF6F1]"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 700,
            }}
          >
            创始人存活指南
          </h2>
          <p
            className="mt-3 text-[#FAF6F1]/60 text-sm"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            基于 2,183 个失败案例提炼的 5 条铁律
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-8">
          {SURVIVAL_RULES.map((rule) => (
            <div key={rule.number} className="di-survival-rule flex gap-6">
              <span
                className="text-[#C9A96E]/40 shrink-0 text-center"
                style={{
                  fontFamily: '"Space Grotesk", monospace',
                  fontSize: '48px',
                  fontWeight: 700,
                  minWidth: '60px',
                  lineHeight: 1,
                }}
              >
                {rule.number}
              </span>
              <div>
                <h3
                  className="text-[#FAF6F1] text-xl font-bold"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                >
                  {rule.title}
                </h3>
                <p
                  className="mt-2 text-[#FAF6F1]/70 text-[15px] leading-relaxed"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.75 }}
                >
                  {rule.description}
                </p>
                <p
                  className="mt-2 text-[#2C6E63] text-[13px] font-medium"
                  style={{ fontFamily: '"Space Grotesk", monospace' }}
                >
                  {rule.stat}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsletterCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');

  useGSAP(() => {
    if (!ref.current) return;
    gsap.from('.di-newsletter-content', {
      y: 30, opacity: 0, duration: 0.8,
      ease: EASE_OUT_EXPO,
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="bg-[#16423C] py-16 border-t border-[rgba(250,246,241,0.1)]">
      <div className="di-newsletter-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-[#FAF6F1] text-[28px] font-bold"
          style={{ fontFamily: '"Noto Serif SC", serif' }}
        >
          数据每周更新
        </h2>
        <p
          className="mt-3 text-[#FAF6F1]/70 text-sm max-w-md mx-auto"
          style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.7 }}
        >
          每周三，我们把最新的数据洞察、行业趋势和创始人教训打包寄给你。不灌水，不鸡汤。
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-4 py-3 rounded-lg text-[#FAF6F1] text-sm placeholder:text-[#FAF6F1]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 transition-all"
            style={{
              backgroundColor: 'rgba(250,246,241,0.1)',
              border: '1px solid rgba(250,246,241,0.2)',
              fontFamily: '"Noto Sans SC", sans-serif',
            }}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#FAF6F1] text-[#16423C] text-sm font-bold rounded-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[#C9A96E] shrink-0"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            订阅数据周报 →
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────── main page ─────────────────────── */

export default function DataInsights() {
  return (
    <div className="min-h-[100dvh] bg-[#FAF6F1]">
      <PageHero />
      <TopFailureCauses />
      <IndustryMortality />
      <BurnRateAnalysis />
      <FounderSurvivalGuide />
      <NewsletterCTA />
    </div>
  );
}
