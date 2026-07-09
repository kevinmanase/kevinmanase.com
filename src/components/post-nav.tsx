import Link from "next/link";

interface PostNavItem {
  slug: string;
}

interface PostNavProps {
  prev: PostNavItem | null;
  next: PostNavItem | null;
}

export function PostNav({ prev, next }: PostNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-12 pt-6 border-t border-dashed border-rule flex items-center justify-between text-sm text-faint">
      {prev ? (
        <Link href={`/posts/${prev.slug}`} className="hover:text-blue transition-colors">
          &lt; cd ../{prev.slug}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/posts/${next.slug}`} className="hover:text-blue transition-colors">
          cd ../{next.slug} &gt;
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
