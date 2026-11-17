import Link from 'next/link';

export function CrownMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-gradient-to-br from-[#32137A] via-[#7044D7] to-[#F2774D] shadow-[0_8px_22px_rgba(44,28,109,0.2)]" aria-hidden="true">
      <svg viewBox="0 0 36 36" className="h-6 w-6" fill="none">
        <circle cx="10" cy="10" r="3" fill="#F7B15B" />
        <circle cx="26" cy="9" r="3" fill="#F7B15B" />
        <circle cx="9" cy="26" r="3" fill="#F7B15B" />
        <circle cx="25" cy="25" r="3" fill="#F7B15B" />
        <path d="M12.5 11.8L22.8 8.9M11.5 12.8L9.8 22.5M12 25.8L22 25.2M25 12L25.3 22" stroke="#FDE1B0" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 18.5L20 14.5M16 18.5L20 22.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="Appzyna home">
      <CrownMark compact={compact} />
      <span className="leading-none">
        <span className="block font-display text-[1.55rem] font-black tracking-[-0.075em] text-[#282061] transition-transform group-hover:-translate-y-0.5 sm:text-[1.9rem]">
          appzyna<span className="text-[#F06B3D]">.</span>
        </span>
        {!compact && <span className="mt-1 block text-[0.5rem] font-black uppercase tracking-[0.21em] text-[#282061]/50">by King Tech</span>}
      </span>
    </Link>
  );
}
