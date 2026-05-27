import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RunEndScreen from './RunEndScreen';

test('win variant shows correct message and Play Again button', () => {
  render(<RunEndScreen won={true} onPlayAgain={() => {}} />);
  expect(screen.getByText('You did it!')).toBeInTheDocument();
  expect(screen.getByText('You defeated all 4 bosses!')).toBeInTheDocument();
  expect(screen.getByText('Play Again')).toBeInTheDocument();
});

test('loss variant shows Try Again button', () => {
  render(<RunEndScreen won={false} onPlayAgain={() => {}} />);
  expect(screen.getByText('Run over')).toBeInTheDocument();
  expect(screen.getByText('Try Again')).toBeInTheDocument();
});

test('loss variant shows boss name and tier', () => {
  render(<RunEndScreen won={false} bossName="The Rookie" bossTier={1} onPlayAgain={() => {}} />);
  expect(screen.getByText('The Rookie')).toBeInTheDocument();
  expect(screen.getByText(/Tier 1/)).toBeInTheDocument();
});

test('clicking Play Again calls onPlayAgain', () => {
  const onPlayAgain = jest.fn();
  render(<RunEndScreen won={true} onPlayAgain={onPlayAgain} />);
  fireEvent.click(screen.getByText('Play Again'));
  expect(onPlayAgain).toHaveBeenCalledTimes(1);
});

test('clicking Try Again calls onPlayAgain', () => {
  const onPlayAgain = jest.fn();
  render(<RunEndScreen won={false} onPlayAgain={onPlayAgain} />);
  fireEvent.click(screen.getByText('Try Again'));
  expect(onPlayAgain).toHaveBeenCalledTimes(1);
});
