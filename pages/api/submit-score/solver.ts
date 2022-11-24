import Prando from "prando";
import { Config } from "../../../src/types";
import { store } from "./state";

export const solve_game = (
  moves: [number, number][],
  gridSize: number,
  seed: string
): number => {
  const prando = new Prando(seed);
  const random = {
    next: () => prando.next(),
    reset: () => prando.reset(),
  };

  const config: Config = {
    gridSize,
    seed,
    random,
  };

  const state = store(config);
  const actions = state.getState().actions;

  actions.init();

  for (let i = 0; i < moves.length; i++) {
    actions.solve_match(moves[i]);
  }

  return state.getState().game.score;
};
