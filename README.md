# Smart Bookmark App

A bookmark manager that lets you save and organize URLs with real-time sync across tabs. Sign in with Google, add bookmarks, and access them from anywhere.

## Features

- **Google OAuth** – Sign in with Google only (no email/password)
- **Add bookmarks** – Save URLs with custom titles
- **Private per user** – Row Level Security ensures User A cannot see User B's bookmarks
- **Realtime updates** – Add a bookmark in one tab, see it appear in another without refresh
- **Delete bookmarks** – Remove your own bookmarks anytime

## Tech Stack

- **Next.js 16** (App Router)
- **Supabase** (Auth, PostgreSQL, Realtime)
- **Tailwind CSS** (styling)
- **TypeScript**

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/trisusthgrt/smart-bookmark-app.git
   cd smart-bookmark-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

### Supabase Setup

- Create a `bookmarks` table with: `id`, `user_id`, `url`, `title`, `created_at`
- Enable Row Level Security and add policies for SELECT, INSERT, DELETE (filter by `auth.uid() = user_id`)
- Add `bookmarks` to the `supabase_realtime` publication
- Configure Google OAuth in Supabase Auth → Providers → Google

## Deploy on Vercel

### 1. Push to GitHub

Ensure your latest code is pushed:

```bash
cd smart-bookmark-app
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Import project in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub).
2. Click **Add New…** → **Project**.
3. Import `trisusthgrt/smart-bookmark-app` from GitHub.
4. Leave **Framework Preset** as Next.js (auto-detected).
5. **Root Directory:** leave as `.` (or `smart-bookmark-app` if importing from a monorepo root).

### 3. Set environment variables

Before deploying, add these in Vercel (Project → Settings → Environment Variables):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon (public) key |

### 4. Deploy

Click **Deploy**. Wait for the build to finish.

### 5. Configure Supabase for production

After the first deploy, you'll get a URL like `https://smart-bookmark-app-xxx.vercel.app`.

1. **Supabase Auth → URL Configuration**
   - **Site URL:** `https://your-vercel-url.vercel.app`
   - **Redirect URLs:** add `https://your-vercel-url.vercel.app/auth/callback`

2. **Google Cloud Console → Credentials → OAuth client**
   - **Authorized JavaScript origins:** add `https://your-vercel-url.vercel.app`
   - **Authorized redirect URIs:** Supabase's callback (`https://<project>.supabase.co/auth/v1/callback`) should already be there—no change needed for your app domain.

### 6. Redeploy (if env vars were added after first deploy)

If you added env vars after the first deploy, go to **Deployments** → **⋮** on the latest deployment → **Redeploy**.

### 7. Test

1. Open the Vercel URL in an incognito window.
2. Sign in with Google.
3. Add and delete bookmarks.
4. Open another tab and confirm realtime updates.

## Links

- **Live URL:** [Add your Vercel URL here]
- **GitHub:** https://github.com/trisusthgrt/smart-bookmark-app

---

## Problems & Solutions

### 1. Error 400: redirect_uri_mismatch (Google OAuth)

**Problem:** After clicking "Sign in with Google", the page showed "Access blocked: This app's request is invalid" with `Error 400: redirect_uri_mismatch`.

**Solution:** Google redirects to **Supabase's callback URL**, not your app's `/auth/callback`. Add this exact URL to Google Cloud Console → Credentials → OAuth client → Authorized redirect URIs:

```
https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
```

Do *not* add `http://localhost:3000/auth/callback` to Google—that's where Supabase redirects the user *after* handling the OAuth code.

---

### 2. Realtime not working (0 tables in publication)

**Problem:** The `supabase_realtime` publication showed "0 tables", so bookmark changes didn't sync across tabs.

**Solution:** Add the `bookmarks` table to the Realtime publication. Either use the Supabase UI (Database → Publications → `supabase_realtime` → add table) or run:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
```

---

### 3. DELETE policy showed UPDATE template

**Problem:** When creating the third RLS policy (delete), the Supabase UI showed an UPDATE template with `USING` and `WITH CHECK` fields.

**Solution:** Change the action from `UPDATE` to `DELETE`. For DELETE policies, only `USING` is needed (to define which rows can be deleted). Set `USING` to `auth.uid() = user_id` and leave `WITH CHECK` empty.

---

### 4. Nested Git repos and "nothing to commit"

**Problem:** Running `git status` in the parent folder showed "Changes not staged for commit" for `smart-bookmark-app` (modified/untracked content), but the parent only tracks it as a gitlink, not the actual files.

**Solution:** The real code lives in `smart-bookmark-app/`, which has its own `.git`. Use the inner repo as the main project: `cd smart-bookmark-app`, add the GitHub remote, and push from there. The parent folder was redundant for this setup.

---

### 5. Git push rejected (remote has work you don't have)

**Problem:** `git push -u origin main` failed with "Updates were rejected because the remote contains work that you do not have locally."

**Solution:** The GitHub repo was created with a README or license, so the remote had an initial commit. Either:

- **Merge:** `git pull origin main --allow-unrelated-histories` then `git push -u origin main`
- **Overwrite:** `git push -u origin main --force` (only if you're sure the remote content can be discarded)

---

### 6. Sign in with Google button – text/logo invisible on hover

**Problem:** On hover, the Google "G" logo and "Sign in with Google" text turned white and became invisible against the light button background.

**Solution:** Add explicit hover text colors so they don't get overridden: `hover:text-slate-900` (light mode) and `dark:hover:text-slate-50` (dark mode) on the button. The SVG uses `fill="currentColor"`, so it inherits the text color and stays visible.
