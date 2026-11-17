import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BrandMark } from './brand-mark';

export function SiteHeader({ active }: { active?: 'discover' | 'creators' }) {
  return (
    <header className="relative z-20 border-b border-[#282061]/10 bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-5 px-5 py-4 sm:px-8 sm:py-5 lg:px-12">
        <BrandMark />
        <nav className="hidden items-center gap-7 text-sm font-bold text-[#282061]/65 lg:flex" aria-label="Primary navigation">
          <Link className={`transition-colors hover:text-[#282061] ${active === 'discover' ? 'text-[#282061]' : ''}`} href="/#explore">Explore apps</Link>
          <Link className={`transition-colors hover:text-[#282061] ${active === 'creators' ? 'text-[#282061]' : ''}`} href="/creator/king">Creators</Link>
          <Link className="transition-colors hover:text-[#282061]" href="/#how-it-works">How it works</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/signup" className="hidden rounded-md bg-[#777777] px-4 py-3 text-sm font-black text-white transition hover:bg-[#282061] sm:inline-flex">Create Account</Link>
          <Link href="/login" className="rounded-md bg-[#666666] px-4 py-3 text-sm font-black text-white transition hover:bg-[#282061]">Login</Link>
          <Link href="/dashboard" className="hidden items-center gap-2 rounded-md bg-[#F06B3D] px-4 py-3 text-sm font-black text-white transition hover:bg-[#D9572C] sm:inline-flex">Publish to Appzyna <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </header>
  );
}
