import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function HomePage() {
  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Kosmospedia</CardTitle>
          <CardDescription>
            A small shadcn-style React app that catalogs escape and adventure game entries from local JSON files.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/exit-games">
              Explore Exit Games <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/adventure-games">
              Explore Adventure Games <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
