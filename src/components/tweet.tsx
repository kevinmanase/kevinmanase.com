"use client";

import dynamic from "next/dynamic";

const ReactTweet = dynamic(
  () => import("react-tweet").then((mod) => mod.Tweet),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        loading tweet...
      </div>
    ),
  }
);

export function Tweet({ id }: { id: string }) {
  return (
    <div className="my-6 flex justify-center [&>div]:my-0">
      <ReactTweet id={id} />
    </div>
  );
}
