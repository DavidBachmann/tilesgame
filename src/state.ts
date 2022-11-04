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
  spawn_tiles,
} from "./logic";
import { Tile } from "./types";

type State = {
  tiles: Tile[];
  selectedTiles: [Tile | null, Tile | null];
  selection: number[];
  score: number;
};

const initialState: State = {
  tiles: [],
  selectedTiles: [null, null],
  selection: [],
  score: 0,
};

export const useTileStore = create(
  combine(initialState, (set) => {
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
          set((state) => ({
            selection: queue(id, state.selection),
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
      },
    };
  })
);

// queue(tile.idx, prev));
