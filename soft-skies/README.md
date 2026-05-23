# soft skies ☁️

> A sky journal. Photograph the light, collect the colours.

Upload a photo of a sky — sunrise, sunset, golden hour — and the app extracts its colour palette, names the colours, and writes a poetic mood description.

---

## Quick start

### 1. Clone and install

```bash
git clone <your-repo-url> soft-skies
cd soft-skies
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

| Variable | Where to find it |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |
| `VITE_SUPABASE_URL` | Supabase project → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase project → Settings → API |

> **Note:** Supabase is optional for local development. Without it, the app saves entries to localStorage.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Database → SQL Editor** and paste the contents of `supabase-schema.sql`
3. Go to **Storage** → create a bucket named `sky-photos` (set to public)
4. Add your project URL and anon key to `.env`

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add your environment variables in the Vercel dashboard (Project → Settings → Environment Variables).

---

## Project structure

```
src/
├── components/
│   ├── Nav.tsx              # Sticky top nav
│   ├── UploadZone.tsx       # Drag-and-drop upload area
│   ├── LoadingState.tsx     # Processing indicator
│   ├── SkyReading.tsx       # Main result: photo + palette + mood
│   ├── SwatchCard.tsx       # Individual colour swatch (tap to copy hex)
│   ├── PaletteStrip.tsx     # Thin colour bar used everywhere
│   ├── JournalCard.tsx      # Grid card in the journal
│   └── ShareCard.tsx        # Social share card composer
├── pages/
│   ├── UploadPage.tsx       # Orchestrates the upload flow
│   ├── JournalPage.tsx      # The archive grid
│   └── EntryPage.tsx        # View a saved entry
├── hooks/
│   ├── useSkyProcessor.ts   # Pipeline: file → palette → reading
│   └── useJournal.ts        # Local-first journal storage
├── lib/
│   ├── colours.ts           # Vibrant.js palette extraction
│   ├── claude.ts            # Claude API for poetic readings
│   ├── supabase.ts          # Supabase client + storage helpers
│   └── types.ts             # All TypeScript types
└── styles/
    └── globals.css          # Tailwind + design tokens
```

---

## Production notes

- **Never expose `VITE_ANTHROPIC_API_KEY` in a public app.** For production, move the Claude API call to a Supabase Edge Function or a Vercel API route.
- The share card download uses `html2canvas`. For higher-quality exports, consider a Supabase Edge Function that renders the card server-side with Puppeteer.
- Supabase auth isn't wired up in this MVP. Add it with `supabase.auth.signInWithOtp({ email })` for magic-link login.

---

## Design

The app is designed to feel like a tiny art book — editorial, cinematic, minimal. Inspired by Are.na, Letterboxd, Pantone, and Wong Kar-wai colour palettes.

Typography: DM Serif Display (display) + DM Sans (body) + DM Mono (hex values)
