import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthNav } from "@/components/AuthNav";
import { BookmarksClient } from "@/components/BookmarksClient";
import type { Bookmark } from "@/types/bookmark";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AuthNav userEmail={user.email ?? "User"} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <BookmarksClient
          userId={user.id}
          initialBookmarks={(bookmarks ?? []) as Bookmark[]}
        />
      </main>
    </div>
  );
}
