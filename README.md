# ExplainMyCode (Frontend)

Next.js 16 App Router frontend for ExplainMyCode. It now also hosts the API routes that mirror the Express backend.

## Requirements
- Node 18+
- Env vars in `.env` (or runtime):
  - `MONGODB_URL` – Mongo connection string
  - `GROQ_API_KEY` – for code/tut generation
  - `NEXT_PUBLIC_API_BASE` – point to this app's origin (or leave blank to use relative API calls)

## Install & run
```bash
pnpm install
pnpm dev    # http://localhost:3000
pnpm build  # production build
```

## API (via Next route handlers)
- `POST /api/explanations/generate` – generate explanation via Groq
- `POST /api/explanations/save` – save explanation (requires synced user)
- `GET  /api/explanations/user?uid=` – list user explanations
- `GET|PUT|DELETE /api/explanations/:id`
- `POST /api/explanations/learn` – generate tutorial
- `POST /api/explanations/learn/save` – save tutorial
- `GET  /api/explanations/learn/user?uid=` – list user tutorials
- `GET|DELETE /api/explanations/learn/:id`
- `POST /api/auth/sync-user` – ensure user exists by firebase uid/email

## Frontend pages
- `/` – landing + explain form
- `/history` – saved explanations/tutorials
- `/history/[id]` – detail view (works for both explanations and tutorials)
- `/learn` – tutorial generator

## Notes
- Uses Mongo via `mongoose` with a cached connection helper in `app/api/_lib/db.ts`.
- Monaco editor is used for code display.
- Fonts are pulled from Google; offline builds may need local fallbacks.
