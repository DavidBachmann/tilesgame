import { useConfig } from "../../context/ConfigContext";
import { Relationships, Tile as TileT, TileType } from "../../types";
import { Tile } from "../Tile";
import { useStore } from "../../StoreCreator";
import * as css from "./Grid.css";

type GridProps = {
  tiles: TileT[];
  onSwipe: (
    [axis, dir]: [axis: "x" | "y", dir: number],
    idx: number,
    relationship: Relationships
  ) => void;
};

export const Grid = ({ tiles, onSwipe }: GridProps) => {
  const config = useConfig();
  const selection = useStore((state) => state.selection);
  return (
    <css.root gridSize={config.gridSize}>
      {tiles.map((tile) => {
        return (
          <Tile
            key={tile.id}
            id={tile.id}
            relationships={tile.relationships}
            idx={tile.idx}
            type={tile.type as TileType}
            destroyed={tile.type === -1}
            selected={selection.includes(tile.idx)}
            onDrag={(direction) => {
              onSwipe(direction, tile.idx, tile.relationships);
            }}
          />
        );
      })}
    </css.root>
  );
};
