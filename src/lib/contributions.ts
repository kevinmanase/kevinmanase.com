import fs from "fs";
import path from "path";

const contributionsFile = path.join(process.cwd(), "content/contributions.json");

export type PullRequestState = "merged" | "open" | "closed";

export interface PullRequest {
  number: number;
  title: string;
  url: string;
  state: PullRequestState;
  date: string;
}

export interface Contribution {
  repo: string;
  url: string;
  stars: number;
  language: string;
  blurb: string;
  latest: string | null;
  prs: PullRequest[];
}

export function getContributions(): Contribution[] {
  if (!fs.existsSync(contributionsFile)) {
    return [];
  }

  const parsed = JSON.parse(fs.readFileSync(contributionsFile, "utf8"));
  const repos: Contribution[] = parsed.repos ?? [];

  return repos.slice().sort((a, b) => b.stars - a.stars);
}
