import Link from "next/link";
import { format } from "date-fns";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      <section className="mb-16">
        <p className="text-dim mb-4">
          kevin@site:~$ <span className="text-ink font-semibold">whoami</span>
        </p>
        <p className="text-ink leading-relaxed max-w-xl">
          I write about building software, system design, and whatever I&apos;m
          learning. These are notes for myself that I&apos;m putting out into the
          world.
        </p>
      </section>

      <section>
        <p className="text-xs text-faint tracking-widest uppercase mb-6">
          recent -- {posts.length} {posts.length === 1 ? "entry" : "entries"}
        </p>
        {posts.length === 0 ? (
          <p className="text-faint italic">No posts yet. Check back soon.</p>
        ) : (
          <ul className="space-y-1">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex items-baseline gap-4 py-3 -mx-3 px-3 rounded-sm hover:bg-blue transition-colors"
                >
                  <time
                    dateTime={post.date}
                    className="text-sm text-faint group-hover:text-white/70 tabular-nums shrink-0 transition-colors"
                  >
                    {format(new Date(post.date), "MMM d, yyyy")}
                  </time>
                  <span className="font-medium text-ink group-hover:text-white transition-colors">
                    {post.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
