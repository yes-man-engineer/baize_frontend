import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, TrendingUp, Users, DollarSign } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const successCases = [
  {
    name: '小红书',
    category: '内容社区',
    founded: '2013',
    highlight: '从海外购物攻略到3亿月活的生活社区',
    keyLesson: '先聚焦一个细分场景（海外购物），再逐步泛化到生活方式',
    image: '/idea-community.jpg',
    revenue: '¥300亿+',
    users: '3亿月活',
  },
  {
    name: '理想汽车',
    category: '新能源汽车',
    founded: '2015',
    highlight: '增程式路线差异化突围，月销破5万',
    keyLesson: '不做全能选手，用增程式解决续航焦虑这一个痛点',
    image: '/idea-ai-agent.jpg',
    revenue: '¥1200亿+',
    users: '100万+车主',
  },
  {
    name: 'Shein',
    category: '跨境电商',
    founded: '2008',
    highlight: '快时尚出海，估值一度超千亿美元',
    keyLesson: '小单快返的供应链模式，用数据驱动设计决策',
    image: '/idea-saas.jpg',
    revenue: '¥2000亿+',
    users: '2亿+注册用户',
  },
  {
    name: '大疆创新',
    category: '智能硬件',
    founded: '2006',
    highlight: '消费级无人机全球市场份额超70%',
    keyLesson: '从航模爱好者切入，用技术壁垒构建护城河',
    image: '/idea-education.jpg',
    revenue: '¥300亿+',
    users: '全球70%+份额',
  },
  {
    name: '美团',
    category: '本地生活',
    founded: '2010',
    highlight: '千团大战胜出，成为超级生活平台',
    keyLesson: '地推铁军+高频打低频，用外卖撬动全品类',
    image: '/idea-wellness.jpg',
    revenue: '¥2700亿+',
    users: '6.8亿年交易用户',
  },
  {
    name: '字节跳动',
    category: '内容平台',
    founded: '2012',
    highlight: '算法推荐颠覆内容分发，TikTok全球化',
    keyLesson: '用推荐算法替代人工编辑，先做内容再做人',
    image: '/idea-fintech.jpg',
    revenue: '¥8000亿+',
    users: '15亿+全球用户',
  },
];

const keyFactors = [
  { icon: TrendingUp, title: '差异化定位', desc: '找到巨头看不上的缝隙市场' },
  { icon: Users, title: '用户驱动', desc: '让用户需求指引产品方向' },
  { icon: DollarSign, title: '精益运营', desc: '烧钱之前先验证商业模式' },
];

export default function SuccessStories() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.success-header', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.success-header', start: 'top 80%' },
      });
      gsap.fromTo('.success-card', { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.success-grid', start: 'top 85%' },
      });
      gsap.fromTo('.factor-card', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.factors-grid', start: 'top 85%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#FAF8F5] py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="success-header">
          <p className="text-xs font-medium text-[#1A3D2E] tracking-[0.1em] uppercase">
            SUCCESS STORIES · 成功案例
          </p>
          <h2
            className="mt-4 text-[#141414] font-bold leading-[1.3] tracking-[0.03em]"
            style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            有人死在了同一个坑里，
            <br />
            也有人爬了出来。
          </h2>
          <p className="mt-4 text-[15px] text-[#666666] max-w-lg leading-[1.75]">
            学习成功者走过的路，不是为了复制，而是为了理解——什么选择让他们活了下来。
          </p>
        </div>

        {/* Key success factors */}
        <div className="factors-grid grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {keyFactors.map((factor, i) => (
            <div key={i} className="factor-card bg-[#F0EDE6] rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1A3D2E] flex items-center justify-center shrink-0">
                <factor.icon size={18} className="text-[#FAF8F5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#141414]">{factor.title}</h3>
                <p className="text-sm text-[#666666] mt-1">{factor.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Success case cards */}
        <div className="success-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {successCases.map((item, i) => (
            <div
              key={i}
              className="success-card group bg-white border border-[rgba(13,31,21,0.06)] rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#1A3D2E] bg-[#1A3D2E]/10 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs text-[#666666]">{item.founded}年创立</span>
                </div>
                <h3 className="text-xl font-bold text-[#141414] mb-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  {item.name}
                </h3>
                <p className="text-sm text-[#141414]/70 leading-relaxed mb-3">
                  {item.highlight}
                </p>
                <div className="border-t border-[rgba(13,31,21,0.06)] pt-3">
                  <p className="text-xs text-[#666666] mb-1">关键经验</p>
                  <p className="text-sm text-[#1A3D2E] font-medium leading-relaxed">
                    {item.keyLesson}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-[#666666]">
                  <span>营收 {item.revenue}</span>
                  <span>{item.users}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A3D2E] text-[#FAF8F5] rounded-full font-bold text-sm transition-all hover:bg-[#0D1F15]"
          >
            <span>分享我的创业故事</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
