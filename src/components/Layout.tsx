import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  fullBleedHero?: boolean;
}

export default function Layout({ children, fullBleedHero = false }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className={fullBleedHero ? '' : 'pt-16'}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
