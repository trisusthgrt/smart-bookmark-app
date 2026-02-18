"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookmarkForm } from "@/components/BookmarkForm";
import { BookmarkList } from "@/components/BookmarkList";
import type { Bookmark } from "@/types/bookmark";

type BookmarksClientProps = {
  userId: string;
  initialBookmarks: Bookmark[];
};

export function BookmarksClient({
  userId,
  initialBookmarks,
}: BookmarksClientProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          setBookmarks((prev) => [newBookmark, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          const oldId = (payload.old as { id: string }).id;
          setBookmarks((prev) => prev.filter((b) => b.id !== oldId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const refreshBookmarks = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setBookmarks(data as Bookmark[]);
  }, [userId]);

  return (
    <div className="space-y-10">
      <BookmarkForm userId={userId} onAdd={refreshBookmarks} />
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-600 dark:bg-teal-500/30 dark:text-teal-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </span>
          Your bookmarks
        </h2>
        <BookmarkList bookmarks={bookmarks} onDelete={refreshBookmarks} />
      </section>
    </div>
  );
}
