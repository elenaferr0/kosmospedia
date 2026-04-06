import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders Exit Games as the default landing page with nav links', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /exit games/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /exit games/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /adventure games/i })).toBeInTheDocument();
  });
});
