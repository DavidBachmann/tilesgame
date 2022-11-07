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
  get_quad_matches,
  get_quint_matches,
} from "./logic";
import { Config, State, Tile } from "./types";
import { debug_message, delay } from "./utils";

const initialState: State = {
  tiles: [],
  selection: [],
  score: 0,
  comboScore: 0,
  comboMessage: null,
  comboCount: 0,
  interactive: true,
  queue: new Map(),
  actions: {
    init: () => {},
    addToSelection: () => {},
  },
};

export const store = (config: Config) =>
  create(
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

        const totalQuadMatches = get_quad_matches(matches);
        const totalQuintMatches = get_quint_matches(matches);

        let quadPoints = 0;
        let quintPoints = 0;

        // Apply bonus points for matching 4 in a row
        if (totalQuadMatches) {
          quadPoints = CONSTANTS.POINTS_BONUS.QUAD * totalQuadMatches;
        }

        // Apply bonus points for matching 5 in a row
        if (totalQuintMatches) {
          quintPoints = CONSTANTS.POINTS_BONUS.QUINT * totalQuintMatches;
        }

        if (matches.length) {
          const deleted = delete_matches({
            tiles,
            matches,
            scoreCallback: (score) => {
              set((prev) => ({
                comboScore: score + prev.comboScore + quadPoints + quintPoints,
              }));
            },
          });
          set((prev) => ({
            comboCount: prev.comboCount + 1,
          }));
          enqueue(deleted);
          const bubbled = bubble_up(deleted, config);
          enqueue(bubbled);
          const spawned = spawn_tiles(bubbled, config);
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
            set({ tiles: create_grid(config) });
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

            if (!check_swap(idx1, idx2, tiles, config)) {
              return;
            }

            return prepare_and_add_to_queue(
              swap_two_tiles(idx1, idx2, tiles, config)
            );
          },
        },
      };
    })
  );
