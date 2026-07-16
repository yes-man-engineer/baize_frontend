import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: '首页', path: '/' },
  { label: '点子墙', path: '/ideas' },
  { label: '失败档案', path: '/failures' },
  { label: '在途项目', path: '/ongoing' },
  { label: '数据洞察', path: '/insights' },
  { label: '社区', path: '/community' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBg = isHome
    ? scrolled
      ? 'bg-[#16423C]/95 backdrop-blur-md border-b border-white/10'
      : 'bg-[#0D1F15]/30 backdrop-blur-sm border-b border-white/5'
    : 'bg-[#16423C]/95 backdrop-blur-md border-b border-white/10';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — 篆体图标 + 中英文 */}
          <Link to="/" className="flex flex-col items-center gap-0.5 py-0.5">
            <img
              src="/baize-brand.png"
              alt=""
              className="h-[2.25rem] w-auto object-contain"
            />
            <div className="flex items-baseline gap-0.5">
              <span
                className="text-[#FAF6F1] font-bold text-[15px] leading-none"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
              >
                白泽
              </span>
              <span
                className="text-[#FAF6F1]/30 text-[9px] font-medium tracking-[0.08em] uppercase leading-none"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                Baize
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[#FAF6F1] text-sm font-medium tracking-wide transition-opacity duration-300 hover:opacity-100"
                style={{
                  opacity: location.pathname === link.path ? 1 : 0.7,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/submit"
              className="inline-flex items-center px-4 py-2 bg-[#FAF6F1] text-[#16423C] text-xs font-bold rounded-full transition-transform duration-300 hover:scale-[1.02]"
            >
              分享我的故事
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#FAF6F1]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#16423C]/98 border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block text-[#FAF6F1] text-sm font-medium py-2 transition-opacity duration-300"
                style={{
                  opacity: location.pathname === link.path ? 1 : 0.7,
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/submit"
              className="inline-block mt-2 px-4 py-2 bg-[#FAF6F1] text-[#16423C] text-xs font-bold rounded-full"
              onClick={() => setMobileOpen(false)}
            >
              分享我的故事
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
