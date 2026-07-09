import type { MDXComponents } from "mdx/types";
import { Children, isValidElement, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mermaid } from "./mermaid";
import { CodeBlock } from "./code-block";
import { ThemedImage } from "./themed-image";
import { Updated } from "./updated";
import { Tweet } from "./tweet";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (isValidElement(node)) return extractText((node.props as { children?: ReactNode }).children);
  if (Array.isArray(node)) return Children.map(node, extractText)?.join("") ?? "";
  return "";
}

export const mdxComponents: MDXComponents = {
  ThemedImage,
  Updated,
  Tweet,
  h1: ({ children, id }) => (
    <h1 id={id} className="mt-12 mb-4 text-3xl font-semibold tracking-tight text-ink">
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2 id={id} className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-ink">
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3 id={id} className="mt-8 mb-3 text-xl font-semibold tracking-tight text-ink">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-5 leading-7 text-ink">{children}</p>
  ),
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue underline decoration-blue/40 underline-offset-2 hover:decoration-blue transition-colors"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href || "#"}
        className="text-blue underline decoration-blue/40 underline-offset-2 hover:decoration-blue transition-colors"
      >
        {children}
      </Link>
    );
  },
  ul: ({ children }) => (
    <ul className="my-5 ml-6 list-disc space-y-2 text-ink">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 ml-6 list-decimal space-y-2 text-ink">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-blue/40 pl-6 italic text-dim">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className={`${className} text-sm`}>{children}</code>
      );
    }
    return (
      <code className="rounded bg-panel border border-rule px-1.5 py-0.5 text-sm font-mono text-ink">
        {children}
      </code>
    );
  },
  pre: ({ children }) => {
    const child = children as React.ReactElement<{ className?: string; children?: ReactNode }>;
    if (child?.props?.className?.includes("language-mermaid")) {
      return <Mermaid chart={extractText(child.props.children)} />;
    }
    return <CodeBlock>{children}</CodeBlock>;
  },
  img: ({ src, alt }) => {
    if (!src) return null;

    // Handle diagrams (SVGs in /diagrams/) - always render on a light plate for legibility
    if (src.includes("/diagrams/") && src.endsWith(".svg")) {
      return (
        <span className="my-8 block">
          <span className="block bg-white rounded-xl p-4 border border-rule">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt || ""}
              className="w-full h-auto"
            />
          </span>
        </span>
      );
    }

    // Handle GIFs and external images
    if (src.startsWith("http") || src.endsWith(".gif")) {
      return (
        <span className="my-6 block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt || ""}
            className="rounded-lg w-full"
          />
        </span>
      );
    }
    return (
      <span className="my-6 block">
        <Image
          src={src}
          alt={alt || ""}
          width={800}
          height={400}
          className="rounded-lg"
        />
      </span>
    );
  },
  hr: () => <hr className="my-8 border-rule" />,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-rule">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-ink bg-panel">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-ink border-t border-rule">
      {children}
    </td>
  ),
};
