import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('shows welcome modal on first load', () => {
  render(<App />);
  expect(screen.getByText(/welcome to baseball at cards/i)).toBeInTheDocument();
});
