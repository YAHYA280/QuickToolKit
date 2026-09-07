"use client";

import { toolLoaders } from "@/tools/loaders";

/** Renders the lazily loaded component for a tool slug. */
export function ToolRenderer({ slug }: { slug: string }) {
  const Tool = toolLoaders[slug];
  if (!Tool) return null;
  return <Tool />;
}
