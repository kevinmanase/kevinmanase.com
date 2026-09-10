import { notFound } from "next/navigation";
import { format } from "date-fns";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getAllPostSlugs, getAdjacentPosts } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx-components";
import { VersionHistory } from "@/components/version-history";
import { TypedTitle } from "@/components/typed-title";
import { CopyMarkdownButton } from "@/components/copy-markdown-button";
import { ScrollProgress } from "@/components/scroll-progress";
import { PostNav } from "@/components/post-nav";
import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: `/posts/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: ["Kevin Manase"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      site: "@kevinmanase",
      creator: "@kevinmanase",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getAdjacentPosts(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: "Kevin Manase",
      url: "https://kevinmanase.com/about",
    },
    datePublished: post.created || post.date,
    dateModified: post.updated || post.date,
    publisher: {
      "@type": "Person",
      name: "Kevin Manase",
      url: "https://kevinmanase.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://kevinmanase.com/posts/${slug}`,
    },
    keywords: post.tags?.join(", "),
  };

  return (
    <>
      <ScrollProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
      <header className="mb-10">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-sm text-faint hover:text-blue transition-colors"
          >
            &lt; cd ..
          </Link>
          <CopyMarkdownButton content={post.content} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          <TypedTitle text={post.title} />
        </h1>
        <div className="flex items-center gap-3 text-sm text-faint">
          <time dateTime={post.date}>
            {format(new Date(post.date), "MMMM d, yyyy")}
          </time>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      <VersionHistory
        created={post.created}
        updated={post.updated}
        changelog={post.changelog}
      />

      <div className="prose-custom">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight, rehypeSlug],
            },
          }}
        />
      </div>

      <p className="mt-10 text-sm text-faint">
        &lt; EOF <span className="caret ml-1" aria-hidden="true" />
      </p>

      <PostNav prev={prev} next={next} />
    </article>
    </>
  );
}
