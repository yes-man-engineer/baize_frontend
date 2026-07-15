import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, AlertTriangle, Flame, Heart, MessageCircle } from 'lucide-react';
import { apiClient } from '../api/client';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface OngoingProject {
  id: number;
  name: string;
  category: string;
  status: string;
  statusColor: string;
  months: number;
  burn: string;
  team: number;
  description: string;
  struggle: string;
  votes: number;
  comments: number;
  createdAt?: string;
}

const CATEGORIES = ['全部', '社区团购', '开发者工具', '老年教育', '宠物服务', '线下消费', '农产品电商'];

const STATUS_COLOR_MAP: Record<string, string> = {
  '死撑中': '#D4A853',
  '卡住了': '#8B2942',
  '迷茫期': '#4A9B8C',
};

const STATUS_ICON: Record<string, typeof Flame> = { '死撑中': Flame, '卡住了': AlertTriangle, '迷茫期': Clock };

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OngoingProjects() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [projects, setProjects] = useState<OngoingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiClient.ongoing()
      .then(data => {
        if (cancelled) return;
        const mapped = data.list.map(item => ({
          id: item.id,
          name: item.title,
          category: item.category,
          status: item.status,
          statusColor: STATUS_COLOR_MAP[item.status] || '#4A9B8C',
          months: item.months,
          burn: item.burn,
          team: item.team_size,
          description: item.description,
          struggle: item.struggle,
          votes: item.votes,
          comments: item.comments,
          createdAt: item.created_at,
        }));
        setProjects(mapped);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : '加载失败');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let result = projects;
    if (activeCategory !== '全部') result = result.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  }, [activeCategory, searchQuery, projects]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5]">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-medium tracking-[0.1em] text-[#1A3D2E] uppercase">
            在途项目
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
            className="mt-3 text-[#141414] leading-[1.3] tracking-[0.03em]" style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700 }}>
            不死不活的项目，
            <br />才是创业的真实状态。
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: easeOutExpo }}
            className="mt-4 text-base text-[#666666] max-w-lg leading-[1.75]">
            这里记录那些还在路上、卡在半路、或者正在死撑的项目。没有结局，只有过程和纠结。
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-40 bg-[#FAF8F5] border-b border-[rgba(13,31,21,0.08)] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-md w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input type="text" placeholder="搜索在途项目..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setVisibleCount(6); }}
                className="w-full bg-[#F0EDE6] border border-[rgba(13,31,21,0.1)] rounded-full pl-10 pr-5 py-2.5 text-sm text-[#141414] placeholder:text-[#666666]/60 outline-none focus:border-[#1A3D2E]" />
            </div>
            <Link to="/submit" className="inline-flex items-center px-5 py-2.5 bg-[#1A3D2E] text-[#FAF8F5] text-[13px] font-bold rounded-full hover:scale-[1.02] transition-transform whitespace-nowrap">
              + 我的项目也在死撑
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${activeCategory === cat ? 'bg-[#1A3D2E] text-[#FAF8F5]' : 'text-[#666666] border border-[rgba(13,31,21,0.1)] hover:border-[#1A3D2E]'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="text-center py-24 text-[#666666]">
              <div className="inline-block w-6 h-6 border-2 border-[#1A3D2E] border-t-transparent rounded-full animate-spin mb-3" />
              <p>加载中...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-24 text-[#8B2942]">
              <p>加载失败: {error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#1A3D2E] text-[#FAF8F5] rounded-full text-sm hover:opacity-90 transition-opacity">重试</button>
            </div>
          )}
          {!loading && !error && (
            <>
              <AnimatePresence mode="wait">
                <motion.div key={activeCategory + searchQuery} initial="hidden" animate="visible" exit="exit"
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } }, exit: { opacity: 0, transition: { duration: 0.2 } } }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visible.map((project) => {
                    const StatusIcon = STATUS_ICON[project.status] || Clock;
                    return (
                      <motion.div key={project.id} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } } }}
                        className="group bg-white border border-[rgba(13,31,21,0.06)] rounded-[20px] p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="text-xs text-[#666666] bg-[#F0EDE6] px-2 py-0.5 rounded-full">{project.category}</span>
                            <h3 className="text-xl font-bold text-[#141414] mt-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>{project.name}</h3>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${project.statusColor}15`, color: project.statusColor }}>
                            <StatusIcon size={12} /><span>{project.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#666666] mb-3 pb-3 border-b border-[rgba(13,31,21,0.06)]">
                          <span>{project.months}个月</span><span>烧钱{project.burn}</span><span>{project.team}人团队</span>
                        </div>
                        <p className="text-sm text-[#141414]/70 leading-relaxed mb-3 flex-1">{project.description}</p>
                        <div className="bg-[#F0EDE6] rounded-xl p-3 mb-4">
                          <p className="text-xs text-[#666666] mb-1">核心纠结</p>
                          <p className="text-sm text-[#1A3D2E] font-medium">「{project.struggle}」</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-[#666666]">
                            <span className="flex items-center gap-1"><Heart size={12} />{project.votes} 撑TA</span>
                            <span className="flex items-center gap-1"><MessageCircle size={12} />{project.comments} 建议</span>
                          </div>
                          <button className="text-xs text-[#1A3D2E] font-medium hover:underline">给建议</button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {visible.length === 0 && <div className="text-center py-24 text-[#666666]">没有找到匹配的项目</div>}
              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button onClick={() => setVisibleCount(c => c + 6)} className="inline-flex items-center gap-2 px-8 py-3 border border-[#1A3D2E] text-[#1A3D2E] rounded-full text-sm font-medium hover:bg-[#1A3D2E] hover:text-[#FAF8F5] transition-all">
                    加载更多
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
