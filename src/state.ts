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
  shuffle_tiles,
  spawn_tiles,
  is_grid_solvable,
  create_empty_tiles,
} from "./logic";
import { Config, GameMode, GameStatus, State, Tile } from "./types";
import { combo_counter, debug_message, delay } from "./utils";

const FAST = false;

const reset = (
  gameId: string,
  gameMode: GameMode,
  status: GameStatus = "pregame"
): Partial<State> => ({
  tiles: [],
  empties: [],
  selection: [],
  interactive: true,
  queue: new Map(),
  game: {
    score: 0,
    status,
    id: gameId,
    gameMode,
    moves: [],
  },
  timer: {
    count: CONSTANTS.TIME_ATTACK.TIMER_START,
  },
  combo: {
    count: 0,
    score: 0,
  },
});

const initialState = {
  ...reset(v4(), "casual"),
  actions: {
    init: () => {},
    add_to_selection: () => {},
    set_game_status: () => {},
    set_game_token: () => {},
    set_timer: () => {},
    add_to_moves: () => {},
  },
} as State;

export const store = (config: Config) =>
  create(
    combine(initialState, (set, get) => {
      function prepare_next_state() {
        // Reset state that might have been set during the last move.
        set({
          combo: {
            score: 0,
            count: 0,
          },
        });
      }

      const enqueue = (t: Tile[], score = 0, time = 0) => {
        const q = get().queue;
        const temp = new Map(q);
        const id = v4();
        temp.set(id, { tiles: t, score, time });

        set({ queue: temp });
        return;
      };

      const prepare_and_add_to_queue = (unsolved: Tile[]): void => {
        const { tiles, matches } = solve(unsolved);

        if (matches.length) {
          const {
            tiles: deleted,
            score,
            time,
          } = delete_matches({
            tiles,
            matches,
          });

          set((state) => ({
            combo: {
              ...state.combo,
              count: state.combo.count + 1,
            },
          }));

          enqueue(deleted, score, time);
          const bubbled = bubble_up(deleted, config);
          enqueue(bubbled);
          const spawned = spawn_tiles(bubbled, config);
          enqueue(spawned);

          prepare_and_add_to_queue(spawned);
          return;
        }

        enqueue(tiles);
        solve_queue();
      };

      const solve_queue = async () => {
        const q = get().queue;
        debug_message("LOCKED", "red");

        // Lock user interactions, clear selection
        set({ interactive: false, selection: [] });

        for (const [id, entry] of q) {
          q.delete(id);

          if (!FAST) {
            await delay(CONSTANTS.TILE_ANIMATION.ms);
          }

          set((prev) => ({
            tiles: entry.tiles,
            queue: q,
            game: { ...prev.game, score: prev.game.score + (entry.score ?? 0) },
            combo: {
              ...prev.combo,
              score: prev.combo.score + (entry.score ?? 0),
            },
            timer: {
              count: prev.timer.count + (entry.time ?? 0),
            },
          }));
        }

        const currentlyAdded = get().combo.score;
        const toAdd =
          currentlyAdded * combo_counter(get().combo.count) - currentlyAdded;

        set((state) => ({
          game: {
            ...state.game,
            score: state.game.score + toAdd,
          },
        }));

        // Check if grid is solvable
        const solvable = is_grid_solvable(get().tiles, config);

        if (!solvable) {
          set((state) => ({
            tiles: shuffle_tiles(state.tiles, config),
          }));
        }

        // Reset interactivity state
        set({ interactive: true });
        debug_message("unlocked", "green");
      };

      return {
        actions: {
          init: (gameMode = "casual", status = "pregame") => {
            set((state) => ({
              ...state,
              ...reset(v4(), gameMode as GameMode, status as GameStatus),
              gameMode,
              tiles: create_grid(config),
              empties: create_empty_tiles(config),
            }));
          },
          add_to_selection: (id: number) => {
            if (!get().interactive) {
              // If the board isn't interactive we ignore the selection
              return;
            }

            prepare_next_state();

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

            get().actions.add_to_moves([idx1, idx2]);

            return prepare_and_add_to_queue(
              swap_two_tiles(idx1, idx2, tiles, config, true)
            );
          },
          set_game_status: (gameStatus: GameStatus) => {
            set((state) => ({
              game: {
                ...state.game,
                status: gameStatus,
              },
            }));
          },
          add_to_moves: (moves: [number, number]) => {
            set((state) => ({
              game: {
                ...state.game,
                moves: [...state.game.moves, moves],
              },
            }));
          },
          set_timer: (time: number) => {
            set({
              timer: {
                count: time,
              },
            });
          },
        },
      };
    })
  );
