"use client";

import { useMemo, useState } from "react";
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

const STATE_STYLES: Record<PullRequestState, { glyph: string; className: string; label: string }> = {
  merged: { glyph: "●", className: "text-merged", label: "merged" },
  open: { glyph: "○", className: "text-open", label: "open" },
  closed: { glyph: "✕", className: "text-faint", label: "closed" },
};

type Sort = "stars" | "recent";

function formatStars(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k >= 100 ? Math.round(k) : k.toFixed(1)}k`;
}

function LangDot({ language }: { language: string }) {
  return (
    <i
      aria-hidden="true"
      className="w-2 h-2 rounded-full shrink-0"
      style={{ background: LANG_COLORS[language] ?? "var(--faint)" }}
    />
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "text-xs rounded-full px-3 py-0.5 border border-blue bg-blue text-white"
          : "text-xs rounded-full px-3 py-0.5 border border-rule text-dim hover:text-ink hover:border-dim transition-colors"
      }
    >
      {children}
    </button>
  );
}

export function Contributions({ items }: { items: Contribution[] }) {
  const [sort, setSort] = useState<Sort>("stars");
  const [language, setLanguage] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const languages = useMemo(
    () => Array.from(new Set(items.map((r) => r.language))).sort(),
    [items]
  );

  const rows = useMemo(() => {
    return items
      .filter((r) => language === "all" || r.language === language)
      .slice()
      .sort((a, b) =>
        sort === "stars"
          ? b.stars - a.stars
          : (b.latest ?? "").localeCompare(a.latest ?? "")
      );
  }, [items, language, sort]);

  if (items.length === 0) return null;

  const prCount = items.reduce((n, r) => n + r.prs.length, 0);

  return (
    <section className="mb-16">
      <p className="text-xs text-faint tracking-widest uppercase mb-6">
        contributions -- {items.length} repos, {prCount} pull requests
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Chip active={language === "all"} onClick={() => setLanguage("all")}>
            all
          </Chip>
          {languages.map((lang) => (
            <Chip
              key={lang}
              active={language === lang}
              onClick={() => setLanguage(lang)}
            >
              {lang.toLowerCase()}
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Chip active={sort === "stars"} onClick={() => setSort("stars")}>
            stars ↓
          </Chip>
          <Chip active={sort === "recent"} onClick={() => setSort("recent")}>
            recent
          </Chip>
        </div>
      </div>

      <div>
        {rows.map((r) => {
          const open = expanded === r.repo;
          const [owner, name] = r.repo.split("/");
          const panelId = `contrib-${r.repo.replace(/[^a-z0-9]/gi, "-")}`;

          return (
            <div key={r.repo}>
              <button
                type="button"
                onClick={() => setExpanded(open ? null : r.repo)}
                aria-expanded={open}
                aria-controls={panelId}
                className={`w-full text-left grid grid-cols-[3.75rem_1fr_3.5rem_1rem] sm:grid-cols-[4.5rem_1fr_9.5rem_3.5rem_1rem] gap-x-3 sm:gap-x-4 items-baseline py-3 px-1 -mx-1 rounded-sm hover:bg-blue/5 transition-colors ${
                  open ? "border-b border-transparent" : "border-b border-rule"
                }`}
              >
                <span className="text-sm text-dim tabular-nums text-right">
                  ★ {formatStars(r.stars)}
                </span>
                <span className="text-ink truncate">
                  <span className="hidden sm:inline text-faint">{owner}/</span>
                  {name}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-faint truncate">
                  <LangDot language={r.language} />
                  <span className="truncate">{r.language.toLowerCase()}</span>
                </span>
                <span className="text-xs text-faint tabular-nums text-right">
                  {r.prs.length} PR{r.prs.length === 1 ? "" : "s"}
                </span>
                <span
                  aria-hidden="true"
                  className={`text-xs ${open ? "text-blue" : "text-faint"}`}
                >
                  {open ? "▾" : "▸"}
                </span>
              </button>

              {open && (
                <div
                  id={panelId}
                  className="border-b border-rule pb-4 pl-1 sm:pl-[5.5rem] pr-1"
                >
                  <p className="text-sm text-dim max-w-[60ch] mb-3">{r.blurb}</p>
                  <ul className="space-y-0.5">
                    {r.prs.map((pr) => {
                      const state = STATE_STYLES[pr.state];
                      return (
                        <li key={pr.number}>
                          <a
                            href={pr.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-baseline gap-2.5 text-sm py-1"
                          >
                            <span
                              className={`text-xs shrink-0 ${state.className}`}
                              title={state.label}
                            >
                              {state.glyph}
                              <span className="sr-only">{state.label}</span>
                            </span>
                            <span className="text-faint tabular-nums shrink-0">
                              #{pr.number}
                            </span>
                            <span className="text-dim group-hover:text-blue transition-colors truncate">
                              {pr.title}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-faint hover:text-blue transition-colors mt-3"
                  >
                    github.com/{r.repo} →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
