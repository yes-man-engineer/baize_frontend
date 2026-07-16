import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Lightbulb, ScrollText, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/client';

/* ---------- easing ---------- */
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ---------- options ---------- */
const industries = ['AI / 人工智能', 'SaaS / 企业服务', '电商 / 零售', '教育 / EdTech', '医疗 / HealthTech', '金融科技 / FinTech', '社交 / 社区', '游戏 / 娱乐', '硬件 / IoT', '其他'];

const survivalTimes = ['不到 6 个月', '6 个月 - 1 年', '1 - 2 年', '2 - 3 年', '3 年以上'];

const teamSizes = ['1-2 人', '3-5 人', '6-10 人', '11-30 人', '30 人以上'];

/* 选项文案 → 后端数值字段的代表值 */
const survivalTimeMonths: Record<string, number> = {
  '不到 6 个月': 4, '6 个月 - 1 年': 9, '1 - 2 年': 18, '2 - 3 年': 30, '3 年以上': 42,
};
const teamSizeCount: Record<string, number> = {
  '1-2 人': 2, '3-5 人': 4, '6-10 人': 8, '11-30 人': 20, '30 人以上': 30,
};

/* ---------- types ---------- */
type SubmissionMode = 'idea' | 'failure';

/* ---------- accordion data ---------- */
const guidelines = [
  {
    q: '什么样的点子会被接受？',
    a: '任何原创的创业想法都可以。不需要完整的商业计划，甚至不需要想好怎么赚钱。我们欢迎半成品、疯狂的想法、和「不知道可不可行」的探索。唯一的要求是：这个想法必须是你自己的。',
  },
  {
    q: '写墓志铭需要透露真实身份吗？',
    a: '不需要。所有失败故事的投稿都默认匿名。如果你愿意透露身份（比如希望有人联系你），可以在昵称栏填写真实信息。我们会对敏感的商业数据做脱敏处理。',
  },
  {
    q: '审核需要多久？',
    a: '通常在 24-48 小时内完成审核。我们审核的主要目的是确保内容真实、尊重他人、不包含敏感商业机密。不会因为「想法不成熟」或「失败原因太常见」而拒绝。',
  },
  {
    q: '我的数据会被怎样使用？',
    a: '你的投稿内容会显示在网站上供社区浏览。如果选择匿名，我们不会公开你的任何身份信息。数据洞察报告中使用的所有数据都会经过聚合和脱敏处理，不会关联到个人。',
  },
];

/* ---------- components ---------- */
function AccordionItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-[rgba(22,66,60,0.1)]">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-4 text-left transition-colors"
      >
        <span className="text-base font-medium text-[#1A1A1A]" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 text-[#6B6B6B]"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p
              className="pb-4 text-sm text-[#6B6B6B] leading-relaxed"
              style={{ fontFamily: '"Noto Sans SC", sans-serif', lineHeight: 1.75 }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- field components ---------- */
function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-[#1A1A1A] mb-2" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
      {children}
      {required && <span className="text-[#8B2942] ml-0.5">*</span>}
    </label>
  );
}

function TextInput({ placeholder, required: _required = false, value, onChange }: { placeholder?: string; required?: boolean; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#FAF6F1] border border-[rgba(22,66,60,0.1)] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B]/50 outline-none transition-all focus:border-[#2C6E63] focus:shadow-[0_0_0_3px_rgba(44,110,99,0.15)]"
      style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
    />
  );
}

function TextArea({ placeholder, rows = 3, required: _required = false, value, onChange }: { placeholder?: string; rows?: number; required?: boolean; value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-[#FAF6F1] border border-[rgba(22,66,60,0.1)] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B]/50 outline-none transition-all focus:border-[#2C6E63] focus:shadow-[0_0_0_3px_rgba(44,110,99,0.15)] resize-vertical min-h-[100px]"
      style={{ fontFamily: '"Noto Sans SC", sans-serif', resize: 'vertical' }}
    />
  );
}

function SelectField({ options, placeholder, required: _required = false, value, onChange }: { options: string[]; placeholder?: string; required?: boolean; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#FAF6F1] border border-[rgba(22,66,60,0.1)] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all focus:border-[#2C6E63] focus:shadow-[0_0_0_3px_rgba(44,110,99,0.15)] appearance-none cursor-pointer"
        style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
      >
        <option value="">{placeholder || '请选择'}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none" />
    </div>
  );
}

/* ---------- form state types ---------- */
interface IdeaForm {
  title: string;
  industry: string;
  targetUser: string;
  oneLiner: string;
  detail: string;
  businessModel: string;
  helpNeeded: string;
  nickname: string;
  anonymous: boolean;
  agreed: boolean;
}

interface FailureForm {
  projectName: string;
  industry: string;
  survivalTime: string;
  burnedMoney: string;
  teamSize: string;
  projectIntro: string;
  failureStory: string;
  topLesson: string;
  biggestExpense: string;
  wouldDoDifferent: string;
  advice: string;
  nickname: string;
  anonymous: boolean;
  agreed: boolean;
}

const defaultIdea: IdeaForm = {
  title: '', industry: '', targetUser: '', oneLiner: '', detail: '', businessModel: '', helpNeeded: '', nickname: '', anonymous: false, agreed: false,
};

const defaultFailure: FailureForm = {
  projectName: '', industry: '', survivalTime: '', burnedMoney: '', teamSize: '', projectIntro: '', failureStory: '', topLesson: '', biggestExpense: '', wouldDoDifferent: '', advice: '', nickname: '', anonymous: true, agreed: false,
};

/* ---------- main page ---------- */
export default function Submit() {
  const [mode, setMode] = useState<SubmissionMode>('idea');
  const [step, setStep] = useState(1);
  const [ideaForm, setIdeaForm] = useState<IdeaForm>(defaultIdea);
  const [failureForm, setFailureForm] = useState<FailureForm>(defaultFailure);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = mode === 'idea' ? 3 : 4;

  function switchMode(newMode: SubmissionMode) {
    setMode(newMode);
    setStep(1);
    setErrors({});
    setSubmitted(false);
  }

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};
    if (mode === 'idea') {
      if (step === 1) {
        if (!ideaForm.title.trim()) newErrors.title = '请输入点子标题';
        if (!ideaForm.industry) newErrors.industry = '请选择所属行业';
        if (!ideaForm.targetUser.trim()) newErrors.targetUser = '请输入目标用户';
        if (!ideaForm.oneLiner.trim()) newErrors.oneLiner = '请输入描述';
      }
      if (step === 3 && !ideaForm.agreed) newErrors.agreed = '请确认原创声明';
    } else {
      if (step === 1) {
        if (!failureForm.projectName.trim()) newErrors.projectName = '请输入项目名称';
        if (!failureForm.industry) newErrors.industry = '请选择所属行业';
        if (!failureForm.survivalTime) newErrors.survivalTime = '请选择存活时间';
      }
      if (step === 2) {
        if (!failureForm.projectIntro.trim()) newErrors.projectIntro = '请输入项目简介';
        if (!failureForm.failureStory.trim()) newErrors.failureStory = '请输入失败经过';
        if (!failureForm.topLesson.trim()) newErrors.topLesson = '请输入最痛的教训';
      }
      if (step === 4 && !failureForm.agreed) newErrors.agreed = '请确认声明';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function nextStep() {
    if (validateStep() && step < totalSteps) setStep(step + 1);
  }

  function prevStep() {
    if (step > 1) setStep(step - 1);
  }

  async function handleSubmit() {
    if (!validateStep() || submitting) return;
    setSubmitting(true);
    try {
      if (mode === 'idea') {
        const f = ideaForm;
        const extras = [
          f.targetUser.trim() && `目标用户：${f.targetUser.trim()}`,
          f.businessModel.trim() && `商业模式：${f.businessModel.trim()}`,
          f.helpNeeded.trim() && `需要的帮助：${f.helpNeeded.trim()}`,
        ].filter(Boolean);
        await apiClient.createIdea({
          title: f.title.trim(),
          category: f.industry,
          description: [f.oneLiner.trim(), f.detail.trim(), extras.join('\n')].filter(Boolean).join('\n\n'),
          author: f.anonymous ? '匿名用户' : f.nickname.trim() || '匿名用户',
        });
      } else {
        const f = failureForm;
        const extras = [
          f.biggestExpense.trim() && `最大的开销：${f.biggestExpense.trim()}`,
          f.wouldDoDifferent.trim() && `如果重来：${f.wouldDoDifferent.trim()}`,
          f.advice.trim() && `给后来者的建议：${f.advice.trim()}`,
        ].filter(Boolean);
        await apiClient.createFailure({
          title: f.projectName.trim(),
          company_name: f.projectName.trim(),
          category: f.industry,
          story: [f.projectIntro.trim(), f.failureStory.trim(), extras.join('\n')].filter(Boolean).join('\n\n'),
          lesson: f.topLesson.trim(),
          money_burned: f.burnedMoney.trim(),
          team_size: teamSizeCount[f.teamSize] ?? 0,
          lifespan: survivalTimeMonths[f.survivalTime] ?? 0,
        });
      }
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : '提交失败，请稍后重试' });
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------- success state ---------- */
  if (submitted) {
    return (
      <div className="min-h-[100dvh] bg-[#FAF6F1] pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="max-w-xl mx-auto px-4 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#6A9E4F]/15 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-[#6A9E4F]" />
          </div>
          <h2
            className="text-[clamp(24px,3vw,36px)] font-bold text-[#1A1A1A] tracking-wide"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            {mode === 'idea' ? '你的点子已经上墙了！' : '墓志铭已撰写完成'}
          </h2>
          <p
            className="mt-4 text-base text-[#6B6B6B] leading-relaxed"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            {mode === 'idea'
              ? '感谢你的分享！审核通过后，你的点子将出现在点子墙上，供所有人浏览和讨论。'
              : '感谢你敢于直面失败。这段经历将成为后来者最珍贵的路标。审核通过后正式发布。'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setIdeaForm(defaultIdea);
                setFailureForm(defaultFailure);
                setStep(1);
              }}
              className="px-6 py-3 bg-[#2C6E63] text-[#FAF6F1] text-sm font-bold rounded-full transition-all hover:scale-[1.02]"
            >
              {mode === 'idea' ? '再分享一个点子' : '再写一篇墓志铭'}
            </button>
            <a href="/" className="px-6 py-3 border border-[rgba(22,66,60,0.15)] text-[#1A1A1A] text-sm font-medium rounded-full transition-all hover:border-[#2C6E63]">
              回首页
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FAF6F1]">
      {/* ========== Hero ========== */}
      <section className="pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-medium tracking-[0.1em] text-[#2C6E63]"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            分享
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
            className="mt-3 text-[clamp(28px,3.5vw,44px)] font-bold text-[#1A1A1A] tracking-wide"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            你的故事，值得被记住。
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOutExpo }}
            className="mt-4 text-base text-[#6B6B6B] max-w-lg leading-relaxed"
            style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
          >
            无论是脑子里冒出的一个疯狂想法，还是一段不愿再提起的失败经历。写下来，让下一个人少走弯路。
          </motion.p>
        </div>
      </section>

      {/* ========== Form ========== */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* --- Left Sidebar --- */}
            <motion.aside
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/4"
            >
              <div className="lg:sticky lg:top-24 bg-[#F3EDE4] border border-[rgba(22,66,60,0.1)] rounded-2xl p-6">
                {/* Mode toggle */}
                <div className="flex rounded-lg overflow-hidden">
                  <button
                    onClick={() => switchMode('idea')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold transition-all ${
                      mode === 'idea'
                        ? 'bg-[#2C6E63] text-[#FAF6F1]'
                        : 'bg-transparent text-[#6B6B6B] hover:text-[#1A1A1A]'
                    }`}
                    style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                  >
                    <Lightbulb size={15} />
                    分享点子
                  </button>
                  <button
                    onClick={() => switchMode('failure')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold transition-all ${
                      mode === 'failure'
                        ? 'bg-[#16423C] text-[#FAF6F1]'
                        : 'bg-transparent text-[#6B6B6B] hover:text-[#1A1A1A]'
                    }`}
                    style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                  >
                    <ScrollText size={15} />
                    写下墓志铭
                  </button>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <p className="text-xs text-[#6B6B6B] mb-3" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                    步骤 {step} / {totalSteps}
                  </p>
                  <div className="w-full h-1 bg-[rgba(22,66,60,0.1)] rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${(step / totalSteps) * 100}%` }}
                      transition={{ duration: 0.4, ease: easeOutExpo }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: mode === 'idea' ? '#2C6E63' : '#16423C' }}
                    />
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    {(mode === 'idea'
                      ? ['基本信息', '点子详情', '提交']
                      : ['基本信息', '故事详情', '数据回顾', '教训总结']
                    ).map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          i + 1 < step
                            ? 'bg-[#2C6E63] text-[#FAF6F1]'
                            : i + 1 === step
                            ? 'border-2 border-[#2C6E63] text-[#2C6E63]'
                            : 'border-2 border-[rgba(22,66,60,0.15)] text-[#6B6B6B]'
                        }`}>
                          {i + 1 < step ? <Check size={10} /> : i + 1}
                        </span>
                        <span
                          className={`text-xs ${
                            i + 1 === step ? 'text-[#1A1A1A] font-medium' : 'text-[#6B6B6B]'
                          }`}
                          style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                        >
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* --- Right Form --- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
              className="lg:w-3/4"
            >
              <div className="bg-[#F3EDE4] border border-[rgba(22,66,60,0.1)] rounded-2xl p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {/* ====== IDEA FORM ====== */}
                  {mode === 'idea' && (
                    <motion.div
                      key={`idea-${step}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Step 1 */}
                      {step === 1 && (
                        <div className="space-y-5">
                          <h3 className="text-lg font-bold text-[#1A1A1A] mb-6" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                            基本信息
                          </h3>
                          <div>
                            <FieldLabel required>点子标题</FieldLabel>
                            <TextInput
                              placeholder="一句话概括你的想法"
                              required
                              value={ideaForm.title}
                              onChange={(v) => setIdeaForm({ ...ideaForm, title: v })}
                            />
                            {errors.title && <p className="mt-1 text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.title}</p>}
                          </div>
                          <div>
                            <FieldLabel required>所属行业</FieldLabel>
                            <SelectField
                              options={industries}
                              placeholder="选择最接近的行业"
                              required
                              value={ideaForm.industry}
                              onChange={(v) => setIdeaForm({ ...ideaForm, industry: v })}
                            />
                            {errors.industry && <p className="mt-1 text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.industry}</p>}
                          </div>
                          <div>
                            <FieldLabel required>目标用户</FieldLabel>
                            <TextInput
                              placeholder="你解决这个问题是为了谁？"
                              required
                              value={ideaForm.targetUser}
                              onChange={(v) => setIdeaForm({ ...ideaForm, targetUser: v })}
                            />
                            {errors.targetUser && <p className="mt-1 text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.targetUser}</p>}
                          </div>
                          <div>
                            <FieldLabel required>一句话描述</FieldLabel>
                            <TextArea
                              placeholder="用一段话描述你的点子在解决什么问题"
                              rows={3}
                              required
                              value={ideaForm.oneLiner}
                              onChange={(v) => setIdeaForm({ ...ideaForm, oneLiner: v })}
                            />
                            {errors.oneLiner && <p className="mt-1 text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.oneLiner}</p>}
                          </div>
                        </div>
                      )}

                      {/* Step 2 */}
                      {step === 2 && (
                        <div className="space-y-5">
                          <h3 className="text-lg font-bold text-[#1A1A1A] mb-6" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                            点子详情
                          </h3>
                          <div>
                            <FieldLabel>详细描述</FieldLabel>
                            <TextArea
                              placeholder="详细展开你的想法：问题有多大？现有方案有什么不足？你的方案有什么独特之处？"
                              rows={6}
                              value={ideaForm.detail}
                              onChange={(v) => setIdeaForm({ ...ideaForm, detail: v })}
                            />
                          </div>
                          <div>
                            <FieldLabel>商业模式</FieldLabel>
                            <TextArea
                              placeholder="你打算怎么赚钱？（如果你还没想好，就写「还没想好」）"
                              rows={3}
                              value={ideaForm.businessModel}
                              onChange={(v) => setIdeaForm({ ...ideaForm, businessModel: v })}
                            />
                          </div>
                          <div>
                            <FieldLabel>需要什么样的帮助</FieldLabel>
                            <TextArea
                              placeholder="技术合伙人？市场调研？还是只需要有人告诉你「这个想法不行」？"
                              rows={3}
                              value={ideaForm.helpNeeded}
                              onChange={(v) => setIdeaForm({ ...ideaForm, helpNeeded: v })}
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 3 */}
                      {step === 3 && (
                        <div className="space-y-5">
                          <h3 className="text-lg font-bold text-[#1A1A1A] mb-6" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                            提交
                          </h3>
                          <div>
                            <FieldLabel>昵称</FieldLabel>
                            <TextInput
                              placeholder="你的昵称（可选）"
                              value={ideaForm.nickname}
                              onChange={(v) => setIdeaForm({ ...ideaForm, nickname: v })}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="idea-anon"
                              checked={ideaForm.anonymous}
                              onChange={(e) => setIdeaForm({ ...ideaForm, anonymous: e.target.checked })}
                              className="w-4 h-4 rounded border-[rgba(22,66,60,0.2)] text-[#2C6E63] accent-[#2C6E63]"
                            />
                            <label htmlFor="idea-anon" className="text-[13px] text-[#6B6B6B]" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                              匿名发布
                            </label>
                          </div>
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id="idea-agree"
                              checked={ideaForm.agreed}
                              onChange={(e) => setIdeaForm({ ...ideaForm, agreed: e.target.checked })}
                              className="w-4 h-4 mt-0.5 rounded border-[rgba(22,66,60,0.2)] accent-[#2C6E63]"
                            />
                            <label htmlFor="idea-agree" className="text-xs text-[#6B6B6B] leading-relaxed" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                              我确认这个想法是我原创的，或者我有权利分享它。
                            </label>
                          </div>
                          {errors.agreed && <p className="text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.agreed}</p>}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ====== FAILURE FORM ====== */}
                  {mode === 'failure' && (
                    <motion.div
                      key={`failure-${step}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Step 1 */}
                      {step === 1 && (
                        <div className="space-y-5">
                          <h3 className="text-lg font-bold text-[#1A1A1A] mb-6" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                            基本信息
                          </h3>
                          <div>
                            <FieldLabel required>项目名称</FieldLabel>
                            <TextInput
                              placeholder="你的项目叫什么名字？"
                              required
                              value={failureForm.projectName}
                              onChange={(v) => setFailureForm({ ...failureForm, projectName: v })}
                            />
                            {errors.projectName && <p className="mt-1 text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.projectName}</p>}
                          </div>
                          <div>
                            <FieldLabel required>所属行业</FieldLabel>
                            <SelectField
                              options={industries}
                              placeholder="选择项目所在的行业"
                              required
                              value={failureForm.industry}
                              onChange={(v) => setFailureForm({ ...failureForm, industry: v })}
                            />
                            {errors.industry && <p className="mt-1 text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.industry}</p>}
                          </div>
                          <div>
                            <FieldLabel required>存活时间</FieldLabel>
                            <SelectField
                              options={survivalTimes}
                              placeholder="从创立到关闭大约多久？"
                              required
                              value={failureForm.survivalTime}
                              onChange={(v) => setFailureForm({ ...failureForm, survivalTime: v })}
                            />
                            {errors.survivalTime && <p className="mt-1 text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.survivalTime}</p>}
                          </div>
                          <div>
                            <FieldLabel>烧掉的总金额</FieldLabel>
                            <TextInput
                              placeholder="大概烧了多少？（可以写范围，如「100-200万」）"
                              value={failureForm.burnedMoney}
                              onChange={(v) => setFailureForm({ ...failureForm, burnedMoney: v })}
                            />
                          </div>
                          <div>
                            <FieldLabel>团队规模</FieldLabel>
                            <SelectField
                              options={teamSizes}
                              placeholder="团队最多时有多少人？"
                              value={failureForm.teamSize}
                              onChange={(v) => setFailureForm({ ...failureForm, teamSize: v })}
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 2 */}
                      {step === 2 && (
                        <div className="space-y-5">
                          <h3 className="text-lg font-bold text-[#1A1A1A] mb-6" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                            故事详情
                          </h3>
                          <div>
                            <FieldLabel required>项目简介</FieldLabel>
                            <TextArea
                              placeholder="用一段话介绍这个项目是做什么的"
                              rows={3}
                              required
                              value={failureForm.projectIntro}
                              onChange={(v) => setFailureForm({ ...failureForm, projectIntro: v })}
                            />
                            {errors.projectIntro && <p className="mt-1 text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.projectIntro}</p>}
                          </div>
                          <div>
                            <FieldLabel required>失败经过</FieldLabel>
                            <TextArea
                              placeholder="详细描述项目从创立到关闭的全过程。不要省略细节——那些你觉得「丢人」的部分往往是最有价值的。"
                              rows={8}
                              required
                              value={failureForm.failureStory}
                              onChange={(v) => setFailureForm({ ...failureForm, failureStory: v })}
                            />
                            {errors.failureStory && <p className="mt-1 text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.failureStory}</p>}
                          </div>
                          <div>
                            <FieldLabel required>最痛的一课</FieldLabel>
                            <TextArea
                              placeholder="如果只能带走一条教训，会是什么？"
                              rows={4}
                              required
                              value={failureForm.topLesson}
                              onChange={(v) => setFailureForm({ ...failureForm, topLesson: v })}
                            />
                            {errors.topLesson && <p className="mt-1 text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.topLesson}</p>}
                          </div>
                        </div>
                      )}

                      {/* Step 3 */}
                      {step === 3 && (
                        <div className="space-y-5">
                          <h3 className="text-lg font-bold text-[#1A1A1A] mb-6" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                            数据回顾
                          </h3>
                          <div>
                            <FieldLabel>最大的一笔开销</FieldLabel>
                            <TextInput
                              placeholder="哪笔钱花得最不值？"
                              value={failureForm.biggestExpense}
                              onChange={(v) => setFailureForm({ ...failureForm, biggestExpense: v })}
                            />
                          </div>
                          <div>
                            <FieldLabel>如果重来会怎么做</FieldLabel>
                            <TextArea
                              placeholder="假设时光倒流，你会在哪个节点做出不同的选择？"
                              rows={4}
                              value={failureForm.wouldDoDifferent}
                              onChange={(v) => setFailureForm({ ...failureForm, wouldDoDifferent: v })}
                            />
                          </div>
                          <div>
                            <FieldLabel>给后来者的建议</FieldLabel>
                            <TextArea
                              placeholder="对一个正在考虑进入这个行业的人说一句话"
                              rows={4}
                              value={failureForm.advice}
                              onChange={(v) => setFailureForm({ ...failureForm, advice: v })}
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 4 */}
                      {step === 4 && (
                        <div className="space-y-5">
                          <h3 className="text-lg font-bold text-[#1A1A1A] mb-6" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                            教训总结
                          </h3>
                          <div>
                            <FieldLabel>昵称</FieldLabel>
                            <TextInput
                              placeholder="你的昵称（可选，支持匿名）"
                              value={failureForm.nickname}
                              onChange={(v) => setFailureForm({ ...failureForm, nickname: v })}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="fail-anon"
                              checked={failureForm.anonymous}
                              onChange={(e) => setFailureForm({ ...failureForm, anonymous: e.target.checked })}
                              className="w-4 h-4 rounded border-[rgba(22,66,60,0.2)] accent-[#16423C]"
                            />
                            <label htmlFor="fail-anon" className="text-[13px] text-[#6B6B6B]" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                              匿名发布我的墓志铭
                            </label>
                          </div>
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id="fail-agree"
                              checked={failureForm.agreed}
                              onChange={(e) => setFailureForm({ ...failureForm, agreed: e.target.checked })}
                              className="w-4 h-4 mt-0.5 rounded border-[rgba(22,66,60,0.2)] accent-[#16423C]"
                            />
                            <label htmlFor="fail-agree" className="text-xs text-[#6B6B6B] leading-relaxed" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                              我确认以上信息真实准确。我愿意让这段经历帮助其他人少走弯路。
                            </label>
                          </div>
                          {errors.agreed && <p className="text-xs text-[#8B2942] flex items-center gap-1"><AlertCircle size={12} />{errors.agreed}</p>}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="mt-8 flex items-center justify-between pt-6 border-t border-[rgba(22,66,60,0.1)]">
                  <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className={`px-5 py-2.5 text-sm font-medium rounded-full border transition-all ${
                      step === 1
                        ? 'border-[rgba(22,66,60,0.08)] text-[#6B6B6B]/40 cursor-not-allowed'
                        : 'border-[rgba(22,66,60,0.15)] text-[#1A1A1A] hover:border-[#2C6E63]'
                    }`}
                  >
                    上一步
                  </button>
                  {step < totalSteps ? (
                    <button
                      onClick={nextStep}
                      className="px-6 py-2.5 bg-[#2C6E63] text-[#FAF6F1] text-sm font-bold rounded-full transition-all hover:scale-[1.02]"
                    >
                      下一步
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className={`px-8 py-3 text-sm font-bold rounded-full transition-all hover:scale-[1.02] ${
                        mode === 'idea'
                          ? 'bg-[#2C6E63] text-[#FAF6F1]'
                          : 'bg-[#16423C] text-[#FAF6F1]'
                      } ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {submitting ? '提交中…' : mode === 'idea' ? '把点子扔到墙上' : '安葬这个项目'}
                    </button>
                  )}
                </div>
                {errors.submit && (
                  <p className="mt-3 text-xs text-[#8B2942] flex items-center justify-end gap-1">
                    <AlertCircle size={12} />
                    {errors.submit}
                  </p>
                )}
              </div>

              {/* ========== Guidelines Accordion ========== */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: easeOutExpo }}
                className="mt-8"
              >
                <h3
                  className="text-lg font-bold text-[#1A1A1A] mb-4"
                  style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
                >
                  投稿须知
                </h3>
                <div className="bg-[#F3EDE4] border border-[rgba(22,66,60,0.1)] rounded-2xl px-6">
                  {guidelines.map((g, i) => (
                    <AccordionItem
                      key={i}
                      q={g.q}
                      a={g.a}
                      isOpen={openAccordion === i}
                      onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
