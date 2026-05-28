import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RunStartScreen from './RunStartScreen';
import { AVERAGE_JOE } from '../../data/playerArchetypes';

const nineAverageJoes = Array(9).fill(AVERAGE_JOE);

test('renders game title', () => {
  render(<RunStartScreen roster={nineAverageJoes} onBeginRun={() => {}} onBack={() => {}} />);
  expect(screen.getByText('Baseball at Cards')).toBeInTheDocument();
});

test('renders all 9 roster players', () => {
  render(<RunStartScreen roster={nineAverageJoes} onBeginRun={() => {}} onBack={() => {}} />);
  expect(screen.getAllByText('Average Joe')).toHaveLength(9);
});

test('clicking Begin Run calls onBeginRun', () => {
  const onBeginRun = jest.fn();
  render(<RunStartScreen roster={nineAverageJoes} onBeginRun={onBeginRun} onBack={() => {}} />);
  fireEvent.click(screen.getByText('Begin Run'));
  expect(onBeginRun).toHaveBeenCalledTimes(1);
});
