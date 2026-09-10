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

/**
 * Blurbs come from each repo's own GitHub description - that's the project's
 * own marketing copy, not our reading of their code. Override only where that
 * description is useless; put the project's own words here, not a summary.
 */
const BLURB_OVERRIDES = {
  // GitHub description is literally "core-oss monorepo". This is their README's opening line.
  "10xapp/core-oss":
    "Open-source, all-in-one productivity platform. Email, calendar, chat, files, projects, in one app.",
};

const OUT = path.join(process.cwd(), "content/contributions.json");
const AVATAR_DIR = path.join(process.cwd(), "public/contributions");

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

function prState(item) {
  if (item.merged_at) return "merged";
  return item.state === "open" ? "open" : "closed";
}

/** Saves the org's avatar locally so the site never hotlinks GitHub. */
async function fetchAvatar(owner) {
  const file = `${owner}.png`;
  const res = await fetch(`https://github.com/${owner}.png?size=160`);
  if (!res.ok) {
    console.warn(`  warning: avatar fetch failed for ${owner} (${res.status})`);
    return null;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(AVATAR_DIR, { recursive: true });
  fs.writeFileSync(path.join(AVATAR_DIR, file), buf);
  return `/contributions/${file}`;
}

async function main() {
  const query = `type:pr+author:${AUTHOR}+is:public`;
  const allPrs = ghPaginate(
    `search/issues?q=${query}&per_page=100`,
    ".items[] | {repo:(.repository_url|sub(\"https://api.github.com/repos/\";\"\")), number, title, url:.html_url, state, merged_at:.pull_request.merged_at, created_at}"
  );

  const repos = [];
  for (const name of REPOS) {
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

    repos.push({
      repo: meta.repo,
      owner: meta.repo.split("/")[0],
      name: meta.repo.split("/")[1],
      url: meta.url,
      stars: meta.stars,
      language: meta.language ?? "Unknown",
      blurb: BLURB_OVERRIDES[meta.repo] ?? meta.description ?? "",
      avatar: await fetchAvatar(meta.repo.split("/")[0]),
      latest: prs[0]?.date ?? null,
      prs,
    });
  }

  repos.sort((a, b) => b.stars - a.stars);

  const payload = {
    generatedAt: new Date().toISOString(),
    repos,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");

  const prCount = repos.reduce((n, r) => n + r.prs.length, 0);
  console.log(`Wrote ${repos.length} repos, ${prCount} pull requests to ${path.relative(process.cwd(), OUT)}`);
}

await main();
