import type { ComponentType } from "react";

export type CategorySlug = "developer" | "text" | "finance" | "converters";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** <title> for the category page (<= 50 chars, site name is appended) */
  title: string;
  description: string;
  /** 2-3 short paragraphs shown under the tool grid on the category page */
  intro: string[];
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolContent {
  /** <title>, keep under ~60 chars */
  title: string;
  /** meta description, 140-160 chars */
  description: string;
  /** 1-2 paragraphs shown under the tool */
  intro: string[];
  howTo: string[];
  features: string[];
  faq: FaqItem[];
}

export interface ToolDefinition {
  slug: string;
  category: CategorySlug;
  name: string;
  shortDescription: string;
  keywords: string[];
  related: string[];
  icon: string;
  /** Marks tools to surface on the home page */
  popular?: boolean;
  component: ComponentType;
  /** Content keyed by locale; falls back to "en" */
  content: Record<string, ToolContent>;
}
