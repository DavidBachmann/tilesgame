import { useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";
import { Tile, TileType, Directions } from "./types";
import { CONSTANTS } from "./constants";
import { useTileStore } from "./state";
import { Grid } from "./components/Grid";

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
      position: {
        row: Math.floor(i / count),
        col: i % count,
      },
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
  position: {
    row: -1,
    col: -1,
  },
});

// Deleted matches need to bubble up, moving tiles down
const move_down = ({ grid, matches }: { grid: Tile[]; matches: Tile[][] }) => {
  const clone = [...grid];

  return { grid: clone, matches };
};

// Receives a list of matches and deletes them from the grid
// by replacing them with empties.
const delete_matches = ({
  tiles,
  matches,
}: {
  tiles: Tile[];
  matches: Tile[][];
}) => {
  const clone = [...tiles];
  const uniqueMatches = new Set<number>();
  matches.flat().forEach((obj) => uniqueMatches.add(obj.idx));
  const removedIdx = Array.from(uniqueMatches);

  for (let idx of removedIdx) {
    clone[idx] = create_empty_tile_at_index(idx);
  }

  return { grid: clone, matches };
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
    console.log("Still happening");
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
): { tiles: Tile[]; matches: Tile[][] } => {
  if (firstTile && secondTile) {
    // Clones the nodes
    const tmp1 = { ...firstTile };
    const tmp2 = { ...secondTile };

    const tmpIdx1 = tmp1.idx;
    const tmpIdx2 = tmp2.idx;

    // Swap idx
    secondTile.idx = tmpIdx1;
    firstTile.idx = tmpIdx2;

    // Swap positional data
    secondTile.position = tmp1.position;
    firstTile.position = tmp2.position;

    // Swap positions
    tiles[tmpIdx1] = secondTile;
    tiles[tmpIdx2] = firstTile;

    const unsolved = calculate_relationships(tiles, CONSTANTS.DIMENSIONS);
    const { grid, matches } = move_down(delete_matches(solve(unsolved)));

    return { tiles: grid, matches };
  }

  return { tiles, matches: [] };
};

type TileB = Tile & {
  onClick?: () => void;
};

const TileDiv = ({ type, idx, position, relationships, onClick }: TileB) => {
  const bg = {
    "-1": "black",
    "0": "purple",
    "1": "green",
    "2": "blue",
    "3": "red",
  };
  return (
    <div
      style={{
        fontSize: 18,
        padding: 10,
        background: bg[type],
      }}
      title={`I am ${idx}, row ${position.row}, col ${
        position.col
      }, (${Object.values(relationships).toString()})`}
      onClick={onClick}
    >
      {String(idx).padStart(2, "0")}
    </div>
  );
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
  if (
    Object.values(tile1.relationships).includes(tile2.idx) &&
    Object.values(tile2.relationships).includes(tile1.idx)
  ) {
    console.log(`Swapping ${tile1.idx} and ${tile2.idx}`);
    return true;
  }

  console.log(`Can't swap ${tile1.idx} and ${tile2.idx}`);
  return false;
};

export default function App() {
  const latestTiles = useTileStore((state) => state.tiles);
  const update = useTileStore((state) => state.actions.update);

  useMemo(() => update(create()), []);

  const [selection, set] = useState<number[]>([]);
  const [matches, setMatches] = useState<Tile[]>([]);

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
        const { tiles, matches } = swap_two_tiles_and_solve(
          tile1,
          tile2,
          latestTiles
        );

        setMatches(matches.flat());
        update(tiles);
      }
    }
  }, [selection]);

  const grid = latestTiles;

  return (
    <>
      <Grid>
        {grid.map((tile) => (
          <div key={tile.id}>
            <TileDiv
              id={tile.id}
              idx={tile.idx}
              type={tile.type as TileType}
              position={tile.position}
              relationships={tile.relationships}
              onClick={() => {
                set((prev) => queue(tile.idx, prev));
              }}
            />
          </div>
        ))}
      </Grid>
    </>
  );
}
