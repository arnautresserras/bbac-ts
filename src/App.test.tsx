import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('shows menu screen on first load', () => {
  render(<App />);
  expect(screen.getByText('Baseball at Cards')).toBeInTheDocument();
  expect(screen.getByText('Begin Run')).toBeInTheDocument();
});

test('clicking Begin Run transitions to boss-intro screen', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Begin Run'));
  expect(screen.getByText('Play Ball!')).toBeInTheDocument();
});

test('clicking Play Ball transitions to in-game screen', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Begin Run'));
  fireEvent.click(screen.getByText('Play Ball!'));
  expect(screen.getByText(/Show Stats/)).toBeInTheDocument();
});
