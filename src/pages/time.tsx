import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Game = dynamic(() => import("../Game"), { ssr: false });

export default function Time() {
  return (
    <AnimatePresence>
      <Game gameMode="time-attack" />
    </AnimatePresence>
  );
}
