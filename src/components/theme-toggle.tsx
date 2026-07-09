"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme | null {
  return null;
}

function apply(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {}
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.3" />
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M7 0.75v1.4" />
        <path d="M7 11.85v1.4" />
        <path d="M13.25 7h-1.4" />
        <path d="M2.15 7H0.75" />
        <path d="M11.36 2.64l-0.99 0.99" />
        <path d="M3.63 10.37l-0.99 0.99" />
        <path d="M11.36 11.36l-0.99-0.99" />
        <path d="M3.63 3.63l-0.99-0.99" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M12.25 8.53A5.5 5.5 0 1 1 5.47 1.75a4.4 4.4 0 0 0 6.78 6.78Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!theme) {
    return <span className="inline-block w-[48px] h-[14px]" aria-hidden="true" />;
  }

  return (
    <div className="inline-flex items-center gap-3" role="group" aria-label="theme">
      <button
        type="button"
        onClick={() => apply("light")}
        aria-label="Light mode"
        aria-pressed={theme === "light"}
        className={
          theme === "light"
            ? "text-blue"
            : "text-faint hover:text-dim transition-colors"
        }
      >
        <SunIcon />
      </button>
      <button
        type="button"
        onClick={() => apply("dark")}
        aria-label="Dark mode"
        aria-pressed={theme === "dark"}
        className={
          theme === "dark"
            ? "text-blue"
            : "text-faint hover:text-dim transition-colors"
        }
      >
        <MoonIcon />
      </button>
    </div>
  );
}
