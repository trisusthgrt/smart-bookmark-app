"use client";

import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/bookmark";

type BookmarkListProps = {
  bookmarks: Bookmark[];
  onDelete: () => void | Promise<void>;
};

export function BookmarkList({ bookmarks, onDelete }: BookmarkListProps) {
  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("bookmarks").delete().eq("id", id);
    await onDelete();
  };

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
        <svg
          className="mx-auto mb-3 h-12 w-12 text-zinc-400 dark:text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <p className="text-zinc-500 dark:text-zinc-400">
          No bookmarks yet. Add one above.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {bookmarks.map((bookmark) => (
        <li
          key={bookmark.id}
          className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group min-w-0 flex-1"
          >
            <span className="flex items-center gap-2 font-medium text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300">
              {bookmark.title}
              <svg
                className="h-4 w-4 shrink-0 opacity-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </span>
            <span className="mt-0.5 block truncate text-sm text-zinc-500 dark:text-zinc-400">
              {bookmark.url}
            </span>
          </a>
          <button
            onClick={() => handleDelete(bookmark.id)}
            type="button"
            className="shrink-0 self-start rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:text-red-400 dark:hover:bg-red-950 dark:focus:ring-red-500 sm:self-center"
            aria-label={`Delete ${bookmark.title}`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
