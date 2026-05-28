import { CardName } from "../types/cardName";

export interface CardDescription {
  short: string;
  detail: string;
}

export const CARD_DESCRIPTIONS: Record<CardName, CardDescription> = {
  "Ball": {
    short: "Pitcher misses the zone. 4 balls = walk.",
    detail: "The pitcher throws outside the strike zone. After 4 balls in a single at-bat, the batter earns a free walk to first base. Each ball also drains the pitcher's stamina.",
  },
  "Strike": {
    short: "Pitcher hits the zone. 3 strikes = strikeout.",
    detail: "The pitcher throws in the strike zone. After 3 strikes, the batter is out — good for the pitcher. Each strike also drains pitcher stamina.",
  },
  "Swing": {
    short: "Batter swings. Hit or out — depends on stamina.",
    detail: "The batter takes a swing. Whether it's a hit or an out depends on the pitcher's remaining stamina — a tired pitcher is more likely to give up a hit.",
  },
  "Foul": {
    short: "Tip off the bat. Adds a strike (capped at 2). Last card = redraw.",
    detail: "The batter fouls the ball off. It adds a strike but can never cause a strikeout — the count caps at 2. If it's the last card in your hand, the entire hand is redrawn instead of ending the turn.",
  },
  "Single": {
    short: "Base hit! All runners advance one base.",
    detail: "The batter gets a clean hit and reaches first base safely. Every runner already on base moves forward exactly one base, potentially scoring a run if someone was on third.",
  },
  "Home run": {
    short: "Ball over the fence. All runners score!",
    detail: "The batter drives the ball out of the park. Every runner on base scores, plus the batter themselves — a massive scoring opportunity. It also drains the pitcher's stamina by 4 instead of 1.",
  },
  "Out": {
    short: "Batter is retired. 3 outs ends the inning.",
    detail: "The batter is out. Three outs in a row ends the inning and resets all base runners and the ball/strike count.",
  },
  "Hit by pitch": {
    short: "Pitcher hits the batter. Free walk to first base.",
    detail: "The pitch accidentally hits the batter, who gets a free walk to first base — no ball count needed. A lucky break that advances the batting team with zero stamina cost to the pitcher.",
  },
  "Wild pitch": {
    short: "Pitcher loses control. Runners advance + ball added.",
    detail: "The pitch flies past the catcher completely out of control. All base runners advance one base (a huge opportunity for the batting team), and a ball is added to the count. If it was already ball 3, the batter walks too.",
  },
};
