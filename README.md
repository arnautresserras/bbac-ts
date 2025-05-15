# Baseball at Cards ⚾🃏

A lightweight, card-driven baseball simulator built with React and TypeScript. Play 3 innings of baseball using strategic cards, tracking your lineup's performance along the way.

## 🎮 How to Play

1. **Start the Game** – Click **Start** on the welcome modal to begin a 3-inning game.
2. **Play Cards** – You'll draw 6 cards per turn. Each represents a baseball action:
   - **Ball**: Adds a ball to the count.
   - **Strike**: Adds a strike to the count.
   - **Swing**: A chance at a hit or an out, depending on pitcher stamina.
   - **Home Run**: Clears the bases and scores!
   - **Hit by Pitch**: Batter takes first base.
   - **Wild Pitch**: Advances runners and adds a ball.
3. **Turn Ends** – After each result (walk, out, hit, etc.), your hand is discarded and refreshed.
4. **Pitcher Stamina** – Pitchers tire over time. When stamina hits 0, a new pitcher is automatically brought in.
5. **Track Stats** – Each batter's stats are recorded and can be viewed any time using the **Show Stats** button.
6. **Innings** – After 3 outs, you advance to the next inning. The game ends after 3 innings.
7. **Win Condition** – Try to score as many runs as possible in 3 innings!

---

## 🧠 How It Works

### Card Mechanics
- The deck starts with 54 cards and is shuffled.
- Each turn, 6 cards are drawn.
- Played cards are discarded; unplayed cards are discarded at end of turn.
- When the deck is empty, it reshuffles from the discard pile.
