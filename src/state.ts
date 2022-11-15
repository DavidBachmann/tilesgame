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
  is_grid_solvable,
} from "./logic";
import { Config, GameMode, GameStatus, State, Tile } from "./types";
import { combo_counter, debug_message, delay } from "./utils";

const reset = (
  gameId: string,
  gameMode: GameMode,
  status: GameStatus = "pregame"
) => ({
  tiles: [],
  selection: [],
  interactive: true,
  queue: new Map(),
  game: {
    score: 0,
    status,
    id: gameId,
    gameMode,
  },
  timer: {
    count: CONSTANTS.TIME_ATTACK.TIMER_START,
  },

  combo: {
    count: 0,
    message: null,
    score: 0,
  },
  message: {
    queue: new Set(),
    current: {
      heading: "",
      subtitle: "",
    },
    uuid: "",
  },
});

const initialState = {
  ...reset(v4(), "casual"),
  actions: {
    init: () => {},
    add_to_selection: () => {},
    set_game_status: () => {},
    add_to_timer: () => {},
    set_timer: () => {},
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
            message: null,
            count: 0,
          },
        });
      }

      async function empty_message_queue() {
        const queue = get().message.queue;
        for await (const message of queue) {
          set((state) => ({
            message: {
              ...state.message,
              current: message,
              uuid: v4(),
            },
          }));
          await delay(CONSTANTS.MESSAGE_ANIMATION.ms);
        }

        await delay(CONSTANTS.MESSAGE_ANIMATION.ms / 2);

        // Clean up
        set({
          message: {
            queue: new Set(),
            current: {
              heading: "",
              subtitle: "",
            },
            uuid: v4(),
          },
        });
      }

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

        let quadBonusPoints = 0;
        let quintBonusPoints = 0;

        let quadBonusTime = 0;
        let quintBonusTime = 0;

        if (totalQuadMatches) {
          // Apply bonus points for matching 4 in a row
          quadBonusPoints = CONSTANTS.POINTS_BONUS.QUAD * totalQuadMatches;
          // Apply bonus time for matching 4 in a row
          quadBonusTime =
            CONSTANTS.TIME_ATTACK.TIMER_QUAD_ADD_BONUS * totalQuadMatches;
        }

        if (totalQuintMatches) {
          // Apply bonus points for matching 5 in a row
          quintBonusPoints = CONSTANTS.POINTS_BONUS.QUINT * totalQuintMatches;
          // Apply bonus time for matching 5 in a row
          quintBonusTime =
            CONSTANTS.TIME_ATTACK.TIMER_QUINT_ADD_BONUS * totalQuintMatches;
        }

        const bonusPoints = quadBonusPoints + quintBonusPoints;

        const timeAddition =
          CONSTANTS.TIME_ATTACK.TIMER_ADD + quadBonusTime + quintBonusTime;

        if (matches.length) {
          const deleted = delete_matches({
            tiles,
            matches,
            scoreCallback: (score) => {
              set((state) => ({
                combo: {
                  ...state.combo,
                  score: score + state.combo.score + bonusPoints,
                },
              }));
            },
          });

          set((state) => ({
            combo: {
              ...state.combo,
              count: state.combo.count + 1,
            },
          }));

          if (get().game.gameMode === "time-attack") {
            set((state) => ({
              timer: {
                count: Math.min(
                  CONSTANTS.TIME_ATTACK.TIMER_START,
                  state.timer.count + timeAddition
                ),
              },
            }));
          }

          enqueue(deleted);
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
        const comboCount = get().combo.count;
        const scoreToAdd = get().combo.score;
        const gameMode = get().game.gameMode;
        const multiplier = combo_counter(comboCount);

        debug_message("LOCKED", "red");

        // Lock user interactions, clear selection
        set({ interactive: false, selection: [] });

        for (const [id, tiles] of q) {
          q.delete(id);

          await delay(CONSTANTS.TILE_ANIMATION.ms);

          set({ tiles, queue: q });
        }

        set((state) => ({
          game: {
            ...state.game,
            score: state.game.score + scoreToAdd * multiplier,
          },
        }));

        if (multiplier >= 3) {
          if (gameMode === "time-attack") {
            set({
              timer: {
                count: CONSTANTS.TIME_ATTACK.TIMER_START,
              },
            });
          }

          if (gameMode !== "time-attack") {
            set((state) => ({
              message: {
                ...state.message,
                queue: state.message.queue.add({
                  heading: `${multiplier} x multiplier`,
                  subtitle: `${state.combo.score * multiplier} points`,
                }),
              },
            }));
          }
        }
        if (multiplier >= 4 && gameMode !== "time-attack") {
          set((state) => ({
            message: {
              ...state.message,
              queue: state.message.queue.add({
                heading: "Awesome!",
              }),
            },
          }));
        }

        // Check if grid is solvable
        const solvable = is_grid_solvable(get().tiles, config);

        if (!solvable) {
          debug_message("GAME OVER", "red");
          set((state) => ({
            game: {
              ...state.game,
              status: "game-over",
            },
            message: {
              ...state.message,
              queue: state.message.queue.add({
                heading: "Game over",
              }),
            },
          }));
        }

        // Post all messages we have for the player
        empty_message_queue();

        // Reset interactivity state
        set({ interactive: true });
        debug_message("unlocked", "green");
      };

      if (import.meta.hot) {
        import.meta.hot.accept(() => {
          // Re-initialize on HMR to prevent re-submission of high scores etc.
          get().actions.init();
        });
      }

      return {
        actions: {
          init: (gameMode = "casual", status = "pregame") => {
            set((state) => ({
              ...state,
              ...(reset(
                v4(),
                gameMode as GameMode,
                status as GameStatus
              ) as Partial<State>),
              gameMode,
              tiles: create_grid(config),
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
          add_to_timer: (add: number) => {
            set((prev) => ({
              timer: {
                count: prev.timer.count + add,
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
