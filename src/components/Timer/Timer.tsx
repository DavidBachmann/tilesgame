import { useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useStore } from "../../StoreCreator";
import { useCountdown } from "../../hooks/useCountdown";
import { delay } from "../../utils";
import { useToggle } from "../../hooks/useToggle";
import { CONSTANTS } from "../../constants";
import * as css from "./Timer.css";

const MAX = CONSTANTS.TIMER_INITIAL_VALUE;
const MIN = 0;
const MS = 250;

export function Timer() {
  const [completed, toggle] = useToggle();
  const setGameOver = useStore((state) => state.actions.set_game_over);
  const resetGame = useStore((state) => state.actions.reset_game);
  const timer = useStore((state) => state.timer.count);
  const m = useMotionValue(MAX);

  const [count, { startCountdown, resetCountdown, resetCountdownAtValue }] =
    useCountdown({
      countStart: MAX,
      intervalMs: MS,
      onComplete: async () => {
        await delay(MS);
        toggle();
        setGameOver();
      },
    });

  useEffect(() => startCountdown(), []);

  useEffect(() => resetCountdownAtValue(Math.min(timer, MAX)), [timer]);

  const val = useTransform(m, [MIN, MAX], ["scaleX(0%)", "scaleX(100%)"]);
  const color = useTransform(
    m,
    [MIN, MAX],
    ["rgb(229, 45, 34)", "rgb(138, 201, 38)"]
  );

  const onClickReset = async () => {
    resetGame();
    await delay(200);
    resetCountdownAtValue(CONSTANTS.TIMER_INITIAL_VALUE);
    toggle();
  };

  m.set(count);

  return (
    <>
      <css.root disabled={!completed} onClick={onClickReset}>
        {completed ? (
          <css.message>Time's up</css.message>
        ) : (
          <css.track>
            <css.meter style={{ transform: val, backgroundColor: color }} />
          </css.track>
        )}
      </css.root>
    </>
  );
}
