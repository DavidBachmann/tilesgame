import { v4 } from "uuid";
import create from "zustand";
import { combine } from "zustand/middleware";
import { CONSTANTS } from "./constants";
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
  selection: number[];
  score: number;
  comboScore: number;
  comboMessage: string | null;
  comboCount: number;
  interactive: boolean;
  queue: Map<string, Tile[]>;
};

const initialState: State = {
  tiles: [],
  selection: [],
  score: 0,
  comboScore: 0,
  comboMessage: null,
  comboCount: 0,
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
            set((prev) => ({ comboScore: score + prev.comboScore }));
          },
        });
        set((prev) => ({
          comboCount: prev.comboCount + 1,
        }));
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
      const comboCount = get().comboCount;
      const scoreToAdd = get().comboScore;
      const multiplier = Math.min(
        CONSTANTS.MAX_MULTIPLIER,
        Math.floor(Math.max(1, comboCount + 1) / 2)
      );

      debug_message("LOCKED", "red");
      // Lock user interactions
      set({ interactive: false });

      // Wait a while for the player to see both selections.
      await delay(500);

      // Clear selection
      set({ selection: [] });
      let i = 0;

      for (const [id, tiles] of q) {
        q.delete(id);

        if (i > 0) {
          const speedUp = 0.01 * i;
          // Speed up the waiting duration during long streaks
          const wait = Math.max(
            ~~(CONSTANTS.TILE_ANIMATION_MS * (1 - speedUp)),
            CONSTANTS.TILE_ANIMATION_MS / 2
          );
          await delay(wait);
        }

        set({ tiles, queue: q });
        i++;
      }

      set((state) => ({ score: state.score + scoreToAdd * multiplier }));

      if (multiplier > 1) {
        set({ comboMessage: `${multiplier}x multiplier!` });
      }

      await delay(multiplier > 1 ? 1000 : 0);

      // Reset interactivity state
      set({
        comboScore: 0,
        comboMessage: null,
        comboCount: 0,
        interactive: true,
      });
      debug_message("UNLOCKED", "green");
    };

    return {
      actions: {
        init: () => {
          set({ tiles: create_grid() });
        },
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
        lock: () => set({ interactive: false, selection: [] }),
        unlock: () => set({ interactive: true, selection: [] }),
      },
    };
  })
);
