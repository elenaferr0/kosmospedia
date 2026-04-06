import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import type { GameItem } from '../types/game';

type GameTableProps = {
  games: GameItem[];
};

export function GameTable({ games }: GameTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Key</TableHead>
          <TableHead>English name</TableHead>
          <TableHead>Release year</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Languages</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow key={game.key}>
            <TableCell className="font-mono text-xs">{game.key}</TableCell>
            <TableCell className="font-medium">{game.englishName}</TableCell>
            <TableCell>{game.releaseYear ?? 'Unknown'}</TableCell>
            <TableCell>
              <Badge variant="secondary">{game.difficulty}</Badge>
            </TableCell>
            <TableCell>
              <ul className="space-y-1">
                {game.languages.map((item) => (
                  <li key={`${game.key}-${item.language}`} className="text-sm">
                    <span className="font-medium">{item.language}:</span> {item.translatedName}
                  </li>
                ))}
              </ul>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
