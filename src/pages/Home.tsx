import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router';
import { ChevronDown, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  StarFieldOverlay — Canvas星星叠加层 (稀疏精致闪烁 + 流星)          */
/* ------------------------------------------------------------------ */

interface StarLite { x: number; y: number; radius: number; baseAlpha: number; twinkleSpeed: number; twinklePhase: number; }
interface ShootingStarLite { x: number; y: number; vx: number; vy: number; length: number; alpha: number; life: number; maxLife: number; }

function StarFieldOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<StarLite[]>([]);
  const shootersRef = useRef<ShootingStarLite[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  const initStars = useCallback((w: number, h: number) => {
    const count = Math.floor((w * h * 0.6) / 8000);
    const stars: StarLite[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({ x: Math.random() * w, y: Math.random() * h * 0.65, radius: Math.random() * 1.2 + 0.2, baseAlpha: Math.random() * 0.5 + 0.15, twinkleSpeed: Math.random() * 0.015 + 0.003, twinklePhase: Math.random() * Math.PI * 2 });
    }
    starsRef.current = stars;
  }, []);

  const spawnShooter = useCallback((w: number, h: number) => {
    shootersRef.current.push({ x: Math.random() * w * 0.7, y: Math.random() * h * 0.3, vx: Math.cos(Math.PI / 4 + Math.random() * 0.4) * (Math.random() * 3 + 4), vy: Math.sin(Math.PI / 4 + Math.random() * 0.4) * (Math.random() * 3 + 4), length: Math.random() * 50 + 30, alpha: 1, life: 0, maxLife: Math.random() * 35 + 25 });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); const w = canvas.offsetWidth, h = canvas.offsetHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); initStars(w, h); };
    resize(); window.addEventListener('resize', resize);
    let shootTimer = 0;
    const animate = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight; timeRef.current += 1; ctx.clearRect(0, 0, w, h);
      const t = timeRef.current;
      for (const s of starsRef.current) { const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase); const alpha = Math.max(0, Math.min(1, s.baseAlpha + twinkle * 0.25)); ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill(); if (s.radius > 0.8) { ctx.beginPath(); ctx.arc(s.x, s.y, s.radius * 4, 0, Math.PI * 2); ctx.fillStyle = `rgba(200,220,255,${alpha * 0.08})`; ctx.fill(); } }
      shootTimer++; if (shootTimer > Math.random() * 300 + 180) { spawnShooter(w, h); shootTimer = 0; }
      for (let i = shootersRef.current.length - 1; i >= 0; i--) { const s = shootersRef.current[i]; s.x += s.vx; s.y += s.vy; s.life++; s.alpha = 1 - s.life / s.maxLife; if (s.life >= s.maxLife || s.x > w + 100 || s.y > h + 100) { shootersRef.current.splice(i, 1); continue; } const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy); const tx = s.x - (s.vx / spd) * s.length, ty = s.y - (s.vy / spd) * s.length; const grad = ctx.createLinearGradient(s.x, s.y, tx, ty); grad.addColorStop(0, `rgba(255,255,255,${s.alpha})`); grad.addColorStop(0.2, `rgba(200,220,255,${s.alpha * 0.5})`); grad.addColorStop(1, `rgba(180,200,255,0)`); ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tx, ty); ctx.strokeStyle = grad; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.stroke(); }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [initStars, spawnShooter]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }} />;
}

/* ------------------------------------------------------------------ */
/*  BaizeConstellation — 白泽星座图腾 (星空连线)                        */
/* ------------------------------------------------------------------ */

const BAIZE_POINTS = [
  { x: 0.58, y: 0.18, size: 2.2, name: 'horn' }, { x: 0.56, y: 0.22, size: 1.5, name: 'horn-base' }, { x: 0.54, y: 0.26, size: 1.8, name: 'head-top' },
  { x: 0.52, y: 0.30, size: 2.5, name: 'eye' }, { x: 0.48, y: 0.34, size: 1.6, name: 'nose' }, { x: 0.46, y: 0.36, size: 1.2, name: 'mouth' },
  { x: 0.50, y: 0.38, size: 1.4, name: 'neck' }, { x: 0.54, y: 0.42, size: 1.6, name: 'chest' }, { x: 0.52, y: 0.52, size: 1.8, name: 'front-leg' },
  { x: 0.50, y: 0.62, size: 1.4, name: 'front-paw' }, { x: 0.58, y: 0.44, size: 1.5, name: 'body-mid' }, { x: 0.64, y: 0.42, size: 1.7, name: 'back' },
  { x: 0.68, y: 0.50, size: 1.6, name: 'hind-leg' }, { x: 0.70, y: 0.62, size: 1.3, name: 'hind-paw' }, { x: 0.60, y: 0.52, size: 1.2, name: 'belly' },
  { x: 0.72, y: 0.38, size: 1.8, name: 'tail-1' }, { x: 0.78, y: 0.32, size: 2.0, name: 'tail-2' }, { x: 0.84, y: 0.28, size: 1.6, name: 'tail-tip' },
  { x: 0.56, y: 0.30, size: 1.0, name: 'mane-1' }, { x: 0.58, y: 0.34, size: 0.9, name: 'mane-2' }, { x: 0.54, y: 0.36, size: 1.1, name: 'mane-3' },
];
const BAIZE_LINES = [[0,1],[1,2],[2,3],[3,4],[4,5],[3,6],[6,7],[7,8],[8,9],[7,10],[10,11],[11,12],[12,13],[10,14],[14,7],[11,15],[15,16],[16,17],[2,18],[3,19],[6,20]];

function BaizeConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); const w = canvas.offsetWidth, h = canvas.offsetHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); window.addEventListener('resize', resize);
    let time = 0;
    const animate = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight; time += 1; ctx.clearRect(0, 0, w, h); const scaleX = w, scaleY = h;
      for (const [from, to] of BAIZE_LINES) { const p1 = BAIZE_POINTS[from], p2 = BAIZE_POINTS[to]; const x1 = p1.x * scaleX, y1 = p1.y * scaleY, x2 = p2.x * scaleX, y2 = p2.y * scaleY; const breath = 0.5 + Math.sin(time * 0.008 + (from + to) * 0.5) * 0.2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = `rgba(160,190,240,${breath * 0.25})`; ctx.lineWidth = 6; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = `rgba(220,230,250,${breath * 0.6})`; ctx.lineWidth = 1.2; ctx.stroke(); }
      for (let i = 0; i < BAIZE_POINTS.length; i++) { const p = BAIZE_POINTS[i]; const x = p.x * scaleX, y = p.y * scaleY; const twinkle = Math.sin(time * 0.012 + i * 1.3) * 0.3 + 0.7, alpha = twinkle; const glowSize = p.size * 6 * twinkle; const grad = ctx.createRadialGradient(x, y, 0, x, y, glowSize); grad.addColorStop(0, `rgba(200,220,255,${alpha * 0.45})`); grad.addColorStop(0.4, `rgba(180,200,240,${alpha * 0.15})`); grad.addColorStop(1, 'rgba(180,200,240,0)'); ctx.beginPath(); ctx.arc(x, y, glowSize, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill(); ctx.beginPath(); ctx.arc(x, y, p.size * 1.4 * twinkle, 0, Math.PI * 2); ctx.fillStyle = `rgba(248,252,255,${alpha})`; ctx.fill(); if (p.name === 'eye') { ctx.beginPath(); ctx.arc(x, y, p.size * 4, 0, Math.PI * 2); const eyeGrad = ctx.createRadialGradient(x, y, 0, x, y, p.size * 4); eyeGrad.addColorStop(0, `rgba(255,255,255,${alpha * 0.7})`); eyeGrad.addColorStop(0.5, `rgba(200,230,255,${alpha * 0.2})`); eyeGrad.addColorStop(1, 'rgba(200,220,255,0)'); ctx.fillStyle = eyeGrad; ctx.fill(); } }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate); return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3 }} />;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  { number: '7,429', label: '野生点子', numericValue: 7429 },
  { number: '2,183', label: '失败复盘', numericValue: 2183 },
  { number: '14.2', prefix: '¥', suffix: '亿', label: '烧掉的钱', numericValue: 14.2 },
  { number: '31,608', label: '沉默的观众', numericValue: 31608 },
];

const marqueeQuotes = [
  '"从，此再没提起"',
  '"那时候天真了，一年后真香了"',
  '"用户说反馈来，然后没有一个人付费"',
  '"我们属于细节手，一起死在了同一个冬天"',
  '"最有价值的失败，是没被重复的那一次"',
];

const ideaCategories = ['全部', 'AI 应用', 'SaaS', '消费品', '内容社区', '社交产品', '在线教育', '本地生活', '金融科技', '企业服务'];

const ideaCards = [
  { category: 'AI 应用', title: '帮老年人读的「AI 剪报翻译器」', comments: 12, likes: 248, image: '/idea-ai-agent.jpg' },
  { category: '内容社区', title: '专门接收的分龄营养盲盒', comments: 27, likes: 155, image: '/idea-community.jpg' },
  { category: 'SaaS', title: '小团队专用的「定期提醒管家」', comments: 42, likes: 189, image: '/idea-saas.jpg' },
  { category: '本地生活', title: '给独居青年的「周末有人陪」服务', comments: 18, likes: 334, image: '/idea-wellness.jpg' },
  { category: 'AI 应用', title: '用 AI 生成「孩子睡前故事」的语音版', comments: 56, likes: 412, image: '/idea-education.jpg' },
  { category: '消费品', title: '可降解的「宠物便便袋」订阅制', comments: 9, likes: 127, image: '/idea-fintech.jpg' },
  { category: '社交产品', title: '「城市漫游者」线下偶遇地图', comments: 33, likes: 276, image: '/idea-ai-agent.jpg' },
  { category: '企业服务', title: '自由职业者的「自动报税助手」', comments: 21, likes: 198, image: '/idea-saas.jpg' },
];

const failureCases = [
  {
    name: 'Meowspace',
    category: '共享办公',
    deathDate: '2023.11',
    quote: '「那时候以为有了一个空间就有了生态，后来才发现，空间是最不值钱的。」',
    image: '/fail-meowspace.jpg',
  },
  {
    name: '晨读岛',
    category: '在线教育',
    deathDate: '2022.8',
    quote: '「做了6个月才发现，用户要的不是早起，而是「我已经努力了」的感觉。」',
    image: '/fail-morning-island.jpg',
  },
  {
    name: 'Fikaa 咖啡',
    category: '消费品',
    deathDate: '2024.1',
    quote: '「第4家门店开业那天，两个合伙人同时在微信里跟我说，要不我们别开了。」',
    image: '/fail-fikaa-coffee.jpg',
  },
];

const failureCauses = [
  { rank: '01', cause: '没有 PMF', percentage: 38 },
  { rank: '02', cause: '合伙人决裂', percentage: 27 },
  { rank: '03', cause: '过早扩张', percentage: 21 },
  { rank: '04', cause: '现金流断裂', percentage: 15 },
  { rank: '05', cause: '伪需求', percentage: 11 },
  { rank: '06', cause: '竞品降维打击', percentage: 9 },
];

const industryMortality = [
  { industry: 'AI 应用', rate: 92, color: '#8B2942' },
  { industry: '社交产品', rate: 89, color: '#8B2942' },
  { industry: '在线教育', rate: 76, color: '#16423C' },
  { industry: '本地生活', rate: 71, color: '#2C6E63' },
  { industry: 'SaaS', rate: 64, color: '#4A9B8C' },
];

const communityQuotes = [
  { name: '林深见鹿', role: '连续创业者', quote: '「来这里之前我以为我的失败很丢人。看了200多个墓志铭之后我发现——原来我们死的方式都一样。」', time: '2天前' },
  { name: '一只野生 PM', role: '产品经理', quote: '「产品下线的第十个夜晚，我看行泪的深夜话题。比看任何创业书都有用。这里的真实感是别的地方给不了的。」', time: '5天前' },
  { name: '午后猫', role: '独立开发者', quote: '「本来只是想找灵感，结果在这里找到了三个不应该做的想法。省下的时间大概够我重做两次。」', time: '1周前' },
  { name: 'Kai 老凯', role: '前创始人', quote: '「把自己三年前死掉的项目写下来之后，我失眠了三个月里的第一个安稳觉。这个网站是有魔力的。」', time: '3天前' },
  { name: '陈见素', role: '投资人', quote: '「我把这个网站推给了我们所有的被投团队。看别人的坑比自己踩要有价值得多。」', time: '1周前' },
  { name: 'Zoe 之墨', role: '设计师', quote: '「匿名分享让人可以说真话。这里的真实比新闻稿要珍贵一百倍，读起来像在看朋友的私信。」', time: '4天前' },
];

/* ------------------------------------------------------------------ */
/*  Animated Counter Hook                                              */
/* ------------------------------------------------------------------ */

function useAnimatedCounter(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [start, target, duration]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  Section: Hero                                                      */
/* ------------------------------------------------------------------ */

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-line1', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, 0.3)
        .fromTo('.hero-line2', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, 0.7)
        .fromTo('.hero-cta1', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.1)
        .fromTo('.hero-cta2', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.3)
        .fromTo('.hero-cta3', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.5);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* 高质量星空背景图 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-starry-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.85)' }}
        />
        {/* 底部渐变过渡 */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0D1F15]/80 to-transparent" />
        {/* 左侧渐变让文字更清晰 */}
        <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#0a1628]/60 to-transparent" />
      </div>

      {/* Canvas 星星叠加层 */}
      <StarFieldOverlay />

      {/* 白泽星座图腾 */}
      <BaizeConstellation />

      <div ref={contentRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          {/* Headline */}
          <h1
            className="text-[#FAF8F5] font-black leading-[1.2] tracking-[0.04em] drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 'clamp(36px, 5.5vw, 68px)',
            }}
          >
            <span className="hero-line1 block opacity-0">你的点子值得被看见，</span>
            <span className="hero-line2 block opacity-0">你的失败值得被记住。</span>
          </h1>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              to="/ideas"
              className="hero-cta1 inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-full font-bold text-sm opacity-0 transition-all duration-300 hover:bg-white/30 border border-white/30 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
            >
              <span>找灵感</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/failures"
              className="hero-cta2 inline-flex items-center gap-2 px-5 py-2.5 border border-white/40 text-white rounded-full font-medium text-sm opacity-0 transition-all duration-300 hover:bg-white/15 backdrop-blur-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
            >
              <span>查失败</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/ongoing"
              className="hero-cta3 inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4A853]/20 backdrop-blur-sm text-[#D4A853] rounded-full font-medium text-sm opacity-0 transition-all duration-300 hover:bg-[#D4A853]/30 border border-[#D4A853]/30"
            >
              <span>看在途项目</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[#FAF8F5]/40 text-xs">向下滚动</span>
        <ChevronDown size={20} className="text-[#FAF8F5]/40 animate-bounce-subtle" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Stats Ticker                                              */
/* ------------------------------------------------------------------ */

function StatsTickerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const tickerBandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered || !tickerBandRef.current) return;
    gsap.fromTo(
      tickerBandRef.current,
      { x: '-100%' },
      { x: '0%', duration: 1.0, ease: 'power3.out' }
    );
  }, [triggered]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Ticker band */}
      <div
        ref={tickerBandRef}
        className="bg-[#C9A96E] border-y border-[rgba(22,66,60,0.15)] py-8"
        style={{ transform: 'translateX(-100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, i) => (
              <StatItem key={i} stat={stat} triggered={triggered} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>

      {/* Quote marquee */}
      <div className="bg-[#16423C] py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeQuotes, ...marqueeQuotes, ...marqueeQuotes, ...marqueeQuotes].map((quote, i) => (
            <span key={i} className="text-[13px] text-[#FAF8F5]/40 mx-8">
              {quote}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  stat,
  triggered,
  delay,
}: {
  stat: (typeof stats)[0];
  triggered: boolean;
  delay: number;
}) {
  const [showLabel, setShowLabel] = useState(false);
  const count = useAnimatedCounter(stat.numericValue, 2000, triggered);

  useEffect(() => {
    if (triggered) {
      const timer = setTimeout(() => setShowLabel(true), delay + 300);
      return () => clearTimeout(timer);
    }
  }, [triggered, delay]);

  const displayNumber =
    stat.prefix === '¥'
      ? `${stat.prefix}${count.toFixed(1)}${stat.suffix || ''}`
      : stat.numericValue >= 1000
        ? Math.floor(count).toLocaleString()
        : count.toFixed(1);

  return (
    <div className="text-center">
      <div
        className="text-[#16423C] font-bold tracking-[-0.03em]"
        style={{
          fontFamily: '"Space Grotesk", monospace',
          fontSize: 'clamp(32px, 4vw, 48px)',
        }}
      >
        {displayNumber}
      </div>
      <div
        className="mt-1 text-sm text-[#16423C]/70 transition-opacity duration-500"
        style={{
          opacity: showLabel ? 1 : 0,
          fontFamily: '"Noto Sans SC", sans-serif',
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Idea Wall Preview                                         */
/* ------------------------------------------------------------------ */

function IdeaWallSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('全部');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.idea-header',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.idea-header', start: 'top 80%' },
        }
      );

      gsap.fromTo(
        '.idea-tab',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.idea-tabs', start: 'top 85%' },
        }
      );

      gsap.fromTo(
        '.idea-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.idea-grid', start: 'top 85%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#FAF8F5] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="idea-header">
          <p className="text-xs font-medium text-[#2C6E63] tracking-[0.1em] uppercase">
            IDEA WALL · 点子墙
          </p>
          <h2
            className="mt-4 text-[#1A1A1A] font-bold leading-[1.3] tracking-[0.03em]"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
            }}
          >
            还在脑子里发酵的，
            <br />
            先扔到墙上再说。
          </h2>
          <p className="mt-4 text-[15px] text-[#6B6B6B] max-w-lg leading-[1.75]">
            没有商业计划书，没有 PPT，没有 pitch。只是把你半夜里冒出来的想法写下来，看看有没有人比你更疯。
          </p>
        </div>

        {/* Filter tabs */}
        <div className="idea-tabs flex flex-wrap gap-2 mt-8">
          {ideaCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`idea-tab px-4 py-1.5 rounded-full text-[13px] transition-all duration-250 border ${
                activeCategory === cat
                  ? 'bg-[#2C6E63] text-[#FAF8F5] border-[#2C6E63]'
                  : 'bg-transparent text-[#6B6B6B] border-[rgba(22,66,60,0.1)] hover:border-[#2C6E63] hover:text-[#2C6E63]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div className="idea-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {ideaCards.map((card, i) => (
            <div
              key={i}
              className="idea-card group bg-[#F3EDE4] border border-[rgba(22,66,60,0.1)] rounded-2xl p-4 cursor-pointer transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(22,66,60,0.12)]"
              style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)' }}
            >
              {/* Image */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Category */}
              <span className="inline-block px-3 py-1 text-xs text-[#2C6E63] bg-[#2C6E63]/15 rounded-full mb-2">
                {card.category}
              </span>

              {/* Title */}
              <h3 className="text-base font-bold text-[#1A1A1A] line-clamp-2 leading-[1.4]">
                {card.title}
              </h3>

              {/* Stats */}
              <div className="flex items-center gap-3 mt-3 text-[13px] text-[#6B6B6B]">
                <span className="flex items-center gap-1">
                  <MessageCircle size={13} />
                  {card.comments}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={13} />
                  {card.likes}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <Link
            to="/ideas"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#2C6E63] transition-all duration-300 group"
          >
            <span>浏览全部 7,429 个野生点子</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Failure Archive Preview                                   */
/* ------------------------------------------------------------------ */

function FailureArchiveSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.failure-header',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.failure-header', start: 'top 80%' },
        }
      );

      gsap.fromTo(
        '.failure-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.failure-grid', start: 'top 85%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#16423C] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="failure-header">
          <p className="text-xs font-medium text-[#2C6E63] tracking-[0.1em] uppercase">
            FAILURE ARCHIVE · 失败档案
          </p>
          <h2
            className="mt-4 text-[#FAF8F5] font-bold leading-[1.3] tracking-[0.03em]"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
            }}
          >
            这里安葬着 2,183 个
            <br />
            曾经被寄予厚望的项目。
          </h2>
          <p className="mt-4 text-[15px] text-[#FAF8F5]/70 max-w-md leading-[1.75] lg:ml-auto lg:text-right">
            每一条都由创始人亲笔下葬。
            <br />
            金额真实，时间真实，眼泪也是真实的。
          </p>
        </div>

        {/* Card grid */}
        <div className="failure-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {failureCases.map((item, i) => (
            <Link
              to={`/failures/${encodeURIComponent(item.name)}`}
              key={i}
              className="failure-card group block bg-[#16423C] border border-[rgba(250,246,241,0.15)] rounded-[20px] overflow-hidden transition-transform duration-500 hover:scale-[1.02]"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden m-3 rounded-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-5 pt-2">
                {/* Category tag */}
                <span className="inline-block px-2 py-0.5 text-[11px] text-[#8B6F47] bg-[#8B6F47]/20 rounded-full mb-2">
                  {item.category}
                </span>

                <h3
                  className="text-[22px] font-bold text-[#FAF8F5] mb-1"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {item.name}
                </h3>

                <p className="text-xs text-[#8B6F47] mb-3">
                  卒于 {item.deathDate}
                </p>

                <p className="text-sm text-[#FAF8F5]/80 italic line-clamp-3 leading-[1.75]">
                  {item.quote}
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs text-[#2C6E63] font-medium">
                  <span>查看全部</span>
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <Link
            to="/failures"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[rgba(250,246,241,0.3)] text-[#FAF8F5] rounded-full text-sm font-medium transition-all duration-300 hover:bg-[rgba(250,246,241,0.1)] group"
          >
            <span>查看全部 2,183 条失败墓志铭</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Data Insights Preview                                     */
/* ------------------------------------------------------------------ */

function DataInsightsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [barTriggered, setBarTriggered] = useState(false);
  const [mortalityTriggered, setMortalityTriggered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.data-header',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.data-header', start: 'top 80%' },
        }
      );

      ScrollTrigger.create({
        trigger: '.data-bars',
        start: 'top 80%',
        onEnter: () => setBarTriggered(true),
        once: true,
      });

      ScrollTrigger.create({
        trigger: '.data-mortality',
        start: 'top 85%',
        onEnter: () => setMortalityTriggered(true),
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#FAF8F5] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="data-header">
          <p className="text-xs font-medium text-[#2C6E63] tracking-[0.1em] uppercase">
            DATA INSIGHTS · 数据洞察
          </p>
          <h2
            className="mt-4 text-[#1A1A1A] font-bold leading-[1.3] tracking-[0.03em]"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
            }}
          >
            这些项目死了，
            <br />
            但它们留下的教训还活着。
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mt-10">
          {/* Left - Failure cause chart (60%) */}
          <div className="lg:col-span-3 data-bars space-y-4">
            {failureCauses.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span
                  className="text-sm text-[#6B6B6B] w-6"
                  style={{ fontFamily: '"Space Grotesk", monospace' }}
                >
                  {item.rank}
                </span>
                <span className="text-[15px] font-medium text-[#1A1A1A] w-28 shrink-0">
                  {item.cause}
                </span>
                <div className="flex-1 h-[10px] bg-[rgba(22,66,60,0.1)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: barTriggered ? `${item.percentage * 2.5}%` : '0%',
                      background: 'linear-gradient(90deg, #16423C, #4A9B8C)',
                      transitionDelay: `${i * 100}ms`,
                    }}
                  />
                </div>
                <span
                  className="text-lg font-bold text-[#2C6E63] w-12 text-right"
                  style={{ fontFamily: '"Space Grotesk", monospace' }}
                >
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>

          {/* Right - Industry mortality (40%) */}
          <div className="lg:col-span-2 data-mortality">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-6">死亡率最高的赛道</h3>
            <div className="flex items-end gap-3 h-48">
              {industryMortality.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span
                    className="text-sm font-bold"
                    style={{
                      fontFamily: '"Space Grotesk", monospace',
                      color: item.color,
                    }}
                  >
                    {mortalityTriggered ? `${item.rate}%` : '0%'}
                  </span>
                  <div className="w-full bg-[rgba(22,66,60,0.1)] rounded-t-lg relative overflow-hidden" style={{ height: '140px' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-1000 ease-out"
                      style={{
                        height: mortalityTriggered ? `${(item.rate / 100) * 140}px` : '0px',
                        backgroundColor: item.color,
                        transitionDelay: `${i * 80}ms`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#6B6B6B] text-center leading-tight">{item.industry}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Context text */}
        <p className="mt-8 text-sm text-[#6B6B6B] text-right leading-[1.75]">
          我们把 2,183 个失败故事的死因、烧钱金额、行业分布做了聚合分析。下面这些数据，可能会让你多睡3秒钟再决定要不要 quit。
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Community Voices                                          */
/* ------------------------------------------------------------------ */

function CommunitySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.community-header',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.community-header', start: 'top 80%' },
        }
      );

      gsap.fromTo(
        '.quote-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.quote-grid', start: 'top 85%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#16423C] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="community-header text-center">
          <p className="text-xs font-medium text-[#2C6E63] tracking-[0.1em] uppercase">
            社区在说什么
          </p>
          <h2
            className="mt-4 text-[#FAF8F5] font-bold leading-[1.3] tracking-[0.03em]"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
            }}
          >
            他们把不敢说的话，
            <br />
            都留在了这里。
          </h2>
        </div>

        {/* Quote grid */}
        <div className="quote-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {communityQuotes.map((quote, i) => (
            <div
              key={i}
              className="quote-card bg-[rgba(250,246,241,0.05)] border border-[rgba(250,246,241,0.1)] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#2C6E63] flex items-center justify-center text-[#FAF8F5] text-sm font-bold shrink-0">
                  {quote.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#FAF8F5]">{quote.name}</p>
                  <p className="text-xs text-[#FAF8F5]/50">{quote.role}</p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-[15px] text-[#FAF8F5]/80 leading-[1.75]">
                {quote.quote}
              </p>

              {/* Time */}
              <p className="mt-4 text-xs text-[#FAF8F5]/40">{quote.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Newsletter CTA                                            */
/* ------------------------------------------------------------------ */

function NewsletterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.newsletter-left',
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.newsletter-content', start: 'top 80%' },
        }
      );

      gsap.fromTo(
        '.newsletter-right',
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.newsletter-content', start: 'top 80%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#16423C] border-t border-[rgba(250,246,241,0.1)] py-20">
      <div className="newsletter-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left column - Illustration */}
          <div className="newsletter-left lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <img
              src="/newsletter-illustration.png"
              alt="Newsletter"
              className="w-48 h-auto"
            />
            <h3
              className="mt-6 text-[#FAF8F5] font-bold leading-[1.3]"
              style={{
                fontFamily: '"Noto Serif SC", serif',
                fontSize: 'clamp(24px, 2.5vw, 32px)',
              }}
            >
              失败不会
              <br />
              白白发生。
            </h3>
          </div>

          {/* Right column - Form */}
          <div className="newsletter-right lg:col-span-3">
            <h3
              className="text-[#FAF8F5] font-bold leading-[1.3]"
              style={{
                fontFamily: '"Noto Serif SC", serif',
                fontSize: 'clamp(28px, 3vw, 40px)',
              }}
            >
              把最痛的教训，
              <br />
              打包寄给你。
            </h3>

            <p className="mt-4 text-sm text-[#FAF8F5]/70 max-w-md leading-[1.75]">
              每周三早上，我们挑 3 个最扎心的失败故事、5 个野生点子，还有 1 张失败地图。
              <br />
              纯干货，随时退订。
            </p>

            {/* Form */}
            <form
              className="mt-8 flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                alert('感谢订阅！我们会把最痛的教训寄给你。');
                setEmail('');
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-[rgba(250,246,241,0.08)] border rounded-lg text-sm text-[#FAF8F5] placeholder-[#FAF8F5]/30 outline-none transition-all duration-300"
                style={{
                  borderColor: inputFocused ? '#C9A96E' : 'rgba(250,246,241,0.2)',
                  boxShadow: inputFocused ? '0 0 0 3px rgba(201,169,110,0.2)' : 'none',
                }}
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#FAF8F5] text-[#16423C] rounded-lg text-sm font-bold transition-all duration-300 hover:scale-[1.02] hover:bg-[#C9A96E] shrink-0"
              >
                让教训找到我 &rarr;
              </button>
            </form>

            <p className="mt-4 text-xs text-[#FAF8F5]/40">
              我们不会滥用你的邮箱。你的邮件地址和这里分享的失败一样，都会被妥善保管。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Home Page                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <StatsTickerSection />
      <IdeaWallSection />
      <FailureArchiveSection />
      <DataInsightsSection />
      <CommunitySection />
      <NewsletterSection />
    </div>
  );
}
