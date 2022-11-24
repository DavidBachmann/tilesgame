import { v4 } from "uuid";
import { CONSTANTS } from "./constants";
import { Config, Directions, Tile, TileType } from "./types";

export const bubble_up = (tiles: Tile[], config: Config) => {
  const t: Tile[] = [...tiles];
  let returned = t;

  for (let i = 0; i < t.length; i++) {
    const tile = t[i];

    // This tile has been deleted and it should bubble up
    if (tile.type === -1) {
      // Figure out how many tiles are above this one.
      const totalAbove = Math.floor(tile.idx / config.gridSize) ?? 0;

      const indicesAbove = Array.from(
        { length: totalAbove },
        (_, index) => tile.idx - (index + 1) * config.gridSize
      );

      for (let j = 0; j <= indicesAbove.length; j++) {
        // Walk through
        const nextIdx = indicesAbove[j];
        const nextTile = get_tile_at_index(nextIdx, t);

        if (nextTile) {
          // Clones the nodes
          const tmp1 = { ...tile };
          const tmp2 = { ...nextTile };

          // Swap idx
          nextTile.idx = tmp1.idx;
          tile.idx = tmp2.idx;

          // Swap positions
          t[tmp1.idx] = nextTile;
          t[tmp2.idx] = tile;

          const { tiles } = solve(calculate_relationships(t, config.gridSize));

          returned = tiles;
        }
      }
    }
  }

  return returned;
};

export const create_empty_tiles = (config: Config): Tile[] => {
  return Array.from({ length: config.gridSize * config.gridSize }, (_, i) => ({
    id: v4(),
    idx: i,
    type: -1,
    relationships: { top: -1, right: -1, bottom: -1, left: -1 },
  }));
};

// Matches get turned into empty tiles
export const create_empty_tile_at_index = (idx: number): Tile => ({
  id: v4(),
  idx,
  type: -1,
  relationships: { top: -1, right: -1, bottom: -1, left: -1 },
});

// Empty tiles get turned into random tiles
const create_random_tile_at_index = (
  idx: number,
  random: () => number
): Tile => {
  return {
    id: v4(),
    idx: idx,
    type: Math.floor(random() * CONSTANTS.TOTAL_TILE_TYPES) as TileType,
    relationships: {
      top: -1,
      right: -1,
      bottom: -1,
      left: -1,
    },
  };
};

export const initialize_grid = (
  count: number,
  random: () => number
) => {
  const grid = [];
  const dimensions = count * count;

  for (let i = 0; i < dimensions; i++) {
    const tile = create_random_tile_at_index(i, random);

    grid.push(tile);
  }

  return calculate_relationships(grid, count);
};

export const shuffle_tiles = (tiles: Tile[], config: Config): Tile[] => {
  const copy = [...tiles];
  const get_random_tile = () =>
    copy[Math.floor(config.random.next() * copy.length)];

  for (let i = 0; i < copy.length; i++) {
    const r1 = copy[i];
    const r2 = get_random_tile();

    if (r1.id !== r2.id) {
      swap_two_tiles(r1.idx, r2.idx, copy, config, true);
    }
  }

  const { tiles: shuffled, matches: m } = solve(
    calculate_relationships(copy, config.gridSize)
  ); // here

  const matches = m.filter((arr) => arr.some(Boolean));

  // We created some matches, try again.
  if (matches.length) {
    return shuffle_tiles(copy, config);
  }

  // We created an unsolvable grid, those are no fun.
  if (!is_grid_solvable(shuffled, config)) {
    return shuffle_tiles(shuffled, config);
  }

  return shuffled;
};

export const calculate_relationships = (
  nodes: Tile[],
  dimension: number
): Tile[] => {
  const tiles = [...nodes];
  const newNodes = [];

  // Go through each node in the grid and figure out their positional relationship
  for (let i = 0; i < tiles.length; i++) {
    const node = tiles[i];
    newNodes[i] = {
      ...node,
      relationships: {
        // Is there anyone above?
        top: Math.max(-1, i - dimension),
        // Is there anyone to the right?
        right: i % dimension === dimension - 1 ? -1 : i + 1,
        // Is there anyone below?
        bottom: i + dimension >= tiles.length ? -1 : i + dimension,
        // Is there anyone to the left?
        left: i % dimension === 0 ? -1 : i - 1,
      },
    };
  }

  return newNodes;
};

const calculate_bonus = (
  matches: Tile[][]
): { bonusScore: number; bonusTime: number } => {
  const totalQuadMatches = get_quad_matches(matches);
  const totalQuintMatches = get_quint_matches(matches);

  let quadBonusPoints = 0;
  let quintBonusPoints = 0;

  let quadBonusTime = 0;
  let quintBonusTime = 0;

  if (totalQuadMatches) {
    // Apply bonus points for matching 4 in a row
    quadBonusPoints = CONSTANTS.POINTS_BONUS.QUAD * totalQuadMatches;
    // Apply bonus time for matching 4 in a row
    quadBonusTime =
      CONSTANTS.TIME_ATTACK.TIMER_QUAD_ADD_BONUS * totalQuadMatches;
  }

  if (totalQuintMatches) {
    // Apply bonus points for matching 5 in a row
    quintBonusPoints = CONSTANTS.POINTS_BONUS.QUINT * totalQuintMatches;
    // Apply bonus time for matching 5 in a row
    quintBonusTime =
      CONSTANTS.TIME_ATTACK.TIMER_QUINT_ADD_BONUS * totalQuintMatches;
  }

  const bonusScore = quadBonusPoints + quintBonusPoints;

  const bonusTime =
    CONSTANTS.TIME_ATTACK.TIMER_ADD + quadBonusTime + quintBonusTime;

  return {
    bonusScore,
    bonusTime,
  };
};

// Receives a list of matches and deletes them from the grid
// by replacing them with empties.
export const delete_matches = ({
  tiles,
  matches,
}: {
  tiles: Tile[];
  matches: Tile[][];
}): { tiles: Tile[]; score: number; time: number } => {
  const clone = [...tiles];
  const uniqueMatches = new Set<number>();
  matches.flat().forEach((obj) => uniqueMatches.add(obj.idx));
  const removedIdx = Array.from(uniqueMatches);
  const score = removedIdx.length;
  const { bonusScore, bonusTime } = calculate_bonus(matches);

  for (const idx of removedIdx) {
    clone[idx] = create_empty_tile_at_index(idx);
  }

  return { tiles: clone, score: score + bonusScore, time: bonusTime };
};

// After every match we spawn new tiles to fill the void
export const spawn_tiles = (tiles: Tile[], config: Config) => {
  const clone = [...tiles];

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];

    if (tile.type === -1) {
      clone[tile.idx] = create_random_tile_at_index(tile.idx, () =>
        config.random.next()
      );
    }
  }

  return calculate_relationships(clone, config.gridSize);
};

const solvable_check = (
  grid: Tile[],
  searchIndex = 0,
  config: Config
): boolean | null => {
  if (!grid[searchIndex]) {
    // Grid is unsolvable.
    // Returning null terminates the search.
    return null;
  }

  let found = 0;

  for (let i = 0; i < CONSTANTS.DIRECTIONS.length; i++) {
    const solvedGrid = solve(
      swap_two_tiles(
        grid[searchIndex].idx,
        grid[searchIndex].relationships[CONSTANTS.DIRECTIONS[i]],
        grid,
        config,
        false
      )
    );

    found = solvedGrid.matches.length;

    if (found > 0) {
      break;
    }
  }

  return found > 0;
};

export const is_grid_solvable = (grid: Tile[], config: Config) => {
  let solvable: boolean | null = false;
  let curr = -1;

  while (!solvable) {
    const newCopy = [...grid];
    curr++;
    solvable = solvable_check(newCopy, curr, config);

    if (solvable === null) {
      break;
    }
  }

  return solvable;
};

// Takes a grid and finds matches
export const solve = (tiles: Tile[]) => {
  const copy = [...tiles];
  const m = [];

  for (let i = 0; i < copy.length; i++) {
    const node = copy[i];
    const hits = CONSTANTS.DIRECTIONS.map((direction) =>
      seek(node, direction, copy)
    ).filter((arr) => arr.length >= 3);

    m.push(hits);
  }

  const matches = m.filter((arr) => arr.some(Boolean)).flat();

  return { tiles: copy, matches };
};

// Tries to generate a solvable grid without any matches
export const create_grid = (config: Config): Tile[] => {
  const newGrid = initialize_grid(config.gridSize, () => config.random.next());

  const m = [];

  for (let i = 0; i < newGrid.length; i++) {
    const node = newGrid[i];
    const hits = CONSTANTS.DIRECTIONS.map((direction) =>
      seek(node, direction, newGrid)
    ).filter((arr) => arr.length >= 3);

    m.push(hits);
  }

  const matches = m.filter((arr) => arr.some(Boolean));

  // We created some matches, try again.
  if (matches.length) {
    return create_grid(config);
  }

  // We created an unsolvable grid, those are no fun.
  if (!is_grid_solvable(newGrid, config)) {
    return create_grid(config);
  }

  return newGrid;
};

export const seek = (
  node: Tile,
  direction: Directions,
  tiles: Tile[],
  hits: Tile[] = []
): Tile[] => {
  const arr = [...hits];

  // Always push this node
  arr.push(node);

  const nextNode = get_tile_at_index(node.relationships[direction], tiles);

  // There is no next node, we're done!
  if (nextNode === null || nextNode.type === -1) {
    return arr;
  }

  // Here we be dragons
  if (node.idx === nextNode.idx) {
    return arr;
  }

  // Next node is of another type, we're not interested in exploring further.
  if (node.type !== nextNode.type) {
    return arr;
  }

  return seek(nextNode, direction, tiles, arr);
};

export const get_tile_at_index = (index: number, tiles: Tile[]) => {
  const found = tiles[index];

  if (found) {
    // Return a copy of the tile since we want to be able to perform dry runs
    // without mutating tiles.
    return { ...found };
  }

  return null;
};

export const swap_two_tiles = (
  idx1: number,
  idx2: number,
  tiles: Tile[],
  config: Config,
  mutate?: boolean
): Tile[] => {
  const grid = mutate ? tiles : [...tiles];
  const firstTile = get_tile_at_index(idx1, grid);
  const secondTile = get_tile_at_index(idx2, grid);

  if (firstTile && secondTile) {
    // Clones the nodes
    const tmp1 = { ...firstTile };
    const tmp2 = { ...secondTile };

    const tmpIdx1 = tmp1.idx;
    const tmpIdx2 = tmp2.idx;

    // Swap idx
    secondTile.idx = tmpIdx1;
    firstTile.idx = tmpIdx2;

    // Swap positions
    grid[tmpIdx1] = secondTile;
    grid[tmpIdx2] = firstTile;

    const unsolved = calculate_relationships(grid, config.gridSize);

    return unsolved;
  }

  return grid;
};

export const push_tile_selection = (
  insert: number,
  arr: number[]
): number[] => {
  let a = [...arr];

  a.unshift(insert);

  if (a.length > 2) {
    a = [insert];
  }

  return a;
};

export const check_swap = (
  idx1: number,
  idx2: number,
  tiles: Tile[],
  config: Config
): boolean => {
  const tile1 = get_tile_at_index(idx1, tiles);
  const tile2 = get_tile_at_index(idx2, tiles);

  if (!tile1 || !tile2) {
    return false;
  }

  if (tile1.type === -1 || tile2.type === -1) {
    return false;
  }

  if (
    Object.values(tile1.relationships).includes(tile2.idx) &&
    Object.values(tile2.relationships).includes(tile1.idx)
  ) {
    const t = [...tiles];

    // dry run
    const { matches } = solve(swap_two_tiles(idx1, idx2, t, config, false));

    if (matches.length) {
      return true;
    }
  }

  return false;
};

export const get_quad_matches = (matches: Tile[][]) => {
  // Quad matches look like [arr[4], arr[4]] (length 2)
  const quads = get_x_matches(matches, 4);

  // Make sure it's not a quint...
  const quints = get_x_matches(matches, 5);

  if (quints) {
    return 0;
  }

  return quads;
};

export const get_quint_matches = (matches: Tile[][]) => {
  // Quint matches look like [arr[5], arr[5]] (length 2)
  return get_x_matches(matches, 5);
};

export const get_x_matches = (matches: Tile[][], x: number) => {
  const hits = matches.filter((match) => match.length === x);
  if (hits.length) {
    return Math.max(hits.length / 2, 0);
  }

  return 0;
};
