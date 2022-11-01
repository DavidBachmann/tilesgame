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

const calculate_relationships = (nodes: Tile[], dimension: number): TGrid => {
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

  const grid = expand(newNodes, dimension);
  return grid;
};

// `Solve` takes a grid and finds matches
const solve = (grid: TGrid) => {
  const flat = grid.flat();

  const m = [];

  for (let i = 0; i < flat.length; i++) {
    const node = flat[i];
    const hits = CONSTANTS.DIRECTIONS.map((direction) =>
      seek(node, direction, grid)
    ).filter((arr) => arr.length >= CONSTANTS.REGULAR_HIT);

    m.push(hits);
  }

  const matches = m.filter((arr) => arr.some(Boolean));

  return { grid, matches };
};

// `Create` tries to generate a grid without any matches
const create = (): TGrid => {
  const new_grid = initialize_grid(CONSTANTS.DIMENSIONS);
  const flat = new_grid.flat();

  const m = [];

  for (let i = 0; i < flat.length; i++) {
    const node = flat[i];
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
  grid: TGrid,
  hits: Tile[] = []
): Tile[] => {
  const arr = [...hits];

  arr.push(node);

  const nextNode = get_tile_at_index(node.relationships[direction], grid);

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

  return seek(nextNode, direction, grid, arr);
};

const get_tile_at_index = (index: number, grid: TGrid) => {
  const flat = grid.flat();
  const found = flat[index];

  if (found) {
    return found;
  }

  return null;
};

const swap_two_tiles_and_solve = (
  firstIdx: number,
  secondIdx: number,
  grid: TGrid
): { grid: TGrid; matches: Tile[][][] } => {
  const firstNode = get_tile_at_index(firstIdx, grid);
  const secondNode = get_tile_at_index(secondIdx, grid);
  const g = grid.flat();

  if (firstNode && secondNode) {
    g[firstIdx] = secondNode;
    g[secondIdx] = firstNode;

    const expanded = expand(g, CONSTANTS.DIMENSIONS);
    const { grid: ugh, matches } = solve(expanded);
    const grid = calculate_relationships(ugh.flat(), CONSTANTS.DIMENSIONS);

    return { grid, matches };
  }

  return { grid, matches: [] };
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
  const latestGrid = useTileStore((state) => state.grid);
  const update_grid = useTileStore((state) => state.actions.update_grid);

  useMemo(() => update_grid(create()), []);

  const [selection, set] = useState<number[]>([]);

  useEffect(() => {
    const [id1, id2] = selection;

    if (id1 && id2) {
      // TODO: if id1 og id2 is a valid selection...
      const { grid, matches } = swap_two_tiles_and_solve(id1, id2, latestGrid);
      console.log(matches);

      update_grid(grid);
    }
  }, [selection]);

  return (
    <>
      <Grid>
        {latestGrid.map((row, index) => (
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
