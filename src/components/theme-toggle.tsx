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

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!theme) {
    return <span className="inline-block w-[70px] h-[22px]" aria-hidden="true" />;
  }

  return (
    <div
      className="inline-flex border border-rule rounded overflow-hidden text-[10px] leading-none"
      role="group"
      aria-label="theme"
    >
      <button
        type="button"
        onClick={() => apply("light")}
        className={
          theme === "light"
            ? "bg-blue text-white px-2 py-1"
            : "px-2 py-1 text-faint hover:text-ink transition-colors"
        }
      >
        light
      </button>
      <button
        type="button"
        onClick={() => apply("dark")}
        className={
          theme === "dark"
            ? "bg-blue text-white px-2 py-1"
            : "px-2 py-1 text-faint hover:text-ink transition-colors"
        }
      >
        dark
      </button>
    </div>
  );
}
