import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { ExitGamesPage } from './pages/ExitGamesPage';
import { AdventureGamesPage } from './pages/AdventureGamesPage';
import { NotFoundPage } from './pages/NotFoundPage';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
  ].join(' ');

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
            <p className="text-lg font-semibold">Kosmospedia</p>
            <nav className="flex items-center gap-2">
              <NavLink to="/" end className={navLinkClassName}>
                Exit Games
              </NavLink>
              <NavLink to="/adventure-games" className={navLinkClassName}>
                Adventure Games
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-8">
          <Routes>
            <Route path="/" element={<ExitGamesPage />} />
            <Route path="/exit-games" element={<ExitGamesPage />} />
            <Route path="/adventure-games" element={<AdventureGamesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
