import { motion } from "framer-motion";
import { TileCell } from "../types";

export const Tile = ({
  id,
  type,
  idx,
  relationships,
  onClick,
  selected,
}: TileCell) => {
  const bg = {
    "-1": "#242424",
    "0": "purple",
    "1": "green",
    "2": "blue",
    "3": "red",
  };

  return (
    <motion.div
      layoutId={String(id)}
      layout="position"
      style={{
        fontSize: 18,
        padding: 10,
        background: bg[type],
        color: type === -1 ? "#242424" : "white",
        pointerEvents: type === -1 ? "none" : "all",
      }}
      title={`idx ${idx}, type ${type}, (${Object.values(
        relationships
      ).toString()})`}
      onClick={onClick}
    >
      <div
        style={{ background: type > -1 && selected ? "red" : "transparent" }}
      >
        {String(idx).padStart(2, "0")}
      </div>
    </motion.div>
  );
};
