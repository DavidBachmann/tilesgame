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
  return (
    <css.root layoutId={String(id)} layout="position">
      <css.tile
        drag
        dragTransition={{ bounceStiffness: 50, bounceDamping: 10 }}
        dragDirectionLock
        dragSnapToOrigin
        dragMomentum={false}
        dragConstraints={{ top: 16, left: 16, right: 16, bottom: 16 }}
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
