import { PanInfo } from "framer-motion";
import { CONSTANTS } from "./constants";

export type Relationships = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type TileType = -1 | 0 | 1 | 2 | 3 | 4;

export type Tile = {
  id: string;
  relationships: Relationships;
  type: TileType;
  idx: number;
};

export type TileCell = Tile & {
  onClick?: () => void;
  onDrag: (info: PanInfo) => void;
  selected?: boolean;
};

export type Directions = typeof CONSTANTS.DIRECTIONS[number];
