import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://kevinmanase.com"),
  title: {
    default: "Kevin Manase",
    template: "%s | Kevin Manase",
  },
  description: "Engineering thoughts, system design, and notes on building software.",
  keywords: ["software engineering", "system design", "programming", "web development"],
  authors: [{ name: "Kevin Manase" }],
  creator: "Kevin Manase",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kevinmanase.com",
    siteName: "Kevin Manase",
    title: "Kevin Manase",
    description: "Engineering thoughts, system design, and notes on building software.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kevinmanase",
    creator: "@kevinmanase",
    title: "Kevin Manase",
    description: "Engineering thoughts, system design, and notes on building software.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-paper text-ink antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-rule">
            <nav className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between text-sm">
              <Link
                href="/"
                className="text-ink hover:text-blue transition-colors"
              >
                kevin@site
              </Link>
              <div className="flex items-center gap-4">
                <NavLinks />
                <ThemeToggle />
              </div>
            </nav>
          </header>
          <main className="flex-1">
            <div className="max-w-3xl mx-auto px-6 py-12">{children}</div>
          </main>
          <footer className="border-t border-rule">
            <div className="max-w-3xl mx-auto px-6 py-8 text-sm text-faint">
              <p>kevin manase</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
