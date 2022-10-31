import { ReactNode } from "react";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const expand = (xs: any[], n: number): any[] =>
  xs.length <= n ? [xs] : [xs.slice(0, n), ...expand(xs.slice(n), n)];

type Relationships = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type TilePosition = {
  row: number;
  col: number;
};

type TileType = 0 | 1 | 2 | 3;

type Tile = {
  relationships: Relationships;
  type: TileType;
  idx: number;
  position?: TilePosition;
};

const CONSTANTS = {
  DIRECTIONS: ["top", "right", "bottom", "left"] as const,
  REGULAR_HIT: 3,
};

type Directions = typeof CONSTANTS.DIRECTIONS[number];
type Grid = Tile[][];

const initialize_grid = (count: 6) => {
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

const calculate_relationships = (nodes: Tile[], dimension: number): Grid => {
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

// Solve takes a grid and finds matches
const solve = (grid: Grid) => {
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

// Create tries to generate a grid without any matches
const create = (): Grid => {
  const newGrid = initialize_grid(6);
  const flat = newGrid.flat();

  const m = [];

  for (let i = 0; i < flat.length; i++) {
    const node = flat[i];
    const hits = CONSTANTS.DIRECTIONS.map((direction) =>
      seek(node, direction, newGrid)
    ).filter((arr) => arr.length >= CONSTANTS.REGULAR_HIT);

    m.push(hits);
  }

  const matches = m.filter((arr) => arr.some(Boolean));

  // We created some matches, try again.
  if (matches.length) {
    return create();
  }

  // That's better
  return newGrid;
};

const seek = (
  node: Tile,
  direction: Directions,
  grid: Grid,
  hits: Tile[] = []
): Tile[] => {
  const arr = [...hits];

  arr.push(node);

  const nextNode = getTileAtIndex(node.relationships[direction], grid);

  if (nextNode === null) {
    return arr;
  }

  if (node.type !== nextNode.type) {
    return arr;
  }

  return seek(nextNode, direction, grid, arr);
};

const getTileAtIndex = (index: number, grid: Grid) => {
  const flat = grid.flat();
  const found = flat[index];

  if (found) {
    return found;
  }

  return null;
};

const Grid = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
);

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex" }}>{children}</div>
);

const TileDiv = ({ type, idx, relationships }: Tile) => {
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
      title={Object.values(relationships).toString()}
    >
      {String(idx).padStart(2, "0")}
    </div>
  );
};

export default function App() {
  const grid = create();
  const { matches } = solve(grid);

  console.log(matches);

  return (
    <Grid>
      {grid.map((row, index) => (
        <Row key={index}>
          {row.map((tile) => (
            <TileDiv
              key={tile.idx}
              idx={tile.idx}
              type={tile.type as TileType}
              relationships={tile.relationships}
            />
          ))}
        </Row>
      ))}
    </Grid>
  );
}
