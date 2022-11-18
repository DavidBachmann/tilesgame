import { useEffect, useRef, useState } from "react";
import { animate, transform } from "framer-motion";
import { useStore } from "../../StoreCreator";
import * as css from "./Score.css";

const springVelocity = transform([0, 30], [100, 50]);

export function Score() {
  const game = useStore((state) => state.game);
  const [val, setVal] = useState(0);
  const [_, setPlaying] = useState(false);
  const lastScore = useRef(game.score);
  const scale = useRef(1);

  useEffect(() => {
    const scoreDiff = game.score - lastScore.current;
    const controls = animate(lastScore.current, game.score, {
      type: "spring",
      damping: 80,
      stiffness: 500,
      mass: 0.5,
      velocity: springVelocity(scoreDiff),
      onPlay() {
        setPlaying(true);
      },
      onUpdate(value) {
        const v = parseInt(value.toFixed(2), 10);
        setVal(v);
        lastScore.current = v;
        scale.current = scoreDiff >= 10 ? 1.2 : 1.1;
      },
      onComplete() {
        scale.current = 1;
        setPlaying(false);
      },
    });

    return () => controls.stop();
  }, [game]);

  return (
    <css.root>
      <css.text animate={{ scale: scale.current }}>{val}</css.text>
    </css.root>
  );
}
