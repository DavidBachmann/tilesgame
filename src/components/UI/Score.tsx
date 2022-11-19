import { useEffect, useMemo, useRef, useState } from "react";
import { animate } from "framer-motion";
import { useStore } from "../../StoreCreator";
import { CONSTANTS } from "../../constants";
import * as css from "./Score.css";

export function Score() {
  const game = useStore((state) => state.game);
  const [val, setVal] = useState(0);
  const lastScore = useRef(game.score);
  const scale = useRef(1);

  useEffect(() => {
    const controls = animate(lastScore.current, game.score, {
      duration: CONSTANTS.TILE_ANIMATION.s,
      ease: "easeOut",
      onUpdate(value) {
        const v = parseInt(value.toFixed(2), 10);
        setVal(v);
        lastScore.current = v;
      },
      onComplete() {
        scale.current = 1;
      },
    });

    return () => controls.stop();
  }, [game]);

  const renderText = useMemo(() => {
    switch (game.status) {
      case "in-progress":
      case "time-limit":
        return val;
      case "game-over":
        return "Game Over";
      case "pregame":
        return "Let's play";
      default:
        return val;
    }
  }, [game.status, val]);

  return (
    <css.root>
      <css.text>{renderText}</css.text>
    </css.root>
  );
}
