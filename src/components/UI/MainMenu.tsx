import { useMemo } from "react";
import { useLeaderboard } from "../../context/LeaderboardContext";
import { useStore } from "../../StoreCreator";
import Button from "../Button";
import { LeaderboardTable } from "../LeaderboardTable";
import * as css from "./MainMenu.css";

export function MainMenu({ type }: { type: "pregame" | "postgame" }) {
  const game = useStore((store) => store.game);
  const init = useStore((store) => store.actions.init);
  const setGameStatus = useStore((store) => store.actions.set_game_status);
  const { lowestScore, toggleLeaderboard, isVisible } = useLeaderboard();

  const { gameMode, score } = game;

  const pregame = useMemo(
    () => (
      <>
        <css.content>
          {gameMode === "casual" && (
            <css.instructions>
              <css.title>Casual mode</css.title>
              <css.subtitle>
                Match 3 tiles to score points. Multiply your score by making
                combos.{" "}
              </css.subtitle>
              <css.subtitle>The goal of the game is to have fun.</css.subtitle>
            </css.instructions>
          )}
          {gameMode === "time-attack" && (
            <css.instructions>
              <css.title>Time attack</css.title>
              <css.subtitle>
                It&apos;s you against the clock. Match 3 tiles to score points
                and buy yourself some time.
              </css.subtitle>
              <css.subtitle>Try to make it to the leaderboard.</css.subtitle>
            </css.instructions>
          )}
        </css.content>
        <css.buttons>
          <Button
            onClick={() => init(gameMode, "in-progress")}
            variant={5}
            type="submit"
          >
            Play
          </Button>

          {gameMode === "time-attack" && (
            <Button onClick={toggleLeaderboard} variant={4}>
              Leaderboard
            </Button>
          )}
        </css.buttons>
      </>
    ),
    [gameMode, init, toggleLeaderboard]
  );

  const postgame = useMemo(
    () => (
      <>
        <css.content>
          <css.title>You scored {score} points</css.title>
          {score >= lowestScore ? (
            <css.subtitle>You&apos;re on the leaderboard!</css.subtitle>
          ) : (
            <css.subtitle>Better luck next time.</css.subtitle>
          )}
        </css.content>

        <css.buttons>
          {game.gameMode === "time-attack" && (
            <Button onClick={toggleLeaderboard} variant={4}>
              Leaderboard
            </Button>
          )}

          <Button variant={5} onClick={() => setGameStatus("pregame")}>
            Back
          </Button>
        </css.buttons>
      </>
    ),
    [score, lowestScore, setGameStatus, game.gameMode, toggleLeaderboard]
  );

  return (
    <css.root>
      {isVisible && <LeaderboardTable />}
      {!isVisible && <>{type === "pregame" ? pregame : postgame}</>}
    </css.root>
  );
}
