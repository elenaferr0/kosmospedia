import { GameTable } from '../components/GameTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import type { GameItem } from '../types/game';
import exitGames from '../data/exit/exit-games.json';

const games = exitGames as GameItem[];

const rawExitImages = import.meta.glob('../data/exit/*.{png,jpg,jpeg,webp,avif,gif,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const imageByKey = Object.entries(rawExitImages).reduce<Record<string, string>>((accumulator, [path, source]) => {
  const fileName = path.split('/').pop() ?? '';
  const key = fileName.replace(/\.[^.]+$/, '');
  accumulator[key] = source;
  return accumulator;
}, {});

export function ExitGamesPage() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Exit Games</CardTitle>
        </CardHeader>
        <CardContent>
          <GameTable games={games} imageByKey={imageByKey} />
        </CardContent>
      </Card>
    </section>
  );
}
