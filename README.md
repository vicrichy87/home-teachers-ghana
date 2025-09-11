Home Teachers Ghana - MVP (Code-only)

Contents:
- frontend/ : Expo React Native app (starter)
- backend/  : Supabase config + Edge Function templates
- assets/   : placeholder logo
- .gitignore

Quick start (Windows):
1. Install Node.js (v18+), Git, and Expo CLI: `npm install -g expo-cli`
2. In the frontend folder: `npm install` then `npx expo start`
3. Create a Supabase project and run the SQL in backend/schema.sql
4. Deploy Edge Functions with supabase CLI (see backend/README.md)

Notes:
- Replace SUPABASE URL/KEYs in frontend/lib/supabase.ts
- This package is code-only (no compiled binaries)
