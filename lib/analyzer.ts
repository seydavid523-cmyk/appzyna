export type DetectedType = 'GAME' | 'SHOP' | 'WEBSITE';

export type ScrapedWebsite = {
  url: string;
  title: string;
  favicon: string;
  headings: string[];
  firstParagraph: string;
};

export type GeneratedAppCopy = {
  appName: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  category: 'Game' | 'Shop' | 'Website';
  tags: string[];
  howItWorks: string;
};

export type AnalyzeResult = {
  detectedType: DetectedType;
  scraped: ScrapedWebsite;
  generated: GeneratedAppCopy;
  source: 'ai' | 'fallback';
  notice?: string;
};

const forbiddenFallbackLines = ['access everything fast anytime', 'your website turned into an app'];

function decodeEntities(value: string) {
  const entities: Record<string, string> = {
    '&amp;': '&', '&nbsp;': ' ', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&lt;': '<', '&gt;': '>',
  };
  return value.replace(/&(amp|nbsp|quot|#39|apos|lt|gt);/gi, (entity) => entities[entity.toLowerCase()] ?? entity);
}

function cleanText(value: string) {
  return decodeEntities(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function getTagValues(html: string, tag: string) {
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  return Array.from(html.matchAll(pattern)).map((match) => cleanText(match[1])).filter(Boolean);
}

function getMetaContent(html: string, attribute: string, value: string) {
  const pattern = new RegExp(`<meta\\b[^>]*${attribute}=["']${value}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i');
  const reversePattern = new RegExp(`<meta\\b[^>]*content=["']([^"']+)["'][^>]*${attribute}=["']${value}["'][^>]*>`, 'i');
  return html.match(pattern)?.[1] ?? html.match(reversePattern)?.[1] ?? '';
}

function getFavicon(html: string, baseUrl: string) {
  const linkPattern = /<link\b[^>]*rel=["'][^"']*(?:icon|shortcut icon)[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i;
  const reversePattern = /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["'][^"']*(?:icon|shortcut icon)[^"']*["'][^>]*>/i;
  const href = html.match(linkPattern)?.[1] ?? html.match(reversePattern)?.[1] ?? '/favicon.ico';
  try { return new URL(href, baseUrl).toString(); } catch { return `${baseUrl}/favicon.ico`; }
}

function normalizeUrl(rawUrl: string) {
  const trimmed = rawUrl.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(withProtocol);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only http and https website URLs are supported.');
  return parsed.toString();
}

export async function scrapeWebsite(rawUrl: string): Promise<ScrapedWebsite> {
  const url = normalizeUrl(rawUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'AppzynaBot/1.0 (+https://appzyna.online)' },
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(`The website returned HTTP ${response.status}.`);
    const html = await response.text();
    const title = cleanText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '') || getMetaContent(html, 'property', 'og:title') || new URL(url).hostname;
    const headings = [...getTagValues(html, 'h1'), ...getTagValues(html, 'h2'), ...getTagValues(html, 'h3')].filter((heading, index, values) => values.indexOf(heading) === index).slice(0, 8);
    const firstParagraph = getTagValues(html, 'p').find((paragraph) => paragraph.length > 25) ?? getMetaContent(html, 'name', 'description') ?? '';
    return { url, title, favicon: getFavicon(html, url), headings, firstParagraph: firstParagraph.slice(0, 700) };
  } finally {
    clearTimeout(timeout);
  }
}

export function detectType(scraped: ScrapedWebsite): DetectedType {
  const haystack = `${scraped.url} ${scraped.title} ${scraped.headings.join(' ')} ${scraped.firstParagraph}`.toLowerCase();
  if (/tic[ -]?tac[ -]?toe|game|gaming|arcade|puzzle|quiz|play against|play vs/.test(haystack)) return 'GAME';
  if (/shop|store|cart|checkout|product|price|buy now|order|menu|commerce/.test(haystack)) return 'SHOP';
  return 'WEBSITE';
}

function toCategory(type: DetectedType): GeneratedAppCopy['category'] {
  return type === 'GAME' ? 'Game' : type === 'SHOP' ? 'Shop' : 'Website';
}

function limitWords(value: string, maxWords: number) {
  return value.trim().split(/\s+/).slice(0, maxWords).join(' ');
}

function limitChars(value: string, maxChars: number) {
  const trimmed = value.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars - 1).trimEnd()}…`;
}

function fallbackCopy(scraped: ScrapedWebsite, type: DetectedType): GeneratedAppCopy {
  const category = toCategory(type);
  const title = scraped.title || new URL(scraped.url).hostname;
  const headings = scraped.headings.length ? scraped.headings : [title];
  const firstHeading = headings[0];
  const paragraph = scraped.firstParagraph || `Explore ${title} through the pages and sections published on its website.`;
  const shortDesc = limitChars(scraped.firstParagraph || `${firstHeading} — ${title}`, 80);
  const fullDesc = limitWords(`${title} is a ${category.toLowerCase()} experience built around ${headings.slice(0, 4).join(', ')}. ${paragraph} Visit the source website to explore the original content, sections, and actions behind this app.`, 500);
  const features = headings.slice(0, 4).map((heading) => heading.slice(0, 100));
  while (features.length < 4) features.push([title, paragraph, new URL(scraped.url).hostname, category][features.length].slice(0, 100));
  const forbiddenPattern = new RegExp(forbiddenFallbackLines.join('|'), 'gi');
  const cleanFullDesc = fullDesc.replace(forbiddenPattern, '').replace(/\s+/g, ' ').trim();
  return {
    appName: title.slice(0, 60),
    shortDesc,
    fullDesc: cleanFullDesc,
    features,
    category,
    tags: [category.toLowerCase(), ...headings.slice(0, 3).map((heading) => heading.toLowerCase().split(/\s+/).slice(0, 2).join('-'))].slice(0, 5),
    howItWorks: type === 'GAME' ? `Open ${title}, follow the on-screen instructions, and use the real game controls from the source website.` : `Open ${title} and explore the real sections, headings, and actions published on the source website.`,
  };
}

function parseJsonObject(value: string) {
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1] ?? value;
  const start = fenced.indexOf('{');
  const end = fenced.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('AI response did not contain JSON.');
  return JSON.parse(fenced.slice(start, end + 1)) as Partial<GeneratedAppCopy>;
}

async function generateWithAi(scraped: ScrapedWebsite, type: DetectedType, fallback: GeneratedAppCopy) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;
  const base = (process.env.AI_API_BASE || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.AI_MODEL || 'gpt-4o-mini';
  const response = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You write accurate Play Store style listings. Use only the provided real website facts. Never invent claims, never use generic filler, and return valid JSON only.' },
        { role: 'user', content: JSON.stringify({ task: 'Create a Play Store style app listing from this real website analysis.', detectedType: type, website: scraped.url, title: scraped.title, headings: scraped.headings, firstParagraph: scraped.firstParagraph, requiredShape: { appName: 'string', shortDesc: 'string <= 80 chars', fullDesc: 'string <= 500 words', features: 'exactly 4 strings', category: 'Game | Shop | Website', tags: 'array of 3-5 strings', howItWorks: 'string' } }) },
      ],
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`AI request failed with HTTP ${response.status}.`);
  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const raw = payload.choices?.[0]?.message?.content;
  if (!raw) throw new Error('AI returned no content.');
  const parsed = parseJsonObject(raw);
  const features = Array.isArray(parsed.features) ? parsed.features.filter((item): item is string => typeof item === 'string').slice(0, 4) : [];
  while (features.length < 4) features.push(fallback.features[features.length]);
  return {
    appName: typeof parsed.appName === 'string' ? parsed.appName.slice(0, 60) : fallback.appName,
    shortDesc: typeof parsed.shortDesc === 'string' ? limitChars(parsed.shortDesc, 80) : fallback.shortDesc,
    fullDesc: typeof parsed.fullDesc === 'string' ? limitWords(parsed.fullDesc, 500) : fallback.fullDesc,
    features,
    category: parsed.category === 'Game' || parsed.category === 'Shop' || parsed.category === 'Website' ? parsed.category : fallback.category,
    tags: Array.isArray(parsed.tags) ? parsed.tags.filter((item): item is string => typeof item === 'string').slice(0, 5) : fallback.tags,
    howItWorks: typeof parsed.howItWorks === 'string' ? parsed.howItWorks : fallback.howItWorks,
  } satisfies GeneratedAppCopy;
}

export async function analyzeWebsite(rawUrl: string): Promise<AnalyzeResult> {
  const scraped = await scrapeWebsite(rawUrl);
  const detectedType = detectType(scraped);
  const fallback = fallbackCopy(scraped, detectedType);
  try {
    const generated = await generateWithAi(scraped, detectedType, fallback);
    if (generated) return { detectedType, scraped, generated, source: 'ai' };
  } catch {
    // The fallback is intentional: scraped website content remains usable when AI is unavailable.
  }
  return {
    detectedType,
    scraped,
    generated: fallback,
    source: 'fallback',
    notice: 'AI is busy, we used your website content. You can edit.',
  };
}
