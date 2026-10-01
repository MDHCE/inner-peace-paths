# Zuglói Pszichológiai Központ & Gellérthegyi Rendelő

One React/Vite app serving two clinic sites from a shared Express API:

| Site | Path | API prefix |
|------|------|------------|
| Zuglói Pszichológiai Központ | `/` | `/api` |
| Gellérthegyi Rendelő | `/gellert/` | `/api/gellert` |

Colleagues live in a single `data/therapists.json`; the `sites` array on each
entry (`"zuglo"`, `"gellert"`) decides which site shows them.

## Admin

The content editor is at `/admin` (Zugló) and `/gellert/admin` (Gellérthegyi).
Both are password-protected, as is every `/api/admin/*` endpoint.

### Setting the password

```bash
node scripts/hash-admin-password.mjs 'a-long-password-you-choose'
```

Put the printed `ADMIN_PASSWORD_HASH=...` line into `.env` locally, and into the
environment variables of the production host. Set `ADMIN_USER` too if you want
something other than `admin`. The plain password is never stored — only the
scrypt hash, so the `.env` file leaking does not hand over the password.

Visiting the admin then produces the browser's own username/password dialog.
Signing in sets a 12-hour session cookie; `/admin/logout` ends it.

**Without `ADMIN_PASSWORD_HASH` set, the admin is locked in production** (it
fails closed rather than open). The public site keeps serving normally. Locally
— `npm run server` without `NODE_ENV=production` — the admin stays open for
convenience.

A reverse proxy that injects `x-forwarded-user` (Cloudflare Access, Pomerium)
also counts as signed in, so adding one later needs no code change.

## Content persistence

Admin edits are written to JSON files in `DATA_DIR`. **That directory must be a
mounted volume in production**, or every redeploy silently reverts the site to
whatever is committed in git.

The Docker image sets this up:

- `DATA_DIR=/app/data` — mount the volume here
- `SEED_DIR=/app/data-seed` — the committed defaults baked into the image

On boot, any file missing from `DATA_DIR` is copied from `SEED_DIR`, so a brand
new empty volume comes up with the current content rather than an empty site.
Existing files are never overwritten, so your edits survive redeploys.

```bash
docker run -v rendelo-data:/app/data --env-file .env -p 3001:3001 <image>
```

Writes go through a temp file and an atomic rename, so an interrupted write
cannot leave an unparseable JSON file behind.

To pull production content back into git: copy the files out of the volume into
`data/` and commit.

## Development

```bash
npm install
npm run dev          # Zugló site (Vite dev server)
npm run dev:gellert  # Gellérthegyi site
npm run server       # Express API + built SPA on :3001
npm run build
npm test
npm run lint
```

Copy `.env.example` to `.env` first. `.env` is gitignored and must stay that way.
