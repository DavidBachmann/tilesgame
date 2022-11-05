import create from "zustand";
import { combine } from "zustand/middleware";
import {
  create_grid,
  check_swap,
  push_tile_selection,
  swap_two_tiles,
  bubble_up,
  delete_matches,
  solve,
  spawn_tiles,
} from "./logic";
import { Tile } from "./types";

type State = {
  tiles: Tile[];
  selectedTiles: [Tile | null, Tile | null];
  selection: number[];
  score: number;
  interactive: boolean;
};

const initialState: State = {
  tiles: [],
  selectedTiles: [null, null],
  selection: [],
  score: 0,
  interactive: true,
};

export const useTileStore = create(
  combine(initialState, (set, get) => {
    const prepare = (unsolved: Tile[]): Tile[] => {
      const { tiles, matches } = solve(unsolved);

      if (matches.length) {
        return prepare(
          bubble_up(
            delete_matches({
              tiles,
              matches,
              scoreCallback: (score) => {
                set((prev) => ({ score: score + prev.score }));
              },
            })
          )
        );
      }

      return tiles;
    };

    return {
      actions: {
        init: () => set({ tiles: create_grid() }),
        spawnTiles: () =>
          set((state) => ({ tiles: prepare(spawn_tiles(state.tiles)) })),
        addToSelection: (id: number) => {
          if (!get().interactive) {
            // If the board isn't interactive we ignore the selection
            return;
          }

          set((state) => ({
            selection: push_tile_selection(id, state.selection),
          }));
          set((state) => {
            const [idx1, idx2] = state.selection;
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
        lock: () => set({ interactive: false }),
        unlock: () => set({ interactive: true }),
      },
    };
  })
);
