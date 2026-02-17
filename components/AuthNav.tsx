"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type AuthNavProps = {
  userEmail: string;
};

export function AuthNav({ userEmail }: AuthNavProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.replace("/login");
  };

  return (
    <nav className="flex flex-col gap-3 border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Smart Bookmark App
      </h1>
      <div className="flex items-center gap-3 sm:gap-4">
        <span
          className="min-w-0 flex-1 truncate text-sm text-zinc-600 dark:text-zinc-400 sm:max-w-[200px]"
          title={userEmail}
        >
          {userEmail}
        </span>
        <button
          onClick={handleSignOut}
          className="shrink-0 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus:ring-zinc-500"
          type="button"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
