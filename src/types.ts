import { CONSTANTS } from "./constants";

export type State = {
  tiles: Tile[];
  selection: number[];
  score: number;
  interactive: boolean;
  queue: Map<string, Tile[]>;
  combo: {
    count: number;
    message: string | null;
    score: number;
  };
  actions: {
    init: () => void;
    addToSelection: (id: number) => void;
  };
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
  visuallyDisabled?: boolean;
};

export type Directions = typeof CONSTANTS.DIRECTIONS[number];
