import { TileCell } from "../../types";
import * as css from "./Tile.css";

export const Tile = ({
  id,
  type,
  idx,
  relationships,
  onClick,
  selected,
}: TileCell) => {
  return (
    <css.root
      layoutId={String(id)}
      layout="position"
      data-selected={selected}
      data-type={type}
      title={`idx ${idx}, type ${type}, (${Object.values(
        relationships
      ).toString()})`}
      onClick={onClick}
    ></css.root>
  );
};
