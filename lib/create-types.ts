import type { AnalyzeResult, GeneratedAppCopy } from './analyzer';

export type CreateDraft = {
  websiteUrl: string;
  analysis: AnalyzeResult | null;
  copy: GeneratedAppCopy | null;
  appName: string;
  logoUrl: string;
  color: string;
  category: 'Game' | 'Shop' | 'Website';
};
