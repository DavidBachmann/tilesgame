import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { useStore } from "../../StoreCreator";
import * as css from "./Score.css";

export function Score() {
  const score = useStore((state) => state.score);
  const [val, setVal] = useState(0);
  const [_, setPlaying] = useState(false);
  const lastScore = useRef(score);
  const foo = useRef(1);

  useEffect(() => {
    const scoreDiff = score - lastScore.current;
    const controls = animate(lastScore.current, score, {
      duration: scoreDiff >= 20 ? 1.6 : 0.8,
      ease: "easeOut",
      onPlay() {
        setPlaying(true);
      },
      onUpdate(value) {
        const v = parseInt(value.toFixed(2), 10);
        setVal(v);
        lastScore.current = v;
        foo.current = scoreDiff >= 10 ? 1.2 : 1.1;
      },
      onComplete() {
        foo.current = 1;
        setPlaying(false);
      },
    });

    return () => controls.stop();
  }, [score]);

  return (
    <css.root>
      <css.text animate={{ scale: foo.current }}>{val}</css.text>
    </css.root>
  );
}
