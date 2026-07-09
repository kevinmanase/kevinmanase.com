"use client";

import { format } from "date-fns";

interface ChangelogEntry {
  version: string;
  date: string;
  summary: string;
}

interface VersionHistoryProps {
  created?: string;
  updated?: string;
  changelog?: ChangelogEntry[];
}

function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMM d, yyyy");
}

export function VersionHistory({ created, updated, changelog }: VersionHistoryProps) {
  const hasUpdates = updated && updated !== created;
  const hasChangelog = changelog && changelog.length > 0;

  if (!hasUpdates && !hasChangelog) return null;

  return (
    <div className="mb-8 p-4 rounded-sm bg-panel border border-rule">
      <div className="flex items-center gap-3 text-sm text-dim">
        {created && <span>Created {formatDate(created)}</span>}
        {hasUpdates && (
          <>
            <span className="text-faint">&middot;</span>
            <span>Updated {formatDate(updated)}</span>
          </>
        )}
      </div>

      {hasChangelog && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-faint hover:text-blue transition-colors">
            Version history
          </summary>
          <ul className="mt-3 space-y-2">
            {changelog.map((entry) => (
              <li key={entry.version} className="flex items-start gap-3">
                <span className="text-xs text-faint bg-paper border border-rule px-1.5 py-0.5 rounded-sm">
                  v{entry.version}
                </span>
                <span className="text-dim">
                  {entry.summary}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
