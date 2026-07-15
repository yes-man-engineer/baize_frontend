import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2, Clock } from 'lucide-react';
import { apiClient } from '../api/client';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  avatar: string;
  category: string;
  votes: number;
  comments: number;
  time: string;
  createdAt: string;
  images?: string[];
}

const CATEGORIES = ['全部', '感悟', '复盘', '求助', '经验分享', '数据讨论', '观点碰撞', '闲聊'];

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return '刚刚';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}个月前`;
  const years = Math.floor(months / 12);
  return `${years}年前`;
}

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function VoteButtons({ votes }: { votes: number }) {
  const [count, setCount] = useState(votes);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const handleUp = () => { if (voted === 'up') { setCount(votes); setVoted(null); } else { setCount(votes + 1); setVoted('up'); } };
  const handleDown = () => { if (voted === 'down') { setCount(votes); setVoted(null); } else { setCount(votes - 1); setVoted('down'); } };

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button onClick={handleUp} className={`p-1 rounded transition-colors ${voted === 'up' ? 'text-[#D4A853]' : 'text-[#999999] hover:text-[#D4A853]'}`}>
        <ArrowBigUp size={20} strokeWidth={voted === 'up' ? 2.5 : 1.5} />
      </button>
      <span className={`text-sm font-bold tabular-nums min-w-[2ch] text-center ${voted === 'up' ? 'text-[#D4A853]' : voted === 'down' ? 'text-[#8B2942]' : 'text-[#666666]'}`}>
        {count}
      </span>
      <button onClick={handleDown} className={`p-1 rounded transition-colors ${voted === 'down' ? 'text-[#8B2942]' : 'text-[#999999] hover:text-[#8B2942]'}`}>
        <ArrowBigDown size={20} strokeWidth={voted === 'down' ? 2.5 : 1.5} />
      </button>
    </div>
  );
}

function ImageGrid({ images }: { images: string[] | undefined }) {
  if (!images || images.length === 0) return null;
  
  const count = images.length;
  let gridClass = '';
  if (count === 1) gridClass = 'grid-cols-1 max-w-[320px]';
  else if (count === 2) gridClass = 'grid-cols-2 max-w-[400px]';
  else gridClass = 'grid-cols-3 max-w-[480px]';

  return (
    <div className={`grid ${gridClass} gap-1 mt-3 rounded-xl overflow-hidden`}>
      {images.map((img, i) => (
        <div key={i} className={`relative ${count === 1 ? 'aspect-[16/10]' : 'aspect-square'} bg-[#F0EDE6]`}>
          <img src={img} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: easeOutExpo }}
      className="bg-white rounded-2xl border border-[rgba(13,31,21,0.06)] p-5 hover:shadow-md transition-shadow duration-300"
    >
      {/* Header: Avatar + Name + Meta */}
      <div className="flex items-center gap-3">
        <img src={post.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#141414]" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
              {post.author}
            </span>
            <span className="text-xs text-[#1A3D2E] bg-[#1A3D2E]/10 px-2 py-0.5 rounded-full">
              {post.category}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#999999] mt-0.5">
            <Clock size={11} />
            <span>{post.time}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3">
        <h3 className="text-[15px] font-bold text-[#141414] leading-snug" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
          {post.title}
        </h3>
        <p className="mt-1.5 text-[14px] text-[#666666] leading-relaxed" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
          {post.excerpt}
        </p>
      </div>

      {/* Images — 微博风格：正文下方 */}
      <ImageGrid images={post.images} />

      {/* Action Bar */}
      <div className="mt-4 pt-3 border-t border-[rgba(13,31,21,0.06)] flex items-center justify-between">
        <VoteButtons votes={post.votes} />
        <button className="flex items-center gap-1.5 text-[13px] text-[#999999] hover:text-[#1A3D2E] transition-colors">
          <MessageCircle size={16} />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 text-[13px] text-[#999999] hover:text-[#1A3D2E] transition-colors">
          <Share2 size={16} />
          <span>分享</span>
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Community() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [sortBy, setSortBy] = useState<'hot' | 'new'>('hot');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [ideasRes, failuresRes, ongoingRes, postsRes] = await Promise.all([
          apiClient.ideas(),
          apiClient.failures(),
          apiClient.ongoing(),
          apiClient.posts(),
        ]);
        if (cancelled) return;

        const normalized: Post[] = [
          ...(ideasRes.list || []).map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.description,
            author: item.author || '',
            avatar: '',
            category: item.category,
            votes: item.likes || 0,
            comments: item.comments || 0,
            time: timeAgo(item.created_at),
            createdAt: item.created_at,
            images: item.image ? [item.image] : undefined,
          })),
          ...(failuresRes.list || []).map(item => ({
            id: item.id + 1000000,
            title: item.title,
            excerpt: item.story,
            author: item.company_name || '',
            avatar: '',
            category: item.category,
            votes: item.likes || 0,
            comments: item.comments || 0,
            time: timeAgo(item.created_at),
            createdAt: item.created_at,
            images: undefined,
          })),
          ...(ongoingRes.list || []).map(item => ({
            id: item.id + 2000000,
            title: item.title,
            excerpt: item.description || item.struggle,
            author: '',
            avatar: '',
            category: item.category,
            votes: item.votes || 0,
            comments: item.comments || 0,
            time: timeAgo(item.created_at),
            createdAt: item.created_at,
            images: undefined,
          })),
          ...(postsRes.list || []).map(item => ({
            id: item.id + 3000000,
            title: item.title,
            excerpt: item.content,
            author: item.author || '',
            avatar: '',
            category: item.category,
            votes: (item.votes_up || 0) - (item.votes_down || 0),
            comments: item.comments || 0,
            time: timeAgo(item.created_at),
            createdAt: item.created_at,
            images: undefined,
          })),
        ];

        setPosts(normalized);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '加载失败');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = activeCategory === '全部'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const sorted = sortBy === 'hot'
    ? [...filtered].sort((a, b) => b.votes - a.votes)
    : [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5]">
      {/* Hero */}
      <section className="pt-28 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-medium tracking-[0.1em] text-[#1A3D2E] uppercase">
            社区 · COMMUNITY
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
            className="mt-3 text-[#141414] font-bold leading-[1.3] tracking-[0.03em]"
            style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            交流圈
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: easeOutExpo }}
            className="mt-3 text-base text-[#666666] max-w-lg leading-[1.75]">
            一个匿名说真话的地方。关于创业的恐惧、失败、顿悟和那些没人敢承认的念头。
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[rgba(13,31,21,0.08)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-[#1A3D2E] text-[#FAF8F5]' : 'text-[#666666] hover:bg-[#F0EDE6]'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setSortBy('hot')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${sortBy === 'hot' ? 'text-[#1A3D2E] bg-[#F0EDE6]' : 'text-[#999999]'}`}>最热</button>
              <button onClick={() => setSortBy('new')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${sortBy === 'new' ? 'text-[#1A3D2E] bg-[#F0EDE6]' : 'text-[#999999]'}`}>最新</button>
            </div>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        {loading && <div className="text-center py-24 text-[#666666]">加载中...</div>}
        {error && <div className="text-center py-24 text-[#8B2942]">{error}</div>}
        {!loading && !error && (
          <>
            <div className="flex flex-col gap-4">
              {sorted.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>

            {sorted.length === 0 && <div className="text-center py-24 text-[#666666]">没有找到匹配的内容</div>}

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/submit" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A3D2E] text-[#FAF8F5] rounded-full font-bold text-sm hover:bg-[#0D1F15] transition-colors">
                + 发布帖子
              </Link>
              <span className="text-xs text-[#999999]">所有投稿可选匿名 · 内容经审核后发布</span>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

