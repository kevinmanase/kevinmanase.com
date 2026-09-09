#!/usr/bin/env node
/**
 * Regenerates content/contributions.json from the GitHub API.
 *
 *   node scripts/fetch-contributions.mjs
 *
 * Requires the `gh` CLI, authenticated. Hand-written blurbs in the existing
 * JSON are preserved. To add a repo, put it in REPOS below and re-run.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const AUTHOR = "kevinmanase";

/** Public repos Kevin doesn't own, with real community traction. */
const REPOS = [
  "NousResearch/hermes-agent",
  "paperclipai/paperclip",
  "block/buzz",
  "harbor-framework/terminal-bench-1",
  "10xapp/core-oss",
  "xgi-org/xgi",
  "pymovements/pymovements",
  "pangeo-data/pangeo-docker-images",
];

const OUT = path.join(process.cwd(), "content/contributions.json");

function gh(endpoint, jq) {
  const args = ["api", endpoint];
  if (jq) args.push("--jq", jq);
  return execFileSync("gh", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
}

function ghPaginate(endpoint, jq) {
  const out = execFileSync("gh", ["api", endpoint, "--paginate", "--jq", jq], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  return out
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function loadExistingBlurbs() {
  if (!fs.existsSync(OUT)) return {};
  try {
    const prev = JSON.parse(fs.readFileSync(OUT, "utf8"));
    return Object.fromEntries(
      (prev.repos ?? [])
        .filter((r) => r.blurb)
        .map((r) => [r.repo, r.blurb])
    );
  } catch {
    return {};
  }
}

function prState(item) {
  if (item.merged_at) return "merged";
  return item.state === "open" ? "open" : "closed";
}

function main() {
  const blurbs = loadExistingBlurbs();

  const query = `type:pr+author:${AUTHOR}+is:public`;
  const allPrs = ghPaginate(
    `search/issues?q=${query}&per_page=100`,
    ".items[] | {repo:(.repository_url|sub(\"https://api.github.com/repos/\";\"\")), number, title, url:.html_url, state, merged_at:.pull_request.merged_at, created_at}"
  );

  const repos = REPOS.map((name) => {
    const meta = JSON.parse(
      gh(
        `repos/${name}`,
        "{repo:.full_name, stars:.stargazers_count, language:.language, description:.description, url:.html_url}"
      )
    );

    const prs = allPrs
      .filter((p) => p.repo === name)
      .map((p) => ({
        number: p.number,
        title: p.title,
        url: p.url,
        state: prState(p),
        date: p.merged_at ?? p.created_at,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    if (prs.length === 0) {
      console.warn(`  warning: no public PRs found for ${name}`);
    }

    return {
      repo: meta.repo,
      url: meta.url,
      stars: meta.stars,
      language: meta.language ?? "Unknown",
      blurb: blurbs[meta.repo] ?? meta.description ?? "",
      latest: prs[0]?.date ?? null,
      prs,
    };
  }).sort((a, b) => b.stars - a.stars);

  const payload = {
    generatedAt: new Date().toISOString(),
    repos,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");

  const prCount = repos.reduce((n, r) => n + r.prs.length, 0);
  console.log(`Wrote ${repos.length} repos, ${prCount} pull requests to ${path.relative(process.cwd(), OUT)}`);
}

main();
