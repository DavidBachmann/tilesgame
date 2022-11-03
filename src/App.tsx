import { useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";
import { Tile, TileType, Directions } from "./types";
import { CONSTANTS } from "./constants";
import { useTileStore } from "./state";
import { Grid } from "./components/Grid";
import { Tile as TileCell } from "./components/Tile";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const initialize_grid = (count: number) => {
  const grid = [];
  const dimensions = count * count;

  for (let i = 0; i < dimensions; i++) {
    const tile: Tile = {
      id: v4(),
      idx: i,
      type: randomBetween(0, 3) as TileType,
      relationships: {
        top: -1,
        right: -1,
        bottom: -1,
        left: -1,
      },
    };

    grid.push(tile);
  }

  return calculate_relationships(grid, count);
};

const calculate_relationships = (nodes: Tile[], dimension: number): Tile[] => {
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

// Matches get turned into empty tiles
const create_empty_tile_at_index = (idx: number): Tile => ({
  id: v4(),
  type: -1,
  relationships: { top: -1, right: -1, bottom: -1, left: -1 },
  idx,
});

// Receives a list of matches and deletes them from the grid
// by replacing them with empties.
const delete_matches = ({
  tiles,
  matches,
}: {
  tiles: Tile[];
  matches: Tile[][];
}): Tile[] => {
  const clone = [...tiles];
  const uniqueMatches = new Set<number>();
  matches.flat().forEach((obj) => uniqueMatches.add(obj.idx));
  const removedIdx = Array.from(uniqueMatches);

  for (let idx of removedIdx) {
    clone[idx] = create_empty_tile_at_index(idx);
  }

  // Deleted tiles need to know their relationships, so we recalculate.
  return calculate_relationships(clone, CONSTANTS.DIMENSIONS);
};

// `Solve` takes a grid and finds matches
const solve = (tiles: Tile[]) => {
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

// `Create` tries to generate a grid without any matches
const create = (): Tile[] => {
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
    return create();
  }

  // That's better
  return new_grid;
};

const seek = (
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
  if (nextNode === null) {
    return arr;
  }

  // We're crashing here for some reason.
  if (node.idx === nextNode.idx) {
    console.log("node.idx === nextNode.idx");
    return arr;
  }

  // Next node is of another type, we're not interested in exploring further.
  if (node.type !== nextNode.type) {
    return arr;
  }

  return seek(nextNode, direction, tiles, arr);
};

const get_tile_at_index = (index: number, tiles: Tile[]) => {
  const found = tiles[index];

  if (found) {
    return found;
  }

  return null;
};

const swap_two_tiles_and_solve = (
  firstTile: Tile,
  secondTile: Tile,
  tiles: Tile[]
): Tile[] => {
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
    const grid = delete_matches(solve(unsolved));

    return grid;
  }

  return tiles;
};

const queue = (insert: number, arr: number[]): number[] => {
  let a = [...arr];

  a.push(insert);

  if (a.length > 2) {
    a = [insert];
  }

  return a;
};

const check_swap = (tile1: Tile, tile2: Tile) => {
  // TODO: This allows too much
  if (
    Object.values(tile1.relationships).includes(tile2.idx) &&
    Object.values(tile2.relationships).includes(tile1.idx) &&
    tile1.type !== -1 &&
    tile2.type !== -1
  ) {
    console.log(`Swapping ${tile1.idx} and ${tile2.idx}`);
    return true;
  }

  console.log(`Can't swap ${tile1.idx} and ${tile2.idx}`);
  return false;
};

const bubble_up = (tiles: Tile[]) => {
  let t: Tile[] = [...tiles];
  let returned = t;

  for (let i = 0; i < t.length; i++) {
    const tile = t[i];
    // This time has been deleted and it should bubble up
    if (tile.type === -1) {
      // Figure out how many tiles are above this one.
      let totalAbove = Math.floor(tile.idx / CONSTANTS.DIMENSIONS) ?? 0;

      // console.log(`Above ${tile.idx}: ${totalAbove}`);

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

  return delete_matches(solve(returned));
};

export default function App() {
  const latestTiles = useTileStore((state) => state.tiles);
  const update = useTileStore((state) => state.actions.update);

  useMemo(() => update(create()), []);

  const [selection, set] = useState<number[]>([]);

  // TODO: There's a bug here because we are only handling matches that happen because
  // of manual swapping/selecting, and not when they happen as a byproduct of a deletion/bubbling

  useEffect(() => {
    const [id1, id2] = selection;

    // If both are actually number
    if (!Number.isNaN(id1 + id2)) {
      const tile1 = get_tile_at_index(id1, latestTiles);
      const tile2 = get_tile_at_index(id2, latestTiles);

      if (!tile1 || !tile2) {
        throw new Error("Tile not found");
      }

      const legalSwap = check_swap(tile1, tile2);

      // and if this is a legal move
      if (legalSwap) {
        const tiles = swap_two_tiles_and_solve(tile1, tile2, latestTiles);

        const bubbled = bubble_up(tiles);

        update(bubbled);
      }
    }
  }, [selection]);

  const grid = latestTiles;

  if (!Array.isArray(grid)) {
    console.log(grid);
    return <div>wtf</div>;
  }

  console.log("render");

  return (
    <Grid>
      {grid.map((tile) => (
        <div key={tile.id}>
          <TileCell
            id={tile.id}
            idx={tile.idx}
            type={tile.type as TileType}
            selected={selection.includes(tile.idx)}
            relationships={tile.relationships}
            onClick={() => {
              set((prev) => queue(tile.idx, prev));
            }}
          />
        </div>
      ))}
    </Grid>
  );
}
