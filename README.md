# Kosmospedia

Simple React + TypeScript web app with shadcn-style UI components.

## Pages

- `/` Home page
- `/exit-games` Exit games table (source: `src/data/exit-games.json`)
- `/adventure-games` Adventure games table (source: `src/data/adventure-games.json`)

## JSON schema

Each entry in the category JSON files follows this shape:

- `key`: string (derived from English name)
- `englishName`: string
- `releaseYear`: number (optional)
- `difficulty`: `EASY | MEDIUM | HARD | EXPERT`
- `languages`: list of `{ language, translatedName }`

## Scripts

- `npm start` or `npm run dev` – run development server
- `npm run build` – type-check and build
- `npm run test` – run unit tests

## Notes

- UI primitives are in `src/components/ui`.
- Styling uses Tailwind with shadcn-compatible design tokens.
