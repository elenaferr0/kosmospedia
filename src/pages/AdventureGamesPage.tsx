import { GameTable } from '../components/GameTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import type { GameItem } from '../types/game';
import adventureGames from '../data/adventure/adventure-games.json';

const games = adventureGames as GameItem[];

const rawAdventureImages = import.meta.glob('../data/adventure/*.{png,jpg,jpeg,webp,avif,gif,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const imageByKey = Object.entries(rawAdventureImages).reduce<Record<string, string>>((accumulator, [path, source]) => {
  const fileName = path.split('/').pop() ?? '';
  const key = fileName.replace(/\.[^.]+$/, '');
  accumulator[key] = source;
  return accumulator;
}, {});

export function AdventureGamesPage() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Adventure Games</CardTitle>
        </CardHeader>
        <CardContent>
          <GameTable games={games} imageByKey={imageByKey} />
        </CardContent>
      </Card>
    </section>
  );
}