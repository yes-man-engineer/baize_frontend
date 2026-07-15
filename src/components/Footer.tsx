import { Link } from 'react-router';

const exploreLinks = [
  { label: '点子墙', path: '/ideas' },
  { label: '失败档案', path: '/failures' },
  { label: '数据洞察', path: '/insights' },
  { label: '本周精选', path: '/' },
];

const participateLinks = [
  { label: '分享点子', path: '/submit' },
  { label: '提交复盘', path: '/submit' },
  { label: '成为编辑', path: '/about' },
  { label: '匿名投稿', path: '/submit' },
];

const aboutLinks = [
  { label: '我们是谁', path: '/about' },
  { label: '给创业者的信', path: '/about' },
  { label: '媒体报道', path: '/about' },
  { label: '联系我们', path: '/about' },
];

function SocialXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialGitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function SocialWeChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.036 2.87a.968.968 0 110 1.936.968.968 0 010-1.936zm4.145 0a.968.968 0 110 1.936.968.968 0 010-1.936z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#16423C] border-t border-[rgba(250,246,241,0.1)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1 - Brand */}
          <div>
            <div className="flex items-center gap-2">
              <img src="/baize-logo.svg" alt="" className="w-6 h-6" />
              <span className="text-[#FAF6F1] text-xl font-bold" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                白泽
              </span>
            </div>
            <p className="mt-4 text-sm text-[#FAF6F1]/60 leading-relaxed">
              让每一个点子被看见，
              <br />
              让每一次失败被记住。
            </p>
          </div>

          {/* Col 2 - Explore */}
          <div>
            <h4 className="text-[#FAF6F1] text-sm font-bold mb-4">探索</h4>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-[#FAF6F1]/60 text-[13px] transition-opacity duration-200 hover:text-[#FAF6F1]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Participate */}
          <div>
            <h4 className="text-[#FAF6F1] text-sm font-bold mb-4">参与</h4>
            <ul className="space-y-2">
              {participateLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-[#FAF6F1]/60 text-[13px] transition-opacity duration-200 hover:text-[#FAF6F1]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - About */}
          <div>
            <h4 className="text-[#FAF6F1] text-sm font-bold mb-4">关于</h4>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-[#FAF6F1]/60 text-[13px] transition-opacity duration-200 hover:text-[#FAF6F1]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-[rgba(250,246,241,0.1)]" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Social icons */}
          <div className="flex items-center gap-6 text-[#FAF6F1]/50">
            <a href="#" className="transition-opacity duration-200 hover:text-[#FAF6F1]" aria-label="X">
              <SocialXIcon />
            </a>
            <a href="#" className="transition-opacity duration-200 hover:text-[#FAF6F1]" aria-label="GitHub">
              <SocialGitHubIcon />
            </a>
            <a href="#" className="transition-opacity duration-200 hover:text-[#FAF6F1]" aria-label="WeChat">
              <SocialWeChatIcon />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-[#FAF6F1]/40">
            &copy; 2025 白泽 Baize
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-2 text-xs text-[#FAF6F1]/40">
            <a href="#" className="transition-opacity duration-200 hover:text-[#FAF6F1]/70">
              隐私政策
            </a>
            <span>·</span>
            <a href="#" className="transition-opacity duration-200 hover:text-[#FAF6F1]/70">
              服务条款
            </a>
            <span>·</span>
            <a href="#" className="transition-opacity duration-200 hover:text-[#FAF6F1]/70">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
