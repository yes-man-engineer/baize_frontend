import { useRef, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const EASE_OUT_EXPO = 'power3.out';

/* ─────────────────────── mock data ─────────────────────── */

interface TimelineEntry {
  date: string;
  title: string;
  description: string;
}

interface DataCard {
  label: string;
  value: string;
  context: string;
}

interface Lesson {
  number: string;
  title: string;
  body: string;
}

interface RelatedStory {
  name: string;
  slug: string;
  deathDate: string;
  category: string;
  image: string;
}

const TIMELINE: TimelineEntry[] = [
  { date: '2022.05', title: '创立', description: '三个前同事裸辞，凑了200万启动资金。第一个办公室是深圳南山的一个共享空间角落。' },
  { date: '2022.07', title: '首轮融资', description: '拿到天使轮500万。投资人说我们「赶上了共享办公的风口」。那时候我们还不知道，风口上的猪摔下来会更疼。' },
  { date: '2022.11', title: '扩张', description: '从1个城市扩张到4个城市，团队从8人涨到23人。每个月的租金账单让我们开始失眠。' },
  { date: '2023.03', title: '危机初现', description: '入住率从85%跌到60%。我们开始做「创业活动」来吸引人流，但来的都是找免费咖啡的人。' },
  { date: '2023.07', title: '最后一搏', description: '砍掉3个城市，缩回深圳。创始人亲自做销售，一天打50个电话。成交了2个。' },
  { date: '2023.11', title: '关闭', description: '最后一个客户搬走的那个周末，三个人在办公室喝了一整夜的啤酒。第二天交了钥匙。' },
];

const HARD_DATA: DataCard[] = [
  { label: '总烧钱', value: '¥1,200万', context: '其中租金占62%，人力占28%，运营占10%' },
  { label: '最高月烧', value: '¥95万', context: '发生在2022年11月扩张期' },
  { label: '存活时长', value: '18个月', context: '比同行平均短6个月' },
  { label: '团队规模', value: '8 → 23 → 5', context: '扩张时最高23人，关闭前只剩5人' },
  { label: '入住率峰值', value: '85%', context: '2022年10月，此后持续下滑' },
  { label: '最终入住率', value: '23%', context: '2023年10月，不足以覆盖租金' },
];

const LESSONS: Lesson[] = [
  { number: '01', title: '空间不是产品，社区才是', body: '我们花了80%的精力装修和选址，只留了20%给社区运营。如果重来，我们会先做10场线下活动，验证人们是否真的愿意为这个圈子付费，再考虑租场地。' },
  { number: '02', title: '扩张是毒药，验证是解药', body: '从一个城市到四个城市只用了4个月。每个新城市的入住率都没超过50%。应该先在第一个城市做到90%入住率并保持6个月。' },
  { number: '03', title: '别为「风口」创业', body: '共享办公是2021年的风口，但我们2022年才入场。风口不等人，等的是那些被风吹起来的猪摔下来的时刻。' },
];

const RELATED: RelatedStory[] = [
  { name: '晨读岛', slug: 'morning-island', deathDate: '2023年8月', category: '在线教育', image: '/fail-morning-island.jpg' },
  { name: 'Fikaa 咖啡', slug: 'fikaa-coffee', deathDate: '2023年4月', category: '消费品', image: '/fail-fikaa-coffee.jpg' },
  { name: '鲜集', slug: 'xianji', deathDate: '2022年12月', category: '本地生活', image: '/fail-marketplace.jpg' },
];

const GALLERY_IMAGES = [
  { src: '/gallery-meowspace-1.jpg', caption: '最初的办公室，开业第一天' },
  { src: '/gallery-meowspace-2.jpg', caption: '最高峰时，23个人的团队' },
  { src: '/gallery-meowspace-3.jpg', caption: '最后一个工作日，空荡荡的工位' },
  { src: '/gallery-meowspace-4.jpg', caption: '创始人把钥匙交给物业的那天' },
];

/* ─────────────────────── sub-components ─────────────────────── */

function StoryHeader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT_EXPO } });
    tl.from('.fd-back-link', { opacity: 0, duration: 0.3 })
      .from('.fd-category', { y: 40, opacity: 0, duration: 0.8 }, 0.1)
      .from('.fd-company', { y: 40, opacity: 0, duration: 0.8 }, 0.15)
      .from('.fd-deathdate', { opacity: 0, duration: 0.4 }, 0.4)
      .from('.fd-stat', { opacity: 0, y: 20, stagger: 0.08, duration: 0.5 }, 0.6)
      .from('.fd-quote', { y: 20, opacity: 0, duration: 0.7 }, 0.8);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#16423C] pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/failures"
          className="fd-back-link inline-flex items-center gap-2 text-[#FAF6F1]/60 text-[13px] transition-opacity duration-300 hover:text-[#FAF6F1] mb-6"
        >
          <ArrowLeft size={14} />
          返回失败档案
        </Link>

        <div className="fd-category inline-block px-3 py-1 rounded-full text-xs text-[#FAF6F1] bg-[#8B6F47] mb-4">
          共享办公
        </div>

        <h1
          className="fd-company text-[#FAF6F1] mt-4 leading-tight"
          style={{
            fontFamily: '"Noto Serif SC", serif',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 900,
            letterSpacing: '0.04em',
          }}
        >
          Meowspace
        </h1>

        <p
          className="fd-deathdate mt-2 text-[#C9A96E]"
          style={{ fontFamily: '"Space Grotesk", monospace', fontSize: '14px' }}
        >
          卒于 2023年11月
        </p>

        <div className="fd-stats-row mt-6 flex flex-wrap gap-8">
          <span className="fd-stat text-[#FAF6F1]" style={{ fontFamily: '"Space Grotesk", monospace', fontSize: '14px', fontWeight: 500 }}>
            存活 18 个月
          </span>
          <span className="fd-stat text-[#C9A96E]" style={{ fontFamily: '"Space Grotesk", monospace', fontSize: '14px', fontWeight: 500 }}>
            烧掉 ¥1,200万
          </span>
          <span className="fd-stat text-[#FAF6F1]/70" style={{ fontFamily: '"Space Grotesk", monospace', fontSize: '14px', fontWeight: 500 }}>
            团队最高 23 人
          </span>
        </div>

        <blockquote
          className="fd-quote mt-8 max-w-2xl border-l-[3px] border-[#C9A96E] pl-6 text-[#FAF6F1]/85 leading-relaxed"
          style={{
            fontFamily: '"Noto Serif SC", serif',
            fontSize: 'clamp(18px, 2vw, 22px)',
            fontWeight: 700,
          }}
        >
          「那时候以为有了一个空间就有了生态，后来才发现，空间是最不值钱的。」
        </blockquote>
      </div>
    </div>
  );
}

function ImageGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.from('.fd-gallery-container', {
      opacity: 0,
      duration: 1,
      delay: 0.3,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    });
  }, { scope: sectionRef });

  const goNext = () => setActiveIndex((i) => (i + 1) % GALLERY_IMAGES.length);
  const goPrev = () => setActiveIndex((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen]);

  return (
    <>
      <div ref={sectionRef} className="bg-[#16423C] py-8">
        <div className="fd-gallery-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main gallery */}
          <div className="relative rounded-2xl overflow-hidden bg-[#16423C]/50" style={{ height: '60vh', minHeight: '400px' }}>
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-700 cursor-pointer"
                style={{ opacity: i === activeIndex ? 1 : 0 }}
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16423C]/80 via-transparent to-transparent" />
              </div>
            ))}

            {/* Caption */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <p className="text-[#FAF6F1] text-sm" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                {GALLERY_IMAGES[activeIndex].caption}
              </p>
              <span
                className="text-[#FAF6F1]/50 text-xs"
                style={{ fontFamily: '"Space Grotesk", monospace' }}
              >
                {activeIndex + 1} / {GALLERY_IMAGES.length}
              </span>
            </div>

            {/* Nav arrows */}
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF6F1]/10 backdrop-blur-sm flex items-center justify-center text-[#FAF6F1] transition-all duration-300 hover:bg-[#FAF6F1]/20 hover:scale-110"
              aria-label="上一张"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF6F1]/10 backdrop-blur-sm flex items-center justify-center text-[#FAF6F1] transition-all duration-300 hover:bg-[#FAF6F1]/20 hover:scale-110"
              aria-label="下一张"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {GALLERY_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === activeIndex ? '#C9A96E' : 'rgba(250,246,241,0.3)',
                    transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
                  }}
                  aria-label={`图片 ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="mt-4 flex gap-3 justify-center">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="relative rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  width: '80px',
                  height: '60px',
                  opacity: i === activeIndex ? 1 : 0.5,
                  outline: i === activeIndex ? '2px solid #C9A96E' : 'none',
                  outlineOffset: '2px',
                }}
              >
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-[#FAF6F1] transition-transform duration-300 hover:scale-125 z-10"
            onClick={() => setLightboxOpen(false)}
            aria-label="关闭"
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FAF6F1]/70 hover:text-[#FAF6F1] transition-colors"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="上一张"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-[#FAF6F1]/70 hover:text-[#FAF6F1] transition-colors"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="下一张"
          >
            <ChevronRight size={36} />
          </button>
          <img
            src={GALLERY_IMAGES[activeIndex].src}
            alt={GALLERY_IMAGES[activeIndex].caption}
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#FAF6F1]/70 text-sm">
            {GALLERY_IMAGES[activeIndex].caption}
          </p>
        </div>
      )}
    </>
  );
}

function StoryTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    });
    tl.from('.fd-timeline-left', { opacity: 0, x: -20, duration: 0.6 })
      .from('.fd-timeline-entry', {
        x: 30, opacity: 0, stagger: 0.1, duration: 0.6,
        ease: EASE_OUT_EXPO,
      }, 0.2);
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className="bg-[#FAF6F1] py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left sticky title */}
          <div className="fd-timeline-left lg:w-[30%] lg:sticky lg:top-24 lg:self-start">
            <h2
              className="text-[#1A1A1A]"
              style={{ fontFamily: '"Noto Serif SC", serif', fontSize: '28px', fontWeight: 700 }}
            >
              时间线
            </h2>
            <p className="mt-2 text-[#6B6B6B] text-sm" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
              从第一天到最后一天
            </p>
          </div>

          {/* Right timeline */}
          <div className="lg:w-[70%] relative">
            {/* Vertical line */}
            <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-[#2C6E63]" />

            <div className="flex flex-col gap-10">
              {TIMELINE.map((entry, i) => (
                <div key={i} className="fd-timeline-entry relative pl-8">
                  {/* Dot */}
                  <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-[#2C6E63] border-2 border-[#FAF6F1]" />

                  <span
                    className="text-[#2C6E63] text-[13px] font-medium"
                    style={{ fontFamily: '"Space Grotesk", monospace' }}
                  >
                    {entry.date}
                  </span>
                  <h3
                    className="mt-1 text-[#1A1A1A] text-base font-bold"
                    style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                  >
                    {entry.title}
                  </h3>
                  <p
                    className="mt-1 text-[#6B6B6B] text-sm leading-relaxed"
                    style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.7 }}
                  >
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HardDataSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.from('.fd-data-card', {
      y: 30, opacity: 0, stagger: 0.08, duration: 0.5,
      ease: EASE_OUT_EXPO,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    });
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className="bg-[#FAF6F1] py-16 border-t border-[rgba(22,66,60,0.1)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HARD_DATA.map((card, i) => (
            <div
              key={i}
              className="fd-data-card bg-[#F3EDE4] border border-[rgba(22,66,60,0.1)] rounded-2xl p-6 transition-shadow duration-300 hover:shadow-lg"
            >
              <p
                className="text-[#6B6B6B] uppercase tracking-widest text-xs font-medium"
                style={{ fontFamily: '"Noto Sans SC", sans-serif', letterSpacing: '0.08em' }}
              >
                {card.label}
              </p>
              <p
                className="mt-3 text-[#16423C]"
                style={{
                  fontFamily: '"Space Grotesk", monospace',
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  fontWeight: 700,
                }}
              >
                {card.value}
              </p>
              <p
                className="mt-2 text-[#6B6B6B] text-[13px] leading-relaxed"
                style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.6 }}
              >
                {card.context}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LessonsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    });
    tl.from('.fd-lessons-header', { y: 30, opacity: 0, duration: 0.7 })
      .from('.fd-lesson-item', {
        y: 20, opacity: 0, stagger: 0.15, duration: 0.5,
        ease: EASE_OUT_EXPO,
      }, 0.2);
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className="bg-[#16423C] py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="fd-lessons-header text-center">
          <p
            className="text-[#2C6E63] text-xs font-medium tracking-widest"
            style={{ fontFamily: '"Noto Sans SC", sans-serif', letterSpacing: '0.1em' }}
          >
            教训
          </p>
          <h2
            className="mt-4 text-[#FAF6F1]"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 700,
            }}
          >
            如果我们能重来
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-8">
          {LESSONS.map((lesson) => (
            <div key={lesson.number} className="fd-lesson-item flex gap-6">
              <span
                className="text-[#C9A96E]/50 shrink-0"
                style={{
                  fontFamily: '"Space Grotesk", monospace',
                  fontSize: '32px',
                  fontWeight: 700,
                  minWidth: '48px',
                }}
              >
                {lesson.number}
              </span>
              <div>
                <h3
                  className="text-[#FAF6F1] text-lg font-bold"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                >
                  {lesson.title}
                </h3>
                <p
                  className="mt-2 text-[#FAF6F1]/75 text-[15px] leading-relaxed"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.75 }}
                >
                  {lesson.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RelatedStories() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.from('.fd-related-card', {
      y: 40, opacity: 0, stagger: 0.1, duration: 0.6,
      ease: EASE_OUT_EXPO,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    });
    gsap.from('.fd-related-cta', {
      opacity: 0, duration: 0.5, delay: 0.4,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    });
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className="bg-[#FAF6F1] py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-[#1A1A1A] mb-8"
          style={{ fontFamily: '"Noto Serif SC", serif', fontSize: '22px', fontWeight: 700 }}
        >
          类似的墓志铭
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RELATED.map((story) => (
            <Link
              key={story.slug}
              to={`/failures/${story.slug}`}
              className="fd-related-card group block bg-[#16423C] rounded-[20px] border border-[rgba(250,246,241,0.15)] overflow-hidden transition-transform duration-500 hover:scale-[1.02]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="inline-block px-2 py-0.5 rounded-full text-[11px] bg-[#8B6F47] text-[#FAF6F1] mb-2">
                  {story.category}
                </span>
                <h3
                  className="text-[#FAF6F1] text-lg font-bold"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {story.name}
                </h3>
                <p
                  className="mt-1 text-[#8B6F47] text-xs"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                >
                  卒于 {story.deathDate}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Submit CTA */}
        <div className="fd-related-cta mt-16 text-center">
          <p
            className="text-[#1A1A1A] text-xl font-bold"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            你也有一段值得被记住的失败？
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#16423C] text-[#FAF6F1] text-[13px] font-bold rounded-full transition-transform duration-300 hover:scale-[1.02]"
          >
            写下我的墓志铭
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── main page ─────────────────────── */

export default function FailureDetail() {
  const { slug } = useParams<{ slug: string }>();

  // In a real app, we'd fetch data based on slug. Here we use mock data.
  void slug;

  return (
    <div className="min-h-[100dvh]">
      <StoryHeader />
      <ImageGallery />
      <StoryTimeline />
      <HardDataSection />
      <LessonsSection />
      <RelatedStories />
    </div>
  );
}
