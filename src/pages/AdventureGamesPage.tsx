import { GameTable } from '../components/GameTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import type { GameItem } from '../types/game';
import adventureGames from '../data/adventure-games.json';

const games = adventureGames as GameItem[];

export function AdventureGamesPage() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Adventure Games</CardTitle>
          <CardDescription>Loaded from `src/data/adventure-games.json`.</CardDescription>
        </CardHeader>
        <CardContent>
          <GameTable games={games} />
        </CardContent>
      </Card>
    </section>
  );
}