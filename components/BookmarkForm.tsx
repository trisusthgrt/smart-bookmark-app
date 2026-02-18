"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type BookmarkFormProps = {
  userId: string;
  onAdd: () => void | Promise<void>;
};

export function BookmarkForm({ userId, onAdd }: BookmarkFormProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    const trimmedTitle = title.trim();

    if (!trimmedUrl || !trimmedTitle) {
      setError("URL and title are required");
      return;
    }

    try {
      const fullUrl = trimmedUrl.startsWith("http")
        ? trimmedUrl
        : `https://${trimmedUrl}`;

      setIsLoading(true);
      const supabase = createClient();

      const { error: insertError } = await supabase.from("bookmarks").insert({
        user_id: userId,
        url: fullUrl,
        title: trimmedTitle,
      });

      if (insertError) throw insertError;

      setUrl("");
      setTitle("");
      await onAdd();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add bookmark");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50 dark:border-slate-700/50 dark:bg-slate-900 dark:shadow-none"
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 px-6 py-4 dark:border-slate-800 dark:from-teal-500/20 dark:to-cyan-500/20">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </span>
          Add new bookmark
        </h2>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. React Docs"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:border-teal-400 dark:focus:bg-slate-800 dark:focus:ring-teal-400/20"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="url" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:border-teal-400 dark:focus:bg-slate-800 dark:focus:ring-teal-400/20"
            disabled={isLoading}
          />
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-teal-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-teal-500/30 transition-all hover:bg-teal-600 hover:shadow-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 dark:shadow-teal-500/20 dark:hover:shadow-teal-500/30"
        >
          {isLoading ? "Adding…" : "Add bookmark"}
        </button>
      </div>
    </form>
  );
}
