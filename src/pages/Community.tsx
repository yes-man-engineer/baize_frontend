import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2, Clock } from 'lucide-react';

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
  images?: string[];
}

const CATEGORIES = ['全部', '感悟', '复盘', '求助', '经验分享', '数据讨论', '观点碰撞', '闲聊'];

const POSTS: Post[] = [
  { id: 1, title: 'AI 创业还有活路吗？看了数据之后我犹豫了', excerpt: '做了一年AI工具，月活从2万掉到3000。感觉大厂一进场就没小团队什么事了，有没有人还在坚持的？求真实经验分享。', author: '犹豫的极客', avatar: '/avatar-founder-1.jpg', category: '数据讨论', votes: 234, comments: 47, time: '2小时前' },
  { id: 2, title: '合伙人退出，我应该硬撑还是解散？', excerpt: '联合创始人上个月说 burnout 了，要退出。现在剩我一个人扛着5人团队，现金流只能撑3个月。真的很迷茫。', author: '孤军奋战', avatar: '/avatar-founder-2.jpg', category: '求助', votes: 189, comments: 32, time: '5小时前' },
  { id: 3, title: '分享我从 0 到 ¥50万 MRR 的真实路径', excerpt: 'SaaS做了18个月，终于摸到盈利门槛。想复盘一下最关键的几个决策和差点让我死掉的那几次。', author: 'SaaS老兵', avatar: '/avatar-founder-3.jpg', category: '经验分享', votes: 567, comments: 89, time: '1天前', images: ['/idea-saas.jpg'] },
  { id: 4, title: '为什么我觉得「先验证再开发」是废话？', excerpt: '理论都懂，但现实是等你验证完，窗口期早过了。有时候就是赌一把的事，评论区聊聊你们的看法？', author: '行动派', avatar: '/avatar-founder-1.jpg', category: '观点碰撞', votes: 312, comments: 56, time: '3小时前' },
  { id: 5, title: '第一次创业失败后的 100 天，我是怎么恢复的', excerpt: '公司关门的第100天，今天终于能睡个好觉了。复盘一下从崩溃到重建的过程，希望能帮到正在经历的人。', author: '凤凰涅槃', avatar: '/avatar-founder-2.jpg', category: '复盘', votes: 445, comments: 41, time: '2天前', images: ['/fail-morning-island.jpg'] },
  { id: 6, title: '有人愿意分享自己的「僵尸项目」吗？', excerpt: '就是那些不死不活、关又不甘心、继续又看不到希望的项目。我先来：一个做了两年的社区团购小程序。', author: 'zombie', avatar: '/avatar-founder-3.jpg', category: '闲聊', votes: 178, comments: 23, time: '6小时前' },
  { id: 7, title: '来这里之前我以为我的失败很丢人', excerpt: '看了200多个墓志铭之后我发现——原来我们死的方式都一样。那种释然感，是别的地方给不了的。', author: '林深见鹿', avatar: '/avatar-founder-1.jpg', category: '感悟', votes: 521, comments: 67, time: '1天前', images: ['/fail-meowspace.jpg'] },
  { id: 8, title: '产品下线的第十个夜晚，我哭着刷这里的帖子', excerpt: '比看任何创业书都有用。这里的真实感是别的地方给不了的。每一条墓志铭都是创业者的心路历程。', author: '一只野生PM', avatar: '/avatar-founder-2.jpg', category: '感悟', votes: 398, comments: 45, time: '3天前' },
  { id: 9, title: '把自己三年前死掉的项目写下来之后', excerpt: '我睡了三个月里的第一个安稳觉。原来写出来比憋在心里好受太多了。这个网站是有魔力的。', author: 'Kai老凯', avatar: '/avatar-founder-3.jpg', category: '复盘', votes: 612, comments: 78, time: '12小时前', images: ['/fail-meowspace.jpg', '/idea-saas.jpg'] },
  { id: 10, title: '还没毕业就失败了两次，但我还在', excerpt: '这里的每一条墓志铭都让我相信，失败不是终点，放弃学习才是。致敬每一个还在路上的创业者。', author: '纸飞机', avatar: '/avatar-founder-1.jpg', category: '感悟', votes: 267, comments: 34, time: '2天前' },
  { id: 11, title: '有人用「不做清单」做决策的吗？', excerpt: '整理了一份「坚决不做的业务清单」，发现比「要做的清单」更有用。分享一下我的方法论。', author: '减法主义', avatar: '/avatar-founder-2.jpg', category: '经验分享', votes: 156, comments: 28, time: '8小时前' },
  { id: 12, title: '投资人问我「如果Google做你怎么办」，我沉默了', excerpt: 'Pitch meeting 上被问到这个问题，当场语塞。回来想了三天，现在有了答案。分享一下我的思路。', author: 'pitching新手', avatar: '/avatar-founder-3.jpg', category: '求助', votes: 289, comments: 52, time: '1天前', images: ['/idea-ai-agent.jpg'] },
];

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

function PostCard({ post, index }: { post: typeof POSTS[0]; index: number }) {
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

  const filtered = activeCategory === '全部'
    ? POSTS
    : POSTS.filter(p => p.category === activeCategory);

  const sorted = sortBy === 'hot'
    ? [...filtered].sort((a, b) => b.votes - a.votes)
    : [...filtered].sort((a, b) => b.id - a.id);

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
      </section>
    </div>
  );
}
