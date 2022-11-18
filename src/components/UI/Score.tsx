import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { useStore } from "../../StoreCreator";
import * as css from "./Score.css";
import { CONSTANTS } from "../../constants";

// const springVelocity = transform([0, 30], [80, 50]);
// const springDamping = transform([0, 30], [40, 80]);

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

  return (
    <css.root>
      <css.text>{val}</css.text>
    </css.root>
  );
}
