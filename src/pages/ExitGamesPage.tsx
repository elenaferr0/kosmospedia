import { GameTable } from '../components/GameTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import type { GameItem } from '../types/game';
import exitGames from '../data/exit-games.json';

const games = exitGames as GameItem[];

export function ExitGamesPage() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Exit Games</CardTitle>
          <CardDescription>Loaded from `src/data/exit-games.json`.</CardDescription>
        </CardHeader>
        <CardContent>
          <GameTable games={games} />
        </CardContent>
      </Card>
    </section>
  );
}
