import create from "zustand";
import { combine } from "zustand/middleware";
import {
  create_grid,
  check_swap,
  queue,
  swap_two_tiles,
  bubble_up,
  delete_matches,
  solve,
} from "./logic";
import { Tile } from "./types";

type State = {
  tiles: Tile[];
  selectedTiles: [Tile | null, Tile | null];
  selection: number[];
};

const initialState: State = {
  tiles: [],
  selectedTiles: [null, null],
  selection: [],
};

const prepare = (unsolved: Tile[]) =>
  bubble_up(delete_matches(solve(unsolved)));

export const useTileStore = create(
  combine(initialState, (set, get) => ({
    actions: {
      // update: (tiles: Tile[]) => set({ tiles }),
      init: () => set({ tiles: create_grid() }),
      addToSelection: (id: number) => {
        set((state) => ({
          selection: queue(id, state.selection),
        }));
        set((state) => {
          const [idx1, idx2] = get().selection;
          const tiles = state.tiles;

          if (isNaN(idx1 + idx2)) {
            return { tiles: prepare(tiles) };
          }

          if (!check_swap(idx1, idx2, tiles)) {
            return { tiles: prepare(tiles) };
          }

          return {
            tiles: prepare(swap_two_tiles(idx1, idx2, tiles)),
          };
        });
      },
    },
  }))
);

// queue(tile.idx, prev));
