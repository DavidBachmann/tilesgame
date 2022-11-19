import { createContext, ReactNode, useContext } from "react";
import { v4 } from "uuid";
import Prando from "prando";
import { Config } from "../types";
import { clamp, convert_date_to_UTC } from "../utils";

function seed_from_v4(v4str: string) {
  // This is a v4 uuid
  if (v4str.length === 36) {
    return v4str.substring(0, 8);
  }

  return v4str;
}

const defaultValue = {
  gridSize: 6,
  tileTypes: 6,
  random: () => Math.random(),
  seed: seed_from_v4(v4()),
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

function get_from_query(query: string, cast = false) {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const value = params.get(query);

  if (!value) {
    return undefined;
  }

  const returned = cast ? parse(value) : value;

  return returned;
}

const specialSeeds = ["today", "yesterday"] as const;
type SpecialSeed = typeof specialSeeds[number];

function handle_special_seed(seed: SpecialSeed) {
  switch (seed) {
    case "today": {
      return convert_date_to_UTC(new Date()).toISOString();
    }
    case "yesterday": {
      const d = new Date();
      const yd = d.setDate(d.getDate() - 1);
      return convert_date_to_UTC(new Date(yd)).toISOString();
    }
    default: {
      return seed_from_v4(v4());
    }
  }
}

function parse_seed(seed: string) {
  if (specialSeeds.includes(seed as SpecialSeed)) {
    return handle_special_seed(seed as SpecialSeed);
  }

  return seed;
}

const MIN_GRID_SIZE = 3;
const MAX_GRID_SIZE = 8;

const MIN_TILE_TYPES = 3;
const MAX_TILE_TYPES = 6;

export function ConfigProvider({
  children,
  value = defaultValue,
}: {
  children: ReactNode;
  value?: Config;
}) {
  const gridSize = get_from_query("gridSize", true) as number;
  const tileTypes = get_from_query("tileTypes", true) as number;
  const seed = (get_from_query("seed") as string) || seed_from_v4(v4());
  const prando = new Prando(seed);
  const random = () => prando.next();

  const merged = {
    ...value,
    seed: parse_seed(seed),
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
