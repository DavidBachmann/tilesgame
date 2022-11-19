import { useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore } from "../../StoreCreator";
import { delay } from "../../utils";
import { CONSTANTS } from "../../constants";
import * as css from "./Timer.css";

const MAX = CONSTANTS.TIME_ATTACK.TIMER_START;
const MIN = 0;
const MS = 100;
const COLOR_FROM = "rgb(229, 45, 34)";
const COLOR_TO = "rgb(138, 201, 38)";

const useCountdown = ({
  initialValue,
  onUpdate = () => {},
  onComplete = () => {},
}: {
  initialValue: number;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
}) => {
  const [val, set] = useState(initialValue);
  const [running, run] = useState(false);

  let i: number;
  const startCountdown = async (d = 0) => {
    await delay(d);
    run(true);
  };
  const stopCountdown = () => run(false);

  useEffect(() => {
    i = setInterval(() => {
      if (!running) {
        return;
      }

      return set((prev) => {
        const newValue = Math.min(Math.max(MIN, prev - 100), MAX);
        onUpdate(newValue);
        return newValue;
      });
    }, MS);

    return () => clearInterval(i);
  }, [val, running]);

  useEffect(() => {
    if (val <= 0) {
      clearInterval(i);
      stopCountdown();
      onComplete();
    }
  }, [val]);

  return {
    setValue: set,
    startCountdown,
    stopCountdown,
  };
};

export function Timer() {
  const game = useStore((state) => state.game);
  const setGameStatus = useStore((state) => state.actions.set_game_status);
  const setTimer = useStore((state) => state.actions.set_timer);
  const timer = useStore((state) => state.timer.count);
  const m = useMotionValue(MAX);
  const { startCountdown, stopCountdown, setValue } = useCountdown({
    initialValue: MAX,
    onUpdate: (latestTime) => {
      setTimer(latestTime);
    },
    onComplete: async () => {
      setGameStatus("game-over");
      setValue(MAX);
    },
  });

  useEffect(() => {
    if (game.status === "in-progress") {
      startCountdown(MS * 8);
    } else {
      stopCountdown();
    }
  }, [game.status]);

  useEffect(() => {
    if (timer) {
      setValue(timer);
    }
  }, [timer, setValue]);

  const val = useTransform(m, [MIN, MAX], ["scaleX(0%)", "scaleX(100%)"]);
  const color = useTransform(m, [MIN, MAX], [COLOR_FROM, COLOR_TO]);

  m.set(timer);

  return (
    <css.root>
      <css.track>
        <css.meter
          style={{
            transform: val,
            backgroundColor: color,
            transitionDuration: "350ms",
            transitionTimingFunction: "ease-out",
          }}
        />
      </css.track>
    </css.root>
  );
}
