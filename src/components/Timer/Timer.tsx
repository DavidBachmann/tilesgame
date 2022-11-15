import { useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useStore } from "../../StoreCreator";
import { useCountdown } from "../../hooks/useCountdown";
import { delay } from "../../utils";
import { CONSTANTS } from "../../constants";
import * as css from "./Timer.css";

const MAX = CONSTANTS.TIME_ATTACK.TIMER_START;
const MIN = 0;
const MS = 400;
const COLOR_FROM = "rgb(229, 45, 34)";
const COLOR_TO = "rgb(138, 201, 38)";

export function Timer() {
  const game = useStore((state) => state.game);
  const setGameStatus = useStore((state) => state.actions.set_game_status);
  const setTimer = useStore((state) => state.actions.set_timer);
  const timer = useStore((state) => state.timer.count);
  const m = useMotionValue(MAX);

  const { setCountdownToValue } = useCountdown({
    countStart: MAX,
    intervalMs: MS,
    onUpdate: (time: number) => {
      setTimer(time);
    },
    onComplete: async () => {
      await delay(MS * 2);
      setGameStatus("game-over");
    },
  });

  useEffect(() => {
    if (game.status === "in-progress" && timer > 0) {
      setCountdownToValue(Math.min(timer, MAX));
    }
  }, [timer, game]);

  const val = useTransform(m, [MIN, MAX], ["scaleX(0%)", "scaleX(100%)"]);
  const color = useTransform(m, [MIN, MAX], [COLOR_FROM, COLOR_TO]);

  m.set(timer);

  return (
    <css.root>
      <css.track>
        <css.meter style={{ transform: val, backgroundColor: color }} />
      </css.track>
    </css.root>
  );
}
