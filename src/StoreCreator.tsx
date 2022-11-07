import { StoreApi } from "zustand";
import createContext from "zustand/context";
import { useConfig } from "./context/ConfigContext";
import { Game } from "./Game";
import { useTileStore } from "./state";
import { State } from "./types";

const { Provider, useStore } = createContext<StoreApi<State>>();

export { useStore };

export function StoreCreator() {
  const config = useConfig();
  return (
    <Provider createStore={() => useTileStore(config)}>
      <Game />
    </Provider>
  );
}
