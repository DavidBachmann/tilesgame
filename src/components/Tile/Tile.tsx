import { CONSTANTS } from "../../constants";
import { TileCell } from "../../types";
import * as css from "./Tile.css";

export const Tile = ({
  id,
  type,
  idx,
  relationships,
  onDrag,
  selected,
}: TileCell) => {
  const y = [CONSTANTS.TILE_SIZE * -1, 0];
  const opacity = [0, 1];
  return (
    <css.root
      layoutId={String(id)}
      layout="position"
      animate={{ y, opacity }}
      transition={{ opacity: { duration: 0.2 }, default: { duration: 0.4 } }}
    >
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
