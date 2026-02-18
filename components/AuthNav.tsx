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
    <nav className="sticky top-0 z-10 flex flex-col gap-3 border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </span>
        Smart Bookmark
      </h1>
      <div className="flex items-center gap-3 sm:gap-4">
        <span
          className="min-w-0 flex-1 truncate rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400 sm:max-w-[220px]"
          title={userEmail}
        >
          {userEmail}
        </span>
        <button
          onClick={handleSignOut}
          className="shrink-0 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-teal-400"
          type="button"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
