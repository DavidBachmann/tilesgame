import { CONSTANTS } from "./constants";

export type GameMode = "casual" | "time-attack";

export type State = {
  tiles: Tile[];
  selection: number[];
  score: number;
  interactive: boolean;
  queue: Map<string, Tile[]>;
  gameOver: boolean;
  timer: {
    count: number;
  };
  message: {
    queue: Set<EndGameMessage>;
    current: EndGameMessage;
    uuid: string;
  };
  combo: {
    count: number;
    message: string | null;
    score: number;
  };
  actions: {
    init: () => void;
    add_to_selection: (id: number) => void;
    set_game_over: () => void;
    add_to_timer: (add: number) => void;
    reset_game: () => void;
  };
};

type EndGameMessage = {
  heading: string;
  subtitle?: string;
};

export type Config = {
  gridSize: number;
  tileTypes: number;
  gameMode: GameMode;
  random: () => number;
  seed: string;
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

export type TileElement = Tile & {
  onClick?: () => void;
  onDrag: (direction: [axis: "x" | "y", dir: number]) => void;
  idx: number;
  relationships: Relationships;
  selected?: boolean;
  destroyed?: boolean;
};

export type Directions = typeof CONSTANTS.DIRECTIONS[number];
