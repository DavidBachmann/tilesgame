import create from "zustand";
import { combine } from "zustand/middleware";
import { Grid, Tile } from "./types";

type State = {
  grid: Grid;
  selectedTiles: [Tile | null, Tile | null];
};

const initialState: State = {
  grid: [],
  selectedTiles: [null, null],
};

export const useTileStore = create(
  combine(initialState, (set) => ({
    actions: {
      update_grid: (grid: Grid) => set({ grid }),
      select_tiles: (tiles: [Tile | null, Tile | null]) =>
        set({ selectedTiles: tiles }),
    },
  }))
);
