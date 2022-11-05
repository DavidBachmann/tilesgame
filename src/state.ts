import { v4 } from "uuid";
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
import { debug_message, delay } from "./utils";

type State = {
  tiles: Tile[];
  selectedTiles: [Tile | null, Tile | null];
  selection: number[];
  score: number;
  interactive: boolean;
  queue: Map<string, Tile[]>;
};

const initialState: State = {
  tiles: [],
  selectedTiles: [null, null],
  selection: [],
  score: 0,
  interactive: true,
  queue: new Map(),
};

export const useTileStore = create(
  combine(initialState, (set, get) => {
    const enqueue = (t: Tile[]) => {
      const q = get().queue;
      const temp = new Map(q);
      const id = v4();
      temp.set(id, t);

      console.log("queue is now", temp);
      set({ queue: temp });
      return;
    };

    const prepare_and_add_to_queue = (unsolved: Tile[]): void => {
      const { tiles, matches } = solve(unsolved);

      if (matches.length) {
        const deleted = delete_matches({
          tiles,
          matches,
          scoreCallback: (score) => {
            set((prev) => ({ score: score + prev.score }));
          },
        });
        enqueue(deleted);
        const bubbled = bubble_up(deleted);
        enqueue(bubbled);
        const spawned = spawn_tiles(bubbled);
        enqueue(spawned);

        prepare_and_add_to_queue(spawned);
        return;
      }

      enqueue(tiles);
      solveQueue();
    };

    const solveQueue = async () => {
      const q = get().queue;
      const length = q.size;

      debug_message("LOCKED", "red");
      set({ interactive: false });

      for (const [id, tiles] of q) {
        q.delete(id);

        console.log("queue is now", q);
        await delay(500);
        set({ tiles, queue: q });
      }

      debug_message("UNLOCKED", "green");
      set({ interactive: true });

      if (length >= 7 && length < 10) {
        debug_message("Nice.", "green");
        debug_message(
          "You should have gotten a 2x score multiplier for that.",
          "green"
        );
      }
      if (length >= 10) {
        debug_message("WOW!", "green");
        debug_message(
          "You should have gotten a 3x score multiplier for that!",
          "green"
        );
      }
    };

    return {
      actions: {
        init: () => set({ tiles: create_grid() }),
        getQueue: () => {
          return get().queue;
        },
        addToSelection: (id: number) => {
          if (!get().interactive) {
            // If the board isn't interactive we ignore the selection
            return;
          }

          set((state) => ({
            selection: push_tile_selection(id, state.selection),
          }));

          const [idx1, idx2] = get().selection;
          const tiles = get().tiles;

          if (isNaN(idx1 + idx2)) {
            return;
          }

          if (!check_swap(idx1, idx2, tiles)) {
            return;
          }

          return prepare_and_add_to_queue(swap_two_tiles(idx1, idx2, tiles));
        },
        lock: () => set({ interactive: false }),
        unlock: () => set({ interactive: true }),
      },
    };
  })
);
