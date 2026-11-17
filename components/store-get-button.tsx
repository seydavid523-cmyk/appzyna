'use client';

import { useState } from 'react';
import { Check, Download } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function StoreGetButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [isGot, setIsGot] = useState(false);
  async function handleGet() {
    setIsGot(true);
    const key = `appzyna_download_${slug}`;
    localStorage.setItem(key, String(Number(localStorage.getItem(key) || '0') + 1));
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        await supabase.rpc('increment_app_downloads', { app_slug: slug });
      } catch {
        // Demo mode remains successful when the optional RPC is not installed.
      }
    }
    const downloadLink = document.createElement('a');
    downloadLink.href = `/api/apps/${encodeURIComponent(slug)}/download`;
    downloadLink.download = `${slug}-appzyna.zip`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  }
  return <button type="button" onClick={handleGet} className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-black text-[#17121F] transition hover:bg-[#F97316] hover:text-white ${compact ? 'px-3 py-2' : 'px-5 py-3'}`}>{isGot ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}{isGot ? 'Downloaded' : 'Get ZIP'}</button>;
}
