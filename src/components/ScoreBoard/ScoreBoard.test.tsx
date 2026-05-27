import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreBoard from './ScoreBoard';

const baseProps = {
  balls: 1,
  strikes: 2,
  outs: 1,
  inning: 2,
  bases: [true, false, false],
  score: 1,
  pitcherStamina: 15,
  maxPitcherStamina: 20,
  bossName: "The Rookie",
  bossTier: 1 as const,
  maxInnings: 3,
  targetRuns: 2,
};

test('renders boss name and tier badge', () => {
  render(<ScoreBoard {...baseProps} />);
  expect(screen.getByText('The Rookie')).toBeInTheDocument();
  expect(screen.getByText('Tier 1')).toBeInTheDocument();
});

test('renders inning as current/max', () => {
  render(<ScoreBoard {...baseProps} />);
  expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
});

test('renders score as current/target', () => {
  render(<ScoreBoard {...baseProps} />);
  expect(screen.getByText('1 / 2')).toBeInTheDocument();
});

test('renders balls-strikes count', () => {
  render(<ScoreBoard {...baseProps} />);
  expect(screen.getByText('1 - 2')).toBeInTheDocument();
});

test('run progress fill width reflects score ratio', () => {
  const { container } = render(<ScoreBoard {...baseProps} score={1} targetRuns={2} />);
  const fill = container.querySelector('.run-progress-fill') as HTMLElement;
  expect(fill.style.width).toBe('50%');
});

test('run progress fill caps at 100% when score exceeds target', () => {
  const { container } = render(<ScoreBoard {...baseProps} score={5} targetRuns={2} />);
  const fill = container.querySelector('.run-progress-fill') as HTMLElement;
  expect(fill.style.width).toBe('100%');
});

test('tier badge color differs by tier', () => {
  const { container: c1 } = render(<ScoreBoard {...baseProps} bossTier={1} />);
  const { container: c3 } = render(<ScoreBoard {...baseProps} bossTier={3} />);
  const badge1 = c1.querySelector('.boss-tier-badge') as HTMLElement;
  const badge3 = c3.querySelector('.boss-tier-badge') as HTMLElement;
  expect(badge1.style.backgroundColor).not.toBe(badge3.style.backgroundColor);
});
