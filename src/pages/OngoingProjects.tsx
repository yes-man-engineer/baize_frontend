import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, AlertTriangle, Flame, Heart, MessageCircle } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface OngoingProject {
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
}

const CATEGORIES = ['全部', '社区团购', '开发者工具', '老年教育', '宠物服务', '线下消费', '农产品电商'];

const PROJECTS: OngoingProject[] = [
  { name: '邻里鲜', category: '社区团购', status: '死撑中', statusColor: '#D4A853', months: 8, burn: '¥45万', team: 3, description: '做了8个月社区团购，月入勉强覆盖成本。美团优选和多多买菜压价太狠，不知道还要不要继续。', struggle: '巨头补贴战，小玩家没有活路？', votes: 234, comments: 56 },
  { name: 'CodeBuddy', category: '开发者工具', status: '卡住了', statusColor: '#8B2942', months: 14, burn: '¥120万', team: 2, description: 'AI编程助手做了14个月，产品还行但获客成本极高。投资人催增长，不知道该加功能还是做营销。', struggle: '产品好但没人用，该烧钱获客还是再打磨？', votes: 412, comments: 89 },
  { name: '银发学社', category: '老年教育', status: '迷茫期', statusColor: '#4A9B8C', months: 5, burn: '¥18万', team: 4, description: '教老年人用智能手机，线下课反响很好但 scaling 困难。线上课老年人不会用，不知道方向在哪。', struggle: '线下好但做不大，线上老年人不会用，怎么破？', votes: 178, comments: 43 },
  { name: '宠物殡葬', category: '宠物服务', status: '死撑中', statusColor: '#D4A853', months: 11, burn: '¥35万', team: 2, description: '宠物善终服务，情感价值高但获客难。大部分养宠人还没接受这个理念，教育市场成本太高。', struggle: '市场教育成本太高，是该坚持等市场成熟还是转型？', votes: 356, comments: 71 },
  { name: '下班酒馆', category: '线下消费', status: '卡住了', statusColor: '#8B2942', months: 6, burn: '¥80万', team: 5, description: '写字楼附近的小酒馆，白天咖啡晚上酒。营业额一直上不去，周边竞争太激烈。合伙人想关店，我想再试试。', struggle: '合伙人要散伙，我该接盘独自扛还是及时止损？', votes: 567, comments: 134 },
  { name: '农产直送', category: '农产品电商', status: '迷茫期', statusColor: '#4A9B8C', months: 20, burn: '¥60万', team: 6, description: '从农户直接到消费者，模式跑通了但利润薄如纸。物流成本和损耗率居高不下，规模越大亏越多。', struggle: '模式通了但不赚钱，是该精细化运营还是放弃？', votes: 289, comments: 62 },
];

const STATUS_ICON: Record<string, typeof Flame> = { '死撑中': Flame, '卡住了': AlertTriangle, '迷茫期': Clock };

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OngoingProjects() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = useMemo(() => {
    let result = PROJECTS;
    if (activeCategory !== '全部') result = result.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  }, [activeCategory, searchQuery]);

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
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory + searchQuery} initial="hidden" animate="visible" exit="exit"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } }, exit: { opacity: 0, transition: { duration: 0.2 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((project, i) => {
                const StatusIcon = STATUS_ICON[project.status] || Clock;
                return (
                  <motion.div key={i} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } } }}
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
        </div>
      </section>
    </div>
  );
}
