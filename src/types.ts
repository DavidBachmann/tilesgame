import { CONSTANTS } from "./constants";

export type State = {
  tiles: Tile[];
  selection: number[];
  score: number;
  comboScore: number;
  comboMessage: string | null;
  comboCount: number;
  interactive: boolean;
  queue: Map<string, Tile[]>;
};

export type Config = {
  gridSize: number;
  tileTypes: number;
};

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
  onDrag: (direction: [x: number, y: number]) => void;
  selected?: boolean;
};

export type Directions = typeof CONSTANTS.DIRECTIONS[number];
