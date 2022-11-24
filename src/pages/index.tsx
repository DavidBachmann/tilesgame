import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { v4 } from "uuid";

const Game = dynamic(() => import("../Game"), { ssr: false });

export default function Casual() {
  return (
    <AnimatePresence>
      <Game key={v4()} gameMode="casual" />
    </AnimatePresence>
  );
}
