import type { Metadata } from 'next';
import { BrandMark } from '@/components/brand-mark';
import { CreateAppFlow } from '@/components/create-app-flow';

export const metadata: Metadata = { title: 'Create an app — Appzyna' };

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-[#F4F4F7]">
      <header className="border-b border-[#282061]/10 bg-white"><div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-12"><BrandMark /><span className="text-xs font-black uppercase tracking-[0.18em] text-[#282061]/45">Creator portal / New app</span></div></header>
      <CreateAppFlow />
    </div>
  );
}
