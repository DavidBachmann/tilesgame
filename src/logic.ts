import { v4 } from "uuid";
import { CONSTANTS } from "./constants";
import { Config, Directions, Tile, TileType } from "./types";
import { random_between } from "./utils";

export const bubble_up = (tiles: Tile[], config: Config) => {
  let t: Tile[] = [...tiles];
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
        let nextTile = get_tile_at_index(nextIdx, t);

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
  totalTileTypes: number
): Tile => ({
  id: v4(),
  idx: idx,
  type: random_between(0, totalTileTypes) as TileType,
  relationships: {
    top: -1,
    right: -1,
    bottom: -1,
    left: -1,
  },
});

export const initialize_grid = (count: number, totalTileTypes: number) => {
  const grid = [];
  const dimensions = count * count;

  for (let i = 0; i < dimensions; i++) {
    const tile = create_random_tile_at_index(i, totalTileTypes);

    grid.push(tile);
  }

  return calculate_relationships(grid, count);
};

export const calculate_relationships = (
  nodes: Tile[],
  dimension: number
): Tile[] => {
  const tiles = [...nodes];
  const newNodes = [];

  // Go through each node in the grid and figure out their positional relationship
  for (let i = 0; i < tiles.length; i++) {
    let node = tiles[i];
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

// Receives a list of matches and deletes them from the grid
// by replacing them with empties.
export const delete_matches = ({
  tiles,
  matches,
  scoreCallback,
}: {
  tiles: Tile[];
  matches: Tile[][];
  scoreCallback: (score: number) => void;
}): Tile[] => {
  const clone = [...tiles];
  const uniqueMatches = new Set<number>();
  matches.flat().forEach((obj) => uniqueMatches.add(obj.idx));
  const removedIdx = Array.from(uniqueMatches);
  const score = removedIdx.length;
  scoreCallback(score);

  for (let idx of removedIdx) {
    clone[idx] = create_empty_tile_at_index(idx);
  }

  return clone;
};

// After every match we spawn new tiles to fill the void
export const spawn_tiles = (tiles: Tile[], config: Config) => {
  const clone = [...tiles];

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];

    if (tile.type === -1) {
      clone[tile.idx] = create_random_tile_at_index(tile.idx, config.tileTypes);
    }
  }

  return calculate_relationships(clone, config.gridSize);
};

const game_over_check = (
  grid: Tile[],
  searchIndex = 0,
  config: Config
): boolean | null => {
  // Unsolvable
  if (!grid[searchIndex]) {
    return null;
  }

  const swapped = swap_two_tiles(
    grid[searchIndex].idx,
    grid[searchIndex].relationships.right,
    grid,
    config
  );

  const { matches } = solve(swapped);

  if (matches.length > 0) {
    console.log(matches);
  }

  return matches.length > 0;
};

export const game_over = (tiles: Tile[], config: Config) => {
  const grid = [...tiles];
  let solved: boolean | null = false;
  let curr = -1;

  while (solved === false) {
    curr++;
    solved = game_over_check(grid, curr, config);

    if (solved === null) {
      return true;
    }
  }

  return false;
};

// Takes a grid and finds matches
export const solve = (tiles: Tile[]) => {
  const m = [];

  for (let i = 0; i < tiles.length; i++) {
    const node = tiles[i];
    const hits = CONSTANTS.DIRECTIONS.map((direction) =>
      seek(node, direction, tiles)
    ).filter((arr) => arr.length >= 3);

    m.push(hits);
  }

  const matches = m.filter((arr) => arr.some(Boolean)).flat();

  return { tiles, matches };
};

// `create_grid` tries to generate a grid without any matches
export const create_grid = (config: Config): Tile[] => {
  const new_grid = initialize_grid(config.gridSize, config.tileTypes);

  const m = [];

  for (let i = 0; i < new_grid.length; i++) {
    const node = new_grid[i];
    const hits = CONSTANTS.DIRECTIONS.map((direction) =>
      seek(node, direction, new_grid)
    ).filter((arr) => arr.length >= 3);

    m.push(hits);
  }

  const matches = m.filter((arr) => arr.some(Boolean));

  // We created some matches, try again.
  if (matches.length) {
    return create_grid(config);
  }

  // That's better
  return new_grid;
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
  config: Config
): Tile[] => {
  const firstTile = get_tile_at_index(idx1, tiles);
  const secondTile = get_tile_at_index(idx2, tiles);

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
    tiles[tmpIdx1] = secondTile;
    tiles[tmpIdx2] = firstTile;

    const unsolved = calculate_relationships(tiles, config.gridSize);

    return unsolved;
  }

  return tiles;
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
    const { matches } = solve(swap_two_tiles(idx1, idx2, t, config));

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
