// This is the minimal state I need to reproduce a score from moves.
// TODO: Avoid duplication and combine this with the regular game state.

import { v4 } from "uuid";
import create from "zustand/vanilla";
import { combine } from "zustand/middleware";
import {
  create_grid,
  swap_two_tiles,
  bubble_up,
  delete_matches,
  solve,
  spawn_tiles,
  check_swap,
} from "../../../src/logic";
import { Config, Tile } from "../../../src/types";
import { combo_counter } from "../../../src/utils";

type GameState = {
  score: number;
};

type State = {
  tiles: Tile[];
  queue: Map<string, { tiles: Tile[]; score?: number; time?: number }>;
  game: GameState;
  combo: {
    count: number;
    score: number;
  };
  actions: {
    init: () => void;
  };
};

const reset = {
  tiles: [],
  queue: new Map(),
  game: {
    score: 0,
  },
  combo: {
    count: 0,
    score: 0,
  },
};

const initialState = {
  ...reset,
  actions: {
    init: () => {},
    solve_match: () => {},
  },
} as State;

export const store = (config: Config) =>
  create(
    combine(initialState, (set, get) => {
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
          const { tiles: deleted, score } = delete_matches({
            tiles,
            matches,
          });

          set((state) => ({
            combo: {
              ...state.combo,
              count: state.combo.count + 1,
            },
          }));

          enqueue(deleted, score);
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

        for (const [id, entry] of q) {
          q.delete(id);

          set((prev) => ({
            tiles: entry.tiles,
            queue: q,
            game: { score: prev.game.score + (entry.score ?? 0) },
            combo: {
              ...prev.combo,
              score: prev.combo.score + (entry.score ?? 0),
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
      };

      return {
        actions: {
          init: () => {
            const tiles = create_grid(config);
            set((state) => ({
              ...state,
              ...reset,
              tiles,
            }));
            config.random.reset();
          },
          solve_match: (match: [number, number]) => {
            // Reset combo state
            set({
              combo: {
                score: 0,
                count: 0,
              },
            });

            if (!check_swap(match[0], match[1], get().tiles, config)) {
              return;
            }

            const unsolved = swap_two_tiles(
              match[0],
              match[1],
              get().tiles,
              config,
              true
            );

            return prepare_and_add_to_queue(unsolved);
          },
        },
      };
    })
  );
