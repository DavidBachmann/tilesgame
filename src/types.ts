import { CONSTANTS } from "./constants";

export type Relationships = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type TilePosition = {
  row: number;
  col: number;
};

export type TileType = -1 | 0 | 1 | 2 | 3;

export type Tile = {
  id: string;
  relationships: Relationships;
  type: TileType;
  idx: number;
  position: TilePosition;
};

export type Directions = typeof CONSTANTS.DIRECTIONS[number];
