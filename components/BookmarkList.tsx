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
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-20 text-center dark:border-slate-700 dark:bg-slate-900/30">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-500 dark:bg-teal-500/20 dark:text-teal-400">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          No bookmarks yet. Add your first one above.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {bookmarks.map((bookmark) => (
        <li
          key={bookmark.id}
          className="group flex flex-col gap-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-teal-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-900/50 sm:flex-row sm:items-center sm:gap-4 sm:p-0"
        >
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 p-4 sm:p-5"
          >
            <span className="flex items-center gap-2 font-semibold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-slate-50 dark:group-hover:text-teal-400">
              {bookmark.title}
              <svg className="h-4 w-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
            <span className="mt-1 block truncate text-sm text-slate-500 dark:text-slate-400">
              {bookmark.url}
            </span>
          </a>
          <button
            onClick={() => handleDelete(bookmark.id)}
            type="button"
            className="shrink-0 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-400 dark:focus:ring-red-500 sm:self-center sm:mx-4"
            aria-label={`Delete ${bookmark.title}`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
