import { ReactNode } from "react";
import { StoreApi } from "zustand";
import createContext from "zustand/context";
import { useConfig } from "./context/ConfigContext";
import { store } from "./state";
import { State } from "./types";

const { Provider, useStore } = createContext<StoreApi<State>>();

export { useStore };

export function StoreCreator({ children }: { children: ReactNode }) {
  const config = useConfig();
  return <Provider createStore={() => store(config)}>{children}</Provider>;
}
