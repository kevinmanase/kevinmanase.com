"use client";

import Image from "next/image";
import { useState } from "react";
import type { Contribution, PullRequestState } from "@/lib/contributions";

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Rust: "#dea584",
  Go: "#00ADD8",
  Swift: "#F05138",
  "Jupyter Notebook": "#DA5B0B",
  Dockerfile: "#384d54",
};

const STATE_STYLES: Record<
  PullRequestState,
  { glyph: string; className: string; label: string }
> = {
  merged: { glyph: "●", className: "text-merged", label: "merged" },
  open: { glyph: "○", className: "text-open", label: "open" },
  closed: { glyph: "✕", className: "text-faint", label: "closed" },
};

function formatStars(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k >= 100 ? Math.round(k) : k.toFixed(1)}k`;
}

function LangDot({ language }: { language: string }) {
  return (
    <i
      aria-hidden="true"
      className="w-2 h-2 rounded-full shrink-0 inline-block"
      style={{ background: LANG_COLORS[language] ?? "var(--faint)" }}
    />
  );
}

function Identity({ repo, size }: { repo: Contribution; size: number }) {
  return (
    <>
      {repo.avatar ? (
        <Image
          src={repo.avatar}
          alt=""
          width={size}
          height={size}
          loading="eager"
          unoptimized
          className="rounded-md object-cover shrink-0 bg-rule"
        />
      ) : (
        <span
          aria-hidden="true"
          className="rounded-md shrink-0 bg-rule"
          style={{ width: size, height: size }}
        />
      )}
      <span className="block min-w-0">
        <span className="block text-[11px] text-faint leading-tight truncate">
          {repo.owner}
        </span>
        <span className="block text-[15px] font-semibold leading-tight truncate">
          {repo.name}
        </span>
      </span>
    </>
  );
}

function Card({ repo }: { repo: Contribution }) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((v) => !v);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if ((e.target as HTMLElement).closest("a")) return;
    e.preventDefault();
    toggle();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${repo.repo} — flip to see pull requests`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) return;
        toggle();
      }}
      onKeyDown={onKeyDown}
      className="contrib-card rounded-[12px] focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-[3px]"
    >
      <div className="contrib-inner">
        {/* front */}
        <div className="contrib-face">
          <div className="contrib-banner flex items-center gap-3 px-[18px] py-[15px] border-b border-rule shrink-0">
            <Identity repo={repo} size={40} />
          </div>
          <div className="flex flex-col gap-3 px-[18px] pt-[15px] pb-4 flex-1 min-h-0">
            <p className="text-sm text-ink leading-relaxed flex-1 min-h-0 overflow-hidden line-clamp-4">
              {repo.blurb}
            </p>
            <div className="flex items-center gap-2.5 text-xs text-faint shrink-0">
              <span className="text-dim tabular-nums whitespace-nowrap">
                ★ {formatStars(repo.stars)}
              </span>
              <span className="inline-flex items-center gap-1.5 min-w-0">
                <LangDot language={repo.language} />
                <span className="truncate">{repo.language.toLowerCase()}</span>
              </span>
              <span className="flex-1" />
              <span className="text-blue whitespace-nowrap">
                {repo.prs.length} PR{repo.prs.length === 1 ? "" : "s"} ↻
              </span>
            </div>
          </div>
        </div>

        {/* back */}
        <div className="contrib-face contrib-back p-[15px] gap-2">
          <div className="flex items-center gap-2 shrink-0 text-xs text-dim">
            {repo.avatar && (
              <Image
                src={repo.avatar}
                alt=""
                width={18}
                height={18}
                loading="eager"
                unoptimized
                className="rounded object-cover shrink-0 bg-rule"
              />
            )}
            <span className="truncate">{repo.name}</span>
          </div>
          <ul className="flex flex-col flex-1 min-h-0 overflow-y-auto">
            {repo.prs.map((pr) => {
              const state = STATE_STYLES[pr.state];
              return (
                <li key={pr.number}>
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline gap-2 py-[5px] text-[12.5px]"
                  >
                    <span
                      className={`text-[11px] shrink-0 ${state.className}`}
                      title={state.label}
                    >
                      {state.glyph}
                      <span className="sr-only">{state.label}</span>
                    </span>
                    <span className="text-faint tabular-nums shrink-0">
                      #{pr.number}
                    </span>
                    <span className="text-dim group-hover:text-blue transition-colors leading-snug">
                      {pr.title}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-2 border-t border-rule pt-2 shrink-0 text-[11px] text-faint">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:text-blue transition-colors"
            >
              github.com/{repo.repo}
            </a>
            <span className="flex-1" />
            <span className="text-blue whitespace-nowrap">back ↺</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Contributions({ items }: { items: Contribution[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mb-16">
      <p className="text-xs text-faint tracking-widest uppercase mb-6">
        contributions
      </p>

      <div className="flex gap-4 flex-wrap text-xs text-faint mb-4">
        {(Object.keys(STATE_STYLES) as PullRequestState[]).map((key) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <i className={`text-[11px] not-italic ${STATE_STYLES[key].className}`}>
              {STATE_STYLES[key].glyph}
            </i>
            {STATE_STYLES[key].label}
          </span>
        ))}
      </div>

      <div className="contrib-grid">
        {items.map((repo) => (
          <Card key={repo.repo} repo={repo} />
        ))}
      </div>
    </section>
  );
}
