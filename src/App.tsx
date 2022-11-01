import { useEffect, useMemo, useState } from "react";
import { Grid as TGrid, Tile, TileType, Directions } from "./types";
import { CONSTANTS } from "./constants";
import { useTileStore } from "./state";
import { Grid, Row } from "./components/Grid";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const expand = (xs: any[], n: number): any[] =>
  xs.length <= n ? [xs] : [xs.slice(0, n), ...expand(xs.slice(n), n)];

const initialize_grid = (count: number) => {
  let grid = [];
  const dimensions = count * count;

  for (let i = 0; i < dimensions; i++) {
    const tile: Tile = {
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

  const matches = m.filter((arr) => arr.some(Boolean));

  return { grid: tiles, matches };
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

  arr.push(node);

  const nextNode = get_tile_at_index(node.relationships[direction], tiles);

  if (nextNode === null) {
    return arr;
  }

  if (node.idx === nextNode.idx) {
    // We're crashing here.
    console.log("Still happening");
    return arr;
  }

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
  firstIdx: number,
  secondIdx: number,
  tiles: Tile[]
): { tiles: Tile[]; matches: Tile[][][] } => {
  const firstNode = get_tile_at_index(firstIdx, tiles);
  const secondNode = get_tile_at_index(secondIdx, tiles);

  if (firstNode && secondNode) {
    // Clones the nodes
    const tmp1 = { ...firstNode };
    const tmp2 = { ...secondNode };

    // Swap idx
    secondNode.idx = tmp1.idx;
    firstNode.idx = tmp2.idx;

    // Swap positions
    tiles[firstIdx] = secondNode;
    tiles[secondIdx] = firstNode;

    const unsolved = calculate_relationships(tiles, CONSTANTS.DIMENSIONS);
    const { grid, matches } = solve(unsolved);

    return { tiles: grid, matches };
  }

  return { tiles, matches: [] };
};

type TileB = Tile & {
  onClick?: () => void;
};

const TileDiv = ({ type, idx, relationships, onClick }: TileB) => {
  const bg = {
    0: "purple",
    1: "green",
    2: "blue",
    3: "red",
  };
  return (
    <div
      style={{
        fontSize: 18,
        padding: 10,
        background: bg[type],
      }}
      title={`I am ${idx} (${Object.values(relationships).toString()})`}
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

export default function App() {
  const latestTiles = useTileStore((state) => state.tiles);
  const update = useTileStore((state) => state.actions.update);

  useMemo(() => update(create()), []);

  const [selection, set] = useState<number[]>([]);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const [id1, id2] = selection;

    if (!Number.isNaN(id1 + id2)) {
      // TODO: _AND_ if id1 og id2 is a valid selection...
      const { tiles, matches } = swap_two_tiles_and_solve(
        id1,
        id2,
        latestTiles
      );

      setMatches(matches);
      update(tiles);
    }
  }, [selection]);

  console.log(matches);

  const grid = expand(latestTiles, CONSTANTS.DIMENSIONS) as TGrid;

  return (
    <>
      <Grid>
        {grid.map((row, index) => (
          <Row key={index}>
            {row.map((tile) => (
              <TileDiv
                key={tile.idx}
                idx={tile.idx}
                type={tile.type as TileType}
                relationships={tile.relationships}
                onClick={() => {
                  set((prev) => queue(tile.idx, prev));
                }}
              />
            ))}
          </Row>
        ))}
      </Grid>
    </>
  );
}
