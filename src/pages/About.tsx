import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Eye, Shield, BookOpen, ChevronRight, FileText, Database, Users, Archive } from 'lucide-react';

/* ---------- easing ---------- */
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ---------- animation variants ---------- */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

/* ---------- data ---------- */
const values = [
  {
    icon: Eye,
    title: '真实大于完美',
    body: '我们不展示「成功学」的滤镜。每一个点子都是粗糙的，每一段失败都是狼狈的。但正是这些不完美的真实，比任何精心包装的案例研究都更有价值。',
  },
  {
    icon: Shield,
    title: '匿名就是保护',
    body: '创业圈子里，「失败」是一个很难说出口的词汇。匿名让创始人可以卸下包袱，说出那些只有在深夜才会对自己承认的话。',
  },
  {
    icon: BookOpen,
    title: '教训应该被传承',
    body: '2,183 次失败烧掉了 14.2 亿。如果这些教训只留在当事人的记忆里，那这笔钱就真的白烧了。我们要让每一个坑都变成后来人的路标。',
  },
];

const processSteps = [
  { icon: FileText, title: '投稿提交', desc: '创始人通过表单提交失败经历，附关键数据' },
  { icon: Database, title: '数据核验', desc: '我们与公开信息（工商数据、融资记录）交叉验证' },
  { icon: Users, title: '社区审核', desc: '由经验丰富的创业者社区成员进行内容审核' },
  { icon: Archive, title: '发布归档', desc: '通过后正式发布，进入数据库用于后续分析' },
];

const stats = [
  { label: '累计收集', value: '2,183', suffix: '条' },
  { label: '验证通过率', value: '87', suffix: '%' },
  { label: '社区审核员', value: '156', suffix: '人' },
  { label: '平均审核时间', value: '36', suffix: '小时' },
];

const team = [
  { name: '陈默', role: '创始人', bio: '连续创业 3 次，2 次失败。第二次失败后失眠了 6 个月，然后有了白泽。', initials: '默' },
  { name: '林小雨', role: '产品负责人', bio: '前互联网大厂 PM，辞职后做过一个死掉的社交 App。现在帮别人记录死亡。', initials: '雨' },
  { name: '老张', role: '数据科学家', bio: '统计学博士，研究方向是「创业失败的预测模型」。理想是让每个创始人都带着数据创业。', initials: '张' },
  { name: 'Zoe', role: '设计与内容', bio: '设计师出身，相信好内容值得好设计。负责让失败的故事看起来不那么难看。', initials: 'Z' },
];

/* ---------- count-up hook ---------- */
function useCountUp(end: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [end, duration, start]);

  return count;
}

/* ---------- stat card ---------- */
function StatCard({ value, suffix, label, inView }: { value: string; suffix: string; label: string; inView: boolean }) {
  const numericValue = parseInt(value.replace(/,/g, ''));
  const count = useCountUp(numericValue, 1.5, inView);
  const display = value.includes(',') ? count.toLocaleString() : String(count);

  return (
    <motion.div
      variants={staggerItem}
      className="bg-[#FAF6F1] border border-[rgba(22,66,60,0.1)] rounded-2xl p-6 text-center"
    >
      <p className="text-4xl font-bold text-[#16423C]" style={{ fontFamily: '"Space Grotesk", monospace' }}>
        {display}{suffix}
      </p>
      <p className="mt-1 text-[13px] text-[#6B6B6B]" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
        {label}
      </p>
    </motion.div>
  );
}

/* ---------- main page ---------- */
export default function About() {
  const [statsInView, setStatsInView] = useState(false);

  return (
    <div className="min-h-[100dvh]">
      {/* ========== Section 1: Hero ========== */}
      <section className="bg-[#16423C] pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-medium tracking-[0.1em] text-[#2C6E63]"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            关于白泽
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.2, ease: easeOutExpo }}
            className="mt-4 text-[clamp(32px,4vw,52px)] font-bold text-[#FAF6F1] leading-tight tracking-wide"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            让每一个点子被看见，
            <br />
            让每一次失败被记住。
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: easeOutExpo }}
            className="mt-6 text-base text-[#FAF6F1]/75 max-w-2xl leading-loose"
            style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.8 }}
          >
            白泽是中国古代传说中的神兽，通晓万物，能辨善恶。我们借这个名字，想做一个同样「知晓万物」的地方——只不过我们知晓的，是创业者最真实的想法和最痛的教训。
          </motion.p>
        </div>
      </section>

      {/* ========== Section 2: Mission & Values ========== */}
      <section className="bg-[#FAF6F1] py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-center"
          >
            <p
              className="text-xs font-medium tracking-[0.1em] text-[#2C6E63]"
              style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
            >
              使命与价值观
            </p>
            <h2
              className="mt-3 text-[clamp(24px,3vw,36px)] font-bold text-[#1A1A1A] tracking-wide"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              我们为什么存在
            </h2>
          </motion.div>

          {/* Value Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={staggerItem}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(22,66,60,0.08)' }}
                className="bg-[#F3EDE4] border border-[rgba(22,66,60,0.1)] rounded-[20px] p-8 text-center transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2C6E63]/10 mb-4">
                  <v.icon size={24} className="text-[#2C6E63]" />
                </div>
                <h3
                  className="text-xl font-bold text-[#1A1A1A] mb-3"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-[15px] text-[#6B6B6B] leading-relaxed"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.75 }}
                >
                  {v.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== Section 3: Methodology ========== */}
      <section className="bg-[#F3EDE4] py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
            >
              <p
                className="text-xs font-medium tracking-[0.1em] text-[#2C6E63]"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
              >
                方法论
              </p>
              <h2
                className="mt-3 text-[clamp(22px,2.5vw,32px)] font-bold text-[#1A1A1A] tracking-wide"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                我们怎么收集和验证数据
              </h2>
              <div
                className="mt-4 text-[15px] text-[#6B6B6B] leading-loose space-y-4"
                style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.8 }}
              >
                <p>
                  每一条失败复盘都经过三重验证：投稿者身份确认（可选择匿名发布但后台实名）、关键数据交叉核对、以及社区众包的事实核查。
                </p>
                <p>
                  我们不接受道听途说的「我朋友的公司」类型的投稿。所有数据都来自创始人或核心团队成员的一手叙述。
                </p>
              </div>

              {/* Process list */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-6 flex flex-col gap-4"
              >
                {processSteps.map((s) => (
                  <motion.div
                    key={s.title}
                    variants={staggerItem}
                    className="flex items-start gap-4"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#2C6E63]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <s.icon size={16} className="text-[#2C6E63]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                        {s.title}
                      </p>
                      <p className="text-sm text-[#6B6B6B] mt-0.5" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                        {s.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
              onViewportEnter={() => setStatsInView(true)}
              className="grid grid-cols-2 gap-4 content-start"
            >
              {stats.map((s) => (
                <StatCard key={s.label} {...s} inView={statsInView} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== Section 4: The Team ========== */}
      <section className="bg-[#FAF6F1] py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-center"
          >
            <p
              className="text-xs font-medium tracking-[0.1em] text-[#2C6E63]"
              style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
            >
              团队
            </p>
            <h2
              className="mt-3 text-[clamp(24px,3vw,36px)] font-bold text-[#1A1A1A] tracking-wide"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              一群相信失败有价值的人
            </h2>
          </motion.div>

          {/* Team Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={staggerItem}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[#F3EDE4] border-2 border-[rgba(22,66,60,0.1)] flex items-center justify-center mx-auto">
                  <span
                    className="text-2xl font-bold text-[#2C6E63]"
                    style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                  >
                    {member.initials}
                  </span>
                </div>
                <h3
                  className="mt-4 text-base font-bold text-[#1A1A1A]"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                >
                  {member.name}
                </h3>
                <p
                  className="mt-1 text-[13px] font-medium text-[#2C6E63]"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                >
                  {member.role}
                </p>
                <p
                  className="mt-2 text-[13px] text-[#6B6B6B] leading-relaxed max-w-[240px] mx-auto"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.6 }}
                >
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== Section 5: The Baize Legend ========== */}
      <section className="bg-[#16423C] py-24 relative overflow-hidden">
        {/* Decorative watermark */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 2.0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-[400px] h-[400px] text-[#C9A96E] opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          >
            {/* Stylized Baize creature - mythical deer/dragon */}
            <ellipse cx="100" cy="140" rx="35" ry="12" />
            <path d="M70 140 Q65 110 80 90 Q85 75 80 60" />
            <path d="M130 140 Q135 110 120 90 Q115 75 120 60" />
            <path d="M80 60 Q70 40 85 30 Q90 25 95 35" />
            <path d="M120 60 Q130 40 115 30 Q110 25 105 35" />
            <ellipse cx="100" cy="95" rx="28" ry="32" />
            <circle cx="90" cy="88" r="4" fill="currentColor" />
            <circle cx="110" cy="88" r="4" fill="currentColor" />
            <path d="M95 98 Q100 102 105 98" />
            <path d="M100 102 L100 108" />
            <path d="M72 95 Q60 85 55 70 Q52 60 58 55" />
            <path d="M128 95 Q140 85 145 70 Q148 60 142 55" />
            <path d="M78 55 Q75 35 85 25" />
            <path d="M122 55 Q125 35 115 25" />
            <circle cx="100" cy="70" r="6" />
            <path d="M94 70 Q100 65 106 70" />
          </svg>
        </motion.div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-xs font-medium tracking-[0.1em] text-[#2C6E63]"
              style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
            >
              传说
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
              className="mt-4 text-[clamp(24px,3vw,36px)] font-bold text-[#FAF6F1] tracking-wide"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              白泽是什么？
            </motion.h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-8 space-y-6 text-left"
          >
            <motion.p
              variants={staggerItem}
              className="text-[15px] text-[#FAF6F1]/75 leading-loose"
              style={{ fontFamily: '"Noto Serif SC", serif', lineHeight: 2.0 }}
            >
              白泽是中国古代神话中的神兽。它通体雪白，会说人话，通晓天下万物之情。传说黄帝巡游东海时遇到了白泽，它向黄帝讲述了天下 11,520 种精怪的名字、形貌和驱除之法。黄帝命人将白泽所言记录下来，传于后世。
            </motion.p>

            <motion.p
              variants={staggerItem}
              className="text-[15px] text-[#FAF6F1]/75 leading-loose"
              style={{ fontFamily: '"Noto Serif SC", serif', lineHeight: 2.0 }}
            >
              我们借这个名字，想做一件类似的事：走遍创业这片「东海」，记录下每一个项目的名字、每一段失败的故事、每一条血换来的教训。不是为了「驱除」创业，而是为了让每一个踏上这条路的人，少一些盲目，多一些清醒。
            </motion.p>

            <motion.p
              variants={staggerItem}
              className="text-[15px] text-[#FAF6F1]/75 leading-loose"
              style={{ fontFamily: '"Noto Serif SC", serif', lineHeight: 2.0 }}
            >
              白泽通晓万物。我们也想通晓创业路上的每一个坑。
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8, ease: easeOutExpo }}
            className="mt-12 text-center"
          >
            <Link
              to="/community"
              className="inline-flex items-center gap-1 px-8 py-3 bg-[#C9A96E] text-[#16423C] text-sm font-bold rounded-full transition-all duration-300 hover:scale-[1.02] hover:bg-[#FAF6F1]"
            >
              加入这个知晓万物的旅程 <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
