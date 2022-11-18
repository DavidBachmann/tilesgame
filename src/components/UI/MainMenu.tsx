import { useMemo } from "react";
import { useLeaderboard } from "../../context/LeaderboardContext";
import { useStore } from "../../StoreCreator";
import Button, { NavButton } from "../Button";
import * as css from "./MainMenu.css";

export function MainMenu({ type }: { type: "pregame" | "postgame" }) {
  const game = useStore((store) => store.game);
  const init = useStore((store) => store.actions.init);
  const setGameStatus = useStore((store) => store.actions.set_game_status);
  const { lowestScore } = useLeaderboard();

  const { gameMode, score } = game;

  const pregame = useMemo(
    () => (
      <css.root>
        {gameMode === "casual" && <h2>Tiles Game</h2>}
        {gameMode === "time-attack" && <h2>Time-attack!</h2>}
        <css.buttons>
          <Button onClick={() => init(gameMode, "in-progress")}>Play</Button>
          {gameMode === "time-attack" && (
            <NavButton colorScheme="white" to="/time/leaderboard">
              Leaderboard
            </NavButton>
          )}
        </css.buttons>
      </css.root>
    ),
    [gameMode, init]
  );

  const postgame = useMemo(
    () => (
      <css.root>
        <css.content>
          <h2>Game over</h2>
          {score >= lowestScore && (
            <css.subtitle>You're on the leaderboard!</css.subtitle>
          )}
        </css.content>

        <css.buttons>
          {game.gameMode === "time-attack" && (
            <NavButton to="/time/leaderboard">Leaderboard</NavButton>
          )}

          <Button colorScheme="white" onClick={() => setGameStatus("pregame")}>
            Dismiss
          </Button>
        </css.buttons>
      </css.root>
    ),
    [score, lowestScore, setGameStatus]
  );

  return type === "pregame" ? pregame : postgame;
}
