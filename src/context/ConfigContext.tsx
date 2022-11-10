import { createContext, ReactNode, useContext } from "react";
import { Config } from "../types";
import { clamp } from "../utils";

const defaultValue = {
  gridSize: 6,
  tileTypes: 5,
};

const ConfigContext = createContext<Config>({
  ...defaultValue,
});

export const useConfig = () => useContext(ConfigContext);

function getFromQuery(query: string) {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const value = params.get(query);

  if (!value) {
    return undefined;
  }

  const result = parseFloat(value);

  if (isNaN(result)) {
    return undefined;
  }

  return result;
}

const MIN_GRID_SIZE = 3;
const MAX_GRID_SIZE = 8;

const MIN_TILE_TYPES = 3;
const MAX_TILE_TYPES = 5;

export function ConfigProvider({
  children,
  value = defaultValue,
}: {
  children: ReactNode;
  value?: Config;
}) {
  const gridSize = getFromQuery("gridSize");
  const tileTypes = getFromQuery("tileTypes");

  const merged = {
    ...value,
    gridSize: gridSize
      ? clamp(gridSize, MIN_GRID_SIZE, MAX_GRID_SIZE)
      : value.gridSize,
    tileTypes: tileTypes
      ? clamp(tileTypes, MIN_TILE_TYPES, MAX_TILE_TYPES)
      : value.tileTypes,
  };

  return (
    <ConfigContext.Provider value={merged}>{children}</ConfigContext.Provider>
  );
}
