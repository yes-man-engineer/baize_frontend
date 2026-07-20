import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Heart, Lightbulb, Share2, Trash2 } from 'lucide-react';
import { apiClient, type IdeaItem } from '../api/client';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay >= 7) return `${Math.floor(diffDay / 7)}周前`;
  if (diffDay >= 1) return `${diffDay}天前`;
  if (diffHour >= 1) return `${diffHour}小时前`;
  if (diffMin >= 1) return `${diffMin}分钟前`;
  return '刚刚';
}

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState<IdeaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!id || !window.confirm('确定要删除这个点子吗？此操作不可撤销。')) return;
    setDeleting(true);
    try {
      await apiClient.deleteIdea(id);
      window.location.href = '/ideas';
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiClient
      .ideaById(id)
      .then((data) => {
        if (cancelled) return;
        setIdea(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : '加载失败');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#FAF6F1] pt-32 pb-24 text-center">
        <p className="text-[#6B6B6B] text-base">加载中...</p>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-[100dvh] bg-[#FAF6F1] pt-32 pb-24 text-center">
        <p className="text-[#6B6B6B] text-base">{error || '点子不存在'}</p>
        <Link to="/ideas" className="mt-4 inline-flex items-center gap-1 text-sm text-[#2C6E63] hover:underline">
          <ArrowLeft size={14} /> 返回点子墙
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FAF6F1]">
      {/* Header */}
      <section className="pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <Link
              to="/ideas"
              className="inline-flex items-center gap-1 text-[13px] text-[#6B6B6B] hover:text-[#2C6E63] transition-colors mb-6"
            >
              <ArrowLeft size={14} /> 返回点子墙
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(44,110,99,0.15)] text-[#2C6E63]">
                {idea.category}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#D4A853]/15 text-[#8B6F47]">
                启动 ¥{idea.startup_cost}万
              </span>
            </div>

            <h1
              className="text-[#1A1A1A] leading-[1.3] tracking-[0.02em]"
              style={{
                fontFamily: '"Noto Serif SC", serif',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
              }}
            >
              {idea.title}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#6B6B6B]">
              <span>{idea.author || '匿名'}</span>
              <span className="text-[#6B6B6B]/40">·</span>
              <span>{formatRelativeTime(idea.created_at)}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: easeOutExpo }}
            className="bg-white border border-[rgba(22,66,60,0.08)] rounded-2xl p-6 sm:p-8"
          >
            {/* Image */}
            {idea.image && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <img src={idea.image} alt={idea.title} className="w-full h-auto object-cover" />
              </div>
            )}

            {/* Structured fields */}
            <div className="space-y-6">
              {idea.target_user && (
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] mb-2 flex items-center gap-2" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                    <span className="w-6 h-6 rounded-full bg-[#2C6E63]/10 text-[#2C6E63] flex items-center justify-center text-[11px]">1</span>
                    目标用户
                  </h3>
                  <p className="text-[15px] text-[#1A1A1A]/85 leading-[1.8] pl-8" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                    {idea.target_user}
                  </p>
                </div>
              )}

              {idea.description && (
                <>
                  {(idea.description.includes('\n\n') ? idea.description.split('\n\n') : [idea.description]).length > 1 ? (
                    <>
                      <div>
                        <h3 className="text-sm font-bold text-[#1A1A1A] mb-2 flex items-center gap-2" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                          <span className="w-6 h-6 rounded-full bg-[#2C6E63]/10 text-[#2C6E63] flex items-center justify-center text-[11px]">2</span>
                          一句话描述
                        </h3>
                        <p className="text-[15px] text-[#1A1A1A]/85 leading-[1.8] pl-8" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                          {idea.description.split('\n\n')[0]}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1A1A1A] mb-2 flex items-center gap-2" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                          <span className="w-6 h-6 rounded-full bg-[#2C6E63]/10 text-[#2C6E63] flex items-center justify-center text-[11px]">3</span>
                          详细描述
                        </h3>
                        <p className="text-[15px] text-[#1A1A1A]/85 leading-[1.8] whitespace-pre-wrap pl-8" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                          {idea.description.split('\n\n').slice(1).join('\n\n')}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1A1A] mb-2 flex items-center gap-2" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                        <span className="w-6 h-6 rounded-full bg-[#2C6E63]/10 text-[#2C6E63] flex items-center justify-center text-[11px]">2</span>
                        详细描述
                      </h3>
                      <p className="text-[15px] text-[#1A1A1A]/85 leading-[1.8] whitespace-pre-wrap pl-8" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                        {idea.description}
                      </p>
                    </div>
                  )}
                </>
              )}

              {idea.business_model && (
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] mb-2 flex items-center gap-2" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                    <span className="w-6 h-6 rounded-full bg-[#2C6E63]/10 text-[#2C6E63] flex items-center justify-center text-[11px]">{idea.description.includes('\n\n') ? '4' : '3'}</span>
                    商业模式
                  </h3>
                  <p className="text-[15px] text-[#1A1A1A]/85 leading-[1.8] pl-8" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                    {idea.business_model}
                  </p>
                </div>
              )}

              {idea.help_needed && (
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] mb-2 flex items-center gap-2" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                    <span className="w-6 h-6 rounded-full bg-[#2C6E63]/10 text-[#2C6E63] flex items-center justify-center text-[11px]">{idea.description.includes('\n\n') ? '5' : '4'}</span>
                    需要什么样的帮助
                  </h3>
                  <p className="text-[15px] text-[#1A1A1A]/85 leading-[1.8] pl-8" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                    {idea.help_needed}
                  </p>
                </div>
              )}
            </div>

            {/* Stats bar */}
            <div className="mt-8 pt-6 border-t border-[rgba(22,66,60,0.08)] flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#2C6E63] transition-colors">
                  <Heart size={16} />
                  <span>{idea.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#2C6E63] transition-colors">
                  <MessageCircle size={16} />
                  <span>{idea.comments}</span>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-1.5 text-[13px] text-[#8B2942] hover:text-[#6B1E2E] transition-colors disabled:opacity-40"
                >
                  <Trash2 size={14} />
                  {deleting ? '删除中…' : '删除'}
                </button>
                <button className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#2C6E63] transition-colors">
                  <Share2 size={14} />
                  分享
                </button>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
            className="mt-8 text-center"
          >
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C6E63] text-[#FAF6F1] rounded-full text-sm font-bold hover:scale-[1.02] transition-transform"
            >
              <Lightbulb size={15} />
              我也来分享一个点子
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
