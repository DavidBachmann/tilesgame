import { Variants } from "framer-motion";
import { CONSTANTS } from "../../constants";
import { TileCell } from "../../types";
import * as css from "./Tile.css";

const explosion: Variants = {
  animate: {
    opacity: [1, 0, 1, 0],
    transition: {
      duration: CONSTANTS.TILE_ANIMATION_MS / 1000,
    },
  },
  initial: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const Tile = ({
  id,
  type,
  idx,
  relationships,
  onDrag,
  selected,
}: TileCell) => {
  const y = type == -1 ? [1, 0] : [CONSTANTS.TILE_SIZE * -1, 0];
  const opacity = [0, 1];

  return (
    <css.root
      layoutId={String(id)}
      layout="position"
      animate={{ y, opacity }}
      transition={{
        opacity: { duration: CONSTANTS.TILE_ANIMATION_MS / 1000 / 5 },
        default: { duration: CONSTANTS.TILE_ANIMATION_MS / 1000 },
      }}
    >
      {type === -1 && (
        <css.explosion
          variants={explosion}
          animate="animate"
          initial="initial"
          exit="exit"
        ></css.explosion>
      )}
      <css.tile
        drag
        dragTransition={{ bounceStiffness: 50, bounceDamping: 10 }}
        dragDirectionLock
        dragSnapToOrigin
        dragMomentum={false}
        dragConstraints={{ top: -16, left: -16, right: 16, bottom: 16 }}
        onDragStart={(_, info) => onDrag(info)}
        dragElastic={0.05}
        data-selected={selected}
        data-type={type}
        title={`idx ${idx}, type ${type}, (${Object.values(
          relationships
        ).toString()})`}
      ></css.tile>
    </css.root>
  );
};
