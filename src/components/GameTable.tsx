import { useMemo, useState } from 'react';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import type { GameItem } from '../types/game';

type GameTableProps = {
  games: GameItem[];
  imageByKey?: Record<string, string>;
};

type SortColumn = 'image' | 'germanName' | 'releaseYear' | 'difficulty' | 'languages' | 'translations';
type SortDirection = 'asc' | 'desc';

const FLAG_BY_LANGUAGE: Record<string, string> = {
  german: '🇩🇪',
  english: '🇬🇧',
  french: '🇫🇷',
  spanish: '🇪🇸',
  italian: '🇮🇹',
  portuguese: '🇵🇹',
  japanese: '🇯🇵',
  polish: '🇵🇱',
  turkish: '🇹🇷',
};

function getLanguageFlag(language: string) {
  return FLAG_BY_LANGUAGE[language.toLowerCase()] ?? '🏳️';
}

export function GameTable({ games, imageByKey = {} }: GameTableProps) {
  const [nameFilter, setNameFilter] = useState('');
  const [releaseYearFilter, setReleaseYearFilter] = useState<'ALL' | 'UNKNOWN' | string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | GameItem['difficulty']>('ALL');
  const [languageFilter, setLanguageFilter] = useState<'ALL' | string>('ALL');
  const [translationFilter, setTranslationFilter] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('releaseYear');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const difficultyClassName: Record<GameItem['difficulty'], string> = {
    EASY: 'border-green-200 bg-green-100 text-green-800',
    MEDIUM: 'border-blue-200 bg-blue-100 text-blue-800',
    HARD: 'border-orange-200 bg-orange-100 text-orange-800',
    EXPERT: 'border-red-200 bg-red-100 text-red-800',
  };

  const difficultyRank: Record<GameItem['difficulty'], number> = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
    EXPERT: 4,
  };

  const filteredGames = useMemo(() => {
    const normalizedNameFilter = nameFilter.trim().toLowerCase();
    const normalizedTranslationFilter = translationFilter.trim().toLowerCase();

    return games.filter((game) => {
      if (normalizedNameFilter) {
        const nameHaystack = `${game.germanName} ${game.key}`.toLowerCase();
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

      if (difficultyFilter !== 'ALL' && game.difficulty !== difficultyFilter) {
        return false;
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
        case 'germanName':
          comparison = a.germanName.localeCompare(b.germanName);
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
          comparison = difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
          break;
        case 'languages': {
          const languagesA = a.languages.map((item) => item.language).join(', ');
          const languagesB = b.languages.map((item) => item.language).join(', ');
          comparison = languagesA.localeCompare(languagesB);
          break;
        }
        case 'translations': {
          const translationsA = a.languages.map((item) => `${item.language}:${item.translatedName}`).join(' | ');
          const translationsB = b.languages.map((item) => `${item.language}:${item.translatedName}`).join(' | ');
          comparison = translationsA.localeCompare(translationsB);
          break;
        }
      }

      if (comparison === 0) {
        comparison = a.germanName.localeCompare(b.germanName);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [difficultyRank, filteredGames, imageByKey, sortColumn, sortDirection]);

  const toggleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortColumn(column);
    setSortDirection(column === 'releaseYear' ? 'desc' : 'asc');
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
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">German name</span>
          <input
            type="text"
            value={nameFilter}
            onChange={(event) => setNameFilter(event.target.value)}
            placeholder="Name"
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Release year</span>
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
            onChange={(event) => setDifficultyFilter(event.target.value as 'ALL' | GameItem['difficulty'])}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="ALL">All</option>
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
            <option value="EXPERT">EXPERT</option>
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
            <TableHead className="w-20">
              <button type="button" onClick={() => toggleSort('image')} className="inline-flex items-center gap-1 font-medium">
                Image <span className="text-xs text-muted-foreground">{sortIndicator('image')}</span>
              </button>
            </TableHead>
            <TableHead className="min-w-[16rem] w-[20rem]">
              <button
                type="button"
                onClick={() => toggleSort('germanName')}
                className="inline-flex items-center gap-1 font-medium"
              >
                German name <span className="text-xs text-muted-foreground">{sortIndicator('germanName')}</span>
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                onClick={() => toggleSort('releaseYear')}
                className="inline-flex items-center gap-1 font-medium"
              >
                Release year <span className="text-xs text-muted-foreground">{sortIndicator('releaseYear')}</span>
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
                onClick={() => toggleSort('languages')}
                className="inline-flex items-center gap-1 font-medium"
              >
                Languages <span className="text-xs text-muted-foreground">{sortIndicator('languages')}</span>
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
                      alt={game.germanName}
                      className="h-14 w-14 rounded-md object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="min-w-[16rem] w-[20rem] font-medium">
                  <div>{game.germanName}</div>
                </TableCell>
                <TableCell>{game.releaseYear ?? 'Unknown'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={difficultyClassName[game.difficulty]}>
                    {game.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {game.languages.map((item) => (
                      <Badge key={`${game.key}-${item.language}`} variant="secondary">
                        {getLanguageFlag(item.language)} {item.language}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {game.languages.map((item) => (
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
