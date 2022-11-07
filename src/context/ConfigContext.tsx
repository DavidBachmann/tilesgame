import { createContext, ReactNode, useContext } from "react";
import { Config } from "../types";

const defaultValue = {
  gridSize: 6,
  tileTypes: 4,
};

const ConfigContext = createContext<Config>({
  ...defaultValue,
});

export const useConfig = () => useContext(ConfigContext);

export function ConfigProvider({
  children,
  value = defaultValue,
}: {
  children: ReactNode;
  value?: Config;
}) {
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}
