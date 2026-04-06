# Kosmospedia

A fan-made catalogue of Kosmos' Exit and Adventure games.

**Disclaimer**: this project is not affiliated nor endorsed by Kosmos.

<img width="100px" alt="image" src="https://github.com/user-attachments/assets/16e8a8b2-b0ed-4488-b207-8fd9ecd964df" />

## Motivation

There appears to be no complete, searchable catalogue of Kosmos Exit games that also tracks translated titles across languages.
The most comprehensive source identified was https://boardgamegeek.com/thread/3354636/list-of-exit-games-in-order-of-release-current-as,
which became the main reference for this project.

Because some titles are adapted rather than translated literally from German, the same game can appear under different names.
Collecting language-specific titles makes it easier to discover and compare editions.

This catalogue is community-driven and may still contain gaps or mistakes (for example, typos or missing entries).
If you spot anything inaccurate, issues and PRs are very welcome.


## Pages

- `/#/` Exit games landing page
- `/#/adventure-games` Adventure games table

## JSON schema

To add data for Exit games, edit [this file](./src/data/exit/exit-games.json).

To add data for Adventure games, edit [this file](./src/data/adventure/adventure-games.json).

Images are named with the entry's key and are automatically loaded. Place them in [exit](./src/data/exit) or [adventure](./src/data/adventure/) folder.

Each entry in the category JSON files follows this shape:

- `key`: string (derived from English name, if exists)
- `name`: string (the English name, if exists)
- `releaseYear`: number
- `difficulty`: number from 1 to 5 (optional)
- `languages`: list of `{ language, translatedName }`