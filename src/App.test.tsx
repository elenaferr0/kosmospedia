import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders homepage title', () => {
    render(<App />);
    expect(screen.getByText(/welcome to kosmospedia/i)).toBeInTheDocument();
  });
});
