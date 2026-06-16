import type { MDXComponents } from "mdx/types";
import { FactBlock } from "@/components/FactBlock";
import { Pull } from "@/components/prose/Pull";

/**
 * Root MDX mapping (App Router). Essays render through these so the typographic
 * craft — measure, hanging punctuation, mono captions, designed links — is
 * consistent everywhere. Brand components (Fact Block, pull-quote) are exposed
 * to MDX directly.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    FactBlock,
    Pull,
    ...components,
  };
}
