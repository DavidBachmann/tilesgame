import { useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useStore } from "../../StoreCreator";
import { useCountdown } from "../../hooks/useCountdown";
import { delay } from "../../utils";
import { useToggle } from "../../hooks/useToggle";
import { CONSTANTS } from "../../constants";
import * as css from "./Timer.css";

const MAX = CONSTANTS.TIME_ATTACK.TIMER_START;
const MIN = 0;
const MS = 400;
const COLOR_FROM = "rgb(229, 45, 34)";
const COLOR_TO = "rgb(138, 201, 38)";

export function Timer() {
  const [completed, toggle] = useToggle();
  const setGameOver = useStore((state) => state.actions.set_game_over);
  const resetGame = useStore((state) => state.actions.reset_game);
  const setTimer = useStore((state) => state.actions.set_timer);
  const timer = useStore((state) => state.timer.count);
  const m = useMotionValue(MAX);

  const { startCountdown, resetCountdownAtValue } = useCountdown({
    countStart: MAX,
    intervalMs: MS,
    onUpdate: (time: number) => {
      setTimer(time);
    },
    onComplete: async () => {
      await delay(MS * 2);
      toggle();
      setGameOver();
    },
  });

  useEffect(() => startCountdown(), []);

  useEffect(() => {
    if (timer > 0) {
      resetCountdownAtValue(Math.min(timer, MAX));
    }
  }, [timer]);

  const val = useTransform(m, [MIN, MAX], ["scaleX(0%)", "scaleX(100%)"]);
  const color = useTransform(m, [MIN, MAX], [COLOR_FROM, COLOR_TO]);

  const onClickReset = async () => {
    resetGame();
    await delay(200);
    resetCountdownAtValue(CONSTANTS.TIME_ATTACK.TIMER_START);
    toggle();
  };

  m.set(timer);

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
