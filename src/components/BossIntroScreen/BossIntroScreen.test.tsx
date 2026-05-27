import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BossIntroScreen from './BossIntroScreen';
import { BOSS_1 } from '../../data/bosses';

test('renders boss name and tier badge', () => {
  render(<BossIntroScreen boss={BOSS_1} onPlayBall={() => {}} />);
  expect(screen.getByText(BOSS_1.name)).toBeInTheDocument();
  expect(screen.getByText(`Tier ${BOSS_1.tier}`)).toBeInTheDocument();
});

test('renders innings and target runs', () => {
  render(<BossIntroScreen boss={BOSS_1} onPlayBall={() => {}} />);
  expect(screen.getByText(`${BOSS_1.maxInnings}`)).toBeInTheDocument();
  expect(screen.getByText(`${BOSS_1.targetRuns}`)).toBeInTheDocument();
});

test('clicking Play Ball! calls onPlayBall', () => {
  const onPlayBall = jest.fn();
  render(<BossIntroScreen boss={BOSS_1} onPlayBall={onPlayBall} />);
  fireEvent.click(screen.getByText('Play Ball!'));
  expect(onPlayBall).toHaveBeenCalledTimes(1);
});
