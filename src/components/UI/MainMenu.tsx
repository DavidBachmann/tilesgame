import { useMemo } from "react";
import { useStore } from "../../StoreCreator";
import Button from "../Button";
import * as css from "./MainMenu.css";

function getSubtitle(score: number) {
  if (score >= 100 && score < 200) {
    return "That's pretty good. Keep it up.";
  }
  if (score >= 200 && score < 400) {
    return "Nice score. Can you improve it?";
  }
  if (score >= 400 && score < 600) {
    return "That was mighty impressive!";
  }
  if (score >= 600 && score < 1000) {
    return "I didn't think a score this high was even possible.";
  }
  if (score >= 1000) {
    return "That. Was. Awesome.";
  }

  return "Practice makes perfect.";
}

export function MainMenu({ type }: { type: "pregame" | "postgame" }) {
  const game = useStore((store) => store.game);
  const init = useStore((store) => store.actions.init);
  const setGameStatus = useStore((store) => store.actions.set_game_status);

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
        </css.buttons>
      </>
    ),
    [gameMode, init]
  );

  const postgame = useMemo(
    () => (
      <>
        <css.content>
          <css.title>You scored {score} points.</css.title>
          <css.subtitle>{getSubtitle(score)}</css.subtitle>
        </css.content>

        <css.buttons>
          <Button variant={5} onClick={() => setGameStatus("pregame")}>
            Back
          </Button>
        </css.buttons>
      </>
    ),
    [setGameStatus, score]
  );

  return <css.root>{type === "pregame" ? pregame : postgame}</css.root>;
}
