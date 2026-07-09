import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Kevin Manase - manages agents that write code, notes on making that work.",
};

export default function AboutPage() {
  return (
    <div>
      <p className="text-dim mb-4">
        kevin@site:~$ <span className="text-ink font-semibold">cat about.txt</span>
      </p>

      <div className="space-y-5 text-ink leading-relaxed max-w-xl">
        <p>
          My job used to be writing code. Now it&apos;s managing agents that
          write code.
        </p>

        <p>
          This blog is where I write about software engineering, system design,
          and whatever I&apos;m learning. It&apos;s primarily a note to myself,
          but I figured I&apos;d put it out into the world in case it&apos;s useful
          to someone else.
        </p>

        <p>
          Writing helps me think. When I can&apos;t explain something clearly, it
          usually means I don&apos;t understand it well enough yet.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-rule">
        <p className="text-xs text-faint tracking-widest uppercase mb-4">
          connect
        </p>
        <div className="flex gap-6 text-sm">
          <a
            href="https://github.com/kevb10"
            target="_blank"
            rel="noopener noreferrer"
            className="text-faint hover:text-blue transition-colors"
          >
            github
          </a>
          <a
            href="https://twitter.com/kevinmanase"
            target="_blank"
            rel="noopener noreferrer"
            className="text-faint hover:text-blue transition-colors"
          >
            twitter
          </a>
        </div>
      </div>
    </div>
  );
}
