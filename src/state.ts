import create from "zustand";
import { combine } from "zustand/middleware";
import { Tile } from "./types";

type State = {
  tiles: Tile[];
  selectedTiles: [Tile | null, Tile | null];
};

const initialState: State = {
  tiles: [],
  selectedTiles: [null, null],
};

export const useTileStore = create(
  combine(initialState, (set) => ({
    actions: {
      update: (tiles: Tile[]) => set({ tiles }),
    },
  }))
);
