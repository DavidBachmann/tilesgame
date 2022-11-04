import { v4 } from "uuid";
import { CONSTANTS } from "./constants";
import { Directions, Tile, TileType } from "./types";
import { random_between } from "./utils";

export const bubble_up = (tiles: Tile[]) => {
  let t: Tile[] = [...tiles];
  let returned = t;

  for (let i = 0; i < t.length; i++) {
    const tile = t[i];

    // This tile has been deleted and it should bubble up
    if (tile.type === -1) {
      // Figure out how many tiles are above this one.
      const totalAbove = Math.floor(tile.idx / CONSTANTS.DIMENSIONS) ?? 0;

      const indicesAbove = Array.from(
        { length: totalAbove },
        (_, index) => tile.idx - (index + 1) * CONSTANTS.DIMENSIONS
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

          const { tiles } = solve(
            calculate_relationships(t, CONSTANTS.DIMENSIONS)
          );

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
const create_random_tile_at_index = (idx: number): Tile => ({
  id: v4(),
  idx: idx,
  type: random_between(0, 3) as TileType,
  relationships: {
    top: -1,
    right: -1,
    bottom: -1,
    left: -1,
  },
});

export const initialize_grid = (count: number) => {
  const grid = [];
  const dimensions = count * count;

  for (let i = 0; i < dimensions; i++) {
    const tile = create_random_tile_at_index(i);

    grid.push(tile);
  }

  return calculate_relationships(grid, count);
};

export const calculate_relationships = (
  nodes: Tile[],
  dimension: number
): Tile[] => {
  const newNodes = [];

  // Go through each node in the grid and figure out their positional relationship
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    newNodes[i] = {
      ...node,
      relationships: {
        // Is there anyone above?
        top: Math.max(-1, i - dimension),
        // Is there anyone to the right?
        right: i % dimension === dimension - 1 ? -1 : i + 1,
        // Is there anyone below?
        bottom: i + dimension >= nodes.length ? -1 : i + dimension,
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
export const spawn_tiles = (tiles: Tile[]) => {
  const clone = [...tiles];

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];

    if (tile.type === -1) {
      clone[tile.idx] = create_random_tile_at_index(tile.idx);
    }
  }

  return calculate_relationships(clone, CONSTANTS.DIMENSIONS);
};

// `Solve` takes a grid and finds matches
export const solve = (tiles: Tile[]) => {
  const m = [];

  for (let i = 0; i < tiles.length; i++) {
    const node = tiles[i];
    const hits = CONSTANTS.DIRECTIONS.map((direction) =>
      seek(node, direction, tiles)
    ).filter((arr) => arr.length >= CONSTANTS.REGULAR_HIT);

    m.push(hits);
  }

  const matches = m.filter((arr) => arr.some(Boolean)).flat();

  return { tiles, matches };
};

// `create_grid` tries to generate a grid without any matches
export const create_grid = (): Tile[] => {
  const new_grid = initialize_grid(CONSTANTS.DIMENSIONS);

  const m = [];

  for (let i = 0; i < new_grid.length; i++) {
    const node = new_grid[i];
    const hits = CONSTANTS.DIRECTIONS.map((direction) =>
      seek(node, direction, new_grid)
    ).filter((arr) => arr.length >= CONSTANTS.REGULAR_HIT);

    m.push(hits);
  }

  const matches = m.filter((arr) => arr.some(Boolean));

  // We created some matches, try again.
  if (matches.length) {
    return create_grid();
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

  if (node.idx === nextNode.idx) {
    throw new Error("node.idx === nextNode.idx, game will crash");
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
    return found;
  }

  return null;
};

export const swap_two_tiles = (
  idx1: number,
  idx2: number,
  tiles: Tile[]
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

    const unsolved = calculate_relationships(tiles, CONSTANTS.DIMENSIONS);

    return unsolved;
  }

  return tiles;
};

export const queue = (insert: number, arr: number[]): number[] => {
  let a = [...arr];

  a.push(insert);

  if (a.length > 2) {
    a = [insert];
  }

  return a;
};

export const check_swap = (idx1: number, idx2: number, tiles: Tile[]) => {
  const tile1 = get_tile_at_index(idx1, tiles);
  const tile2 = get_tile_at_index(idx2, tiles);

  // TODO: This allows too much
  if (
    tile1 &&
    tile2 &&
    Object.values(tile1.relationships).includes(tile2.idx) &&
    Object.values(tile2.relationships).includes(tile1.idx) &&
    tile1.type !== -1 &&
    tile2.type !== -1
  ) {
    console.log(`Swapping ${tile1.idx} and ${tile2.idx}`);
    return true;
  }

  console.log(`Can't swap ${idx1} and ${idx2}`);
  return false;
};
