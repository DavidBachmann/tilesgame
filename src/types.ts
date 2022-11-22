import { CONSTANTS } from "./constants";

export type GameMode = "casual" | "time-attack";
export type GameStatus = "pregame" | "in-progress" | "game-over";

export type GameState = {
  id: string;
  score: number;
  status: GameStatus;
  gameMode: GameMode;
  moves: [number, number][];
};

export type State = {
  tiles: Tile[];
  empties: Tile[];
  selection: number[];
  interactive: boolean;
  queue: Map<string, { tiles: Tile[]; score?: number; time?: number }>;
  game: GameState;
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
    init: (gameMode?: GameMode, status?: GameStatus) => void;
    add_to_selection: (id: number) => void;
    add_to_moves: (moves: [number, number]) => void;
    set_game_status: (gameStatus: GameStatus) => void;
    set_timer: (time: number) => void;
  };
};

type EndGameMessage = {
  heading: string;
  subtitle?: string;
};

export type Config = {
  gridSize: number;
  tileTypes: number;
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

export type Player = {
  alias: string | null;
};
