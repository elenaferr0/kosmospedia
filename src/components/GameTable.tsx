import { useMemo, useState } from 'react';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import type { GameItem } from '../types/game';

type GameTableProps = {
  games: GameItem[];
  imageByKey?: Record<string, string>;
};

type SortColumn = 'image' | 'name' | 'releaseYear' | 'difficulty' | 'translations';
type SortDirection = 'asc' | 'desc';

const FLAG_BY_LANGUAGE: Record<string, string> = {
  danish: '🇩🇰',
  dutch : '🇳🇱',
  english: '🇬🇧',
  french: '🇫🇷',
  german: '🇩🇪',
  italian: '🇮🇹',
  lithuanian: '🇱🇹',
  portuguese: '🇵🇹',
  romanian: '🇷🇴',
  polish: '🇵🇱',
  spanish: '🇪🇸',
  swedish: '🇸🇪',
};

function getLanguageFlag(language: string) {
  return FLAG_BY_LANGUAGE[language.toLowerCase()] ?? '🏳️';
}

function normalizeDifficulty(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = Number.parseFloat(value.trim());
    return Number.isFinite(normalized) ? normalized : null;
  }

  return null;
}

function getDifficultyClassName(difficulty: number | null) {
  if (difficulty === null) {
    return 'border-muted bg-muted text-muted-foreground';
  }

  if (difficulty <= 2.5) {
    return 'border-green-200 bg-green-100 text-green-800';
  }

  if (difficulty <= 3.5) {
    return 'border-blue-200 bg-blue-100 text-blue-800';
  }

  if (difficulty <= 4.5) {
    return 'border-orange-200 bg-orange-100 text-orange-800';
  }

  return 'border-red-200 bg-red-100 text-red-800';
}

export function GameTable({ games, imageByKey = {} }: GameTableProps) {
  const [nameFilter, setNameFilter] = useState('');
  const [releaseYearFilter, setReleaseYearFilter] = useState<'ALL' | 'UNKNOWN' | string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'UNKNOWN' | string>('ALL');
  const [languageFilter, setLanguageFilter] = useState<'ALL' | string>('ALL');
  const [translationFilter, setTranslationFilter] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('releaseYear');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const availableLanguages = useMemo(
    () => Array.from(new Set(games.flatMap((game) => game.languages.map((item) => item.language)))).sort((a, b) => a.localeCompare(b)),
    [games]
  );

  const availableYears = useMemo(
    () =>
      Array.from(new Set(games.map((game) => game.releaseYear).filter((year): year is number => year !== undefined))).sort(
        (a, b) => b - a
      ),
    [games]
  );

  const availableDifficulties = useMemo(
    () =>
      Array.from(
        new Set(
          games
            .map((game) => normalizeDifficulty((game as { difficulty: unknown }).difficulty))
            .filter((difficulty): difficulty is number => difficulty !== null)
        )
      ).sort((a, b) => a - b),
    [games]
  );

  const filteredGames = useMemo(() => {
    const normalizedNameFilter = nameFilter.trim().toLowerCase();
    const normalizedTranslationFilter = translationFilter.trim().toLowerCase();

    return games.filter((game) => {
      if (normalizedNameFilter) {
  const nameHaystack = `${game.name} ${game.key}`.toLowerCase();
        if (!nameHaystack.includes(normalizedNameFilter)) {
          return false;
        }
      }

      if (releaseYearFilter !== 'ALL') {
        if (releaseYearFilter === 'UNKNOWN' && game.releaseYear !== undefined) {
          return false;
        }

        if (releaseYearFilter !== 'UNKNOWN' && game.releaseYear?.toString() !== releaseYearFilter) {
          return false;
        }
      }

      if (difficultyFilter !== 'ALL') {
        const difficulty = normalizeDifficulty((game as { difficulty: unknown }).difficulty);

        if (difficultyFilter === 'UNKNOWN') {
          if (difficulty !== null) {
            return false;
          }
        } else if (difficulty?.toString() !== difficultyFilter) {
          return false;
        }
      }

      if (languageFilter !== 'ALL') {
        const hasLanguageMatch = game.languages.some((item) => item.language === languageFilter);
        if (!hasLanguageMatch) {
          return false;
        }
      }

      if (normalizedTranslationFilter) {
        const hasTranslationMatch = game.languages.some((item) =>
          item.translatedName.toLowerCase().includes(normalizedTranslationFilter)
        );
        if (!hasTranslationMatch) {
          return false;
        }
      }

      return true;
    });
  }, [difficultyFilter, games, languageFilter, nameFilter, releaseYearFilter, translationFilter]);

  const sortedGames = useMemo(() => {
    return [...filteredGames].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case 'image': {
          const imageA = imageByKey[a.key] ? 1 : 0;
          const imageB = imageByKey[b.key] ? 1 : 0;
          comparison = imageA - imageB;
          break;
        }
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'releaseYear': {
          const yearA = a.releaseYear;
          const yearB = b.releaseYear;

          if (yearA === undefined && yearB === undefined) {
            comparison = 0;
          } else if (yearA === undefined) {
            comparison = 1;
          } else if (yearB === undefined) {
            comparison = -1;
          } else {
            comparison = yearA - yearB;
          }
          break;
        }
        case 'difficulty':
          {
            const difficultyA = normalizeDifficulty((a as { difficulty: unknown }).difficulty);
            const difficultyB = normalizeDifficulty((b as { difficulty: unknown }).difficulty);

            if (difficultyA === null && difficultyB === null) {
              comparison = 0;
            } else if (difficultyA === null) {
              comparison = 1;
            } else if (difficultyB === null) {
              comparison = -1;
            } else {
              comparison = difficultyA - difficultyB;
            }
          }
          break;
        case 'translations': {
          const translationsA = a.languages.map((item) => `${item.language}:${item.translatedName}`).join(' | ');
          const translationsB = b.languages.map((item) => `${item.language}:${item.translatedName}`).join(' | ');
          comparison = translationsA.localeCompare(translationsB);
          break;
        }
      }

      if (comparison === 0) {
  comparison = a.name.localeCompare(b.name);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredGames, imageByKey, sortColumn, sortDirection]);

  const toggleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortColumn(column);
    setSortDirection('asc');
  };

  const sortIndicator = (column: SortColumn) => {
    if (sortColumn !== column) {
      return '↕';
    }

    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</span>
          <input
            type="text"
            value={nameFilter}
            onChange={(event) => setNameFilter(event.target.value)}
            placeholder="Name"
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Publication date</span>
          <select
            value={releaseYearFilter}
            onChange={(event) => setReleaseYearFilter(event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="ALL">All</option>
            <option value="UNKNOWN">Unknown</option>
            {availableYears.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Difficulty</span>
          <select
            value={difficultyFilter}
            onChange={(event) => setDifficultyFilter(event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="ALL">All</option>
            <option value="UNKNOWN">Unknown</option>
            {availableDifficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty.toString()}>
                {difficulty}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Languages</span>
          <select
            value={languageFilter}
            onChange={(event) => setLanguageFilter(event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="ALL">All</option>
            {availableLanguages.map((language) => (
              <option key={language} value={language}>
                {getLanguageFlag(language)} {language}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Translated names</span>
          <input
            type="text"
            value={translationFilter}
            onChange={(event) => setTranslationFilter(event.target.value)}
            placeholder="Filter translation"
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>

      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">
              <button type="button" onClick={() => toggleSort('image')} className="inline-flex items-center gap-1 font-medium">
                Image <span className="text-xs text-muted-foreground">{sortIndicator('image')}</span>
              </button>
            </TableHead>
            <TableHead className="min-w-[16rem] w-[20rem]">
              <button
                type="button"
                onClick={() => toggleSort('name')}
                className="inline-flex items-center gap-1 font-medium"
              >
                Name <span className="text-xs text-muted-foreground">{sortIndicator('name')}</span>
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                onClick={() => toggleSort('releaseYear')}
                className="inline-flex items-center gap-1 font-medium"
              >
                Publication date <span className="text-xs text-muted-foreground">{sortIndicator('releaseYear')}</span>
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                onClick={() => toggleSort('difficulty')}
                className="inline-flex items-center gap-1 font-medium"
              >
                Difficulty <span className="text-xs text-muted-foreground">{sortIndicator('difficulty')}</span>
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                onClick={() => toggleSort('translations')}
                className="inline-flex items-center gap-1 font-medium"
              >
                Translated names <span className="text-xs text-muted-foreground">{sortIndicator('translations')}</span>
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedGames.map((game) => {
            const imageSrc = imageByKey[game.key];

            return (
              <TableRow key={game.key}>
                <TableCell>
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={game.name}
                      className="h-24 w-24 rounded-md object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="min-w-[16rem] w-[20rem] font-medium">
                  <div>{game.name}</div>
                </TableCell>
                <TableCell>{game.releaseYear ?? 'Unknown'}</TableCell>
                <TableCell>
                  {(() => {
                    const difficulty = normalizeDifficulty((game as { difficulty: unknown }).difficulty);
                    return (
                      <Badge variant="outline" className={getDifficultyClassName(difficulty)}>
                        {difficulty ?? 'Unknown'}
                      </Badge>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {game.languages
                      .filter((item) => languageFilter === 'ALL' || item.language === languageFilter)
                      .map((item) => (
                      <Badge key={`${game.key}-${item.language}-translated`} variant="outline" className="max-w-xs">
                        <span className="truncate" title={`${item.language}: ${item.translatedName}`}>
                          {getLanguageFlag(item.language)} {item.language}: {item.translatedName}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <p className="text-sm text-muted-foreground">
        Showing {sortedGames.length} of {games.length} entries.
      </p>
    </div>
  );
}
