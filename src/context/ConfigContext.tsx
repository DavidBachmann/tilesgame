import { createContext, ReactNode, useContext } from "react";
import { v4 } from "uuid";
import Prando from "prando";
import { Config } from "../types";
import { clamp } from "../utils";

const defaultValue = {
  gridSize: 6,
  tileTypes: 5,
  random: () => Math.random(),
};

const ConfigContext = createContext<Config>({
  ...defaultValue,
});

export const useConfig = () => useContext(ConfigContext);

const parse = (value: string) => {
  const result = parseFloat(value);

  if (isNaN(result)) {
    return undefined;
  }

  return result;
};

function getFromQuery(query: string, cast = false) {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const value = params.get(query);

  if (!value) {
    return undefined;
  }

  const returned = cast ? parse(value) : value;

  return returned;
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
  const gridSize = getFromQuery("gridSize", true) as number;
  const tileTypes = getFromQuery("tileTypes", true) as number;
  const seed = (getFromQuery("seed") as string) || v4();
  const prando = new Prando(seed);
  const random = () => prando.next();

  const merged = {
    ...value,
    random,
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
