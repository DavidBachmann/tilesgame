import { CONSTANTS } from "./constants";
import { TileType } from "./types";

declare global {
  interface Window {
    DEBUG_MESSAGES: boolean;
  }
}

export function random_between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const delay = (t: number) => {
  return new Promise((resolve) => setTimeout(resolve, t));
};

export const debug_message = (
  message: string,
  color: "green" | "red" | "black" = "black"
): void => {
  const colors = {
    red: "#ff595f",
    green: "#8ac927",
    black: "#123",
  };

  if (window.DEBUG_MESSAGES) {
    console.log(`%c${message}`, `color: ${colors[color]}`);
  }
};

export const useParams = (param: string) => {
  const params = new URLSearchParams(window.location.search);

  if (params === null) {
    return;
  }

  return params.get(param);
};

export const typeToColor = (type: TileType) => {
  switch (type) {
    case 0: {
      return CONSTANTS.COLORS.RED.normal;
    }
    case 1: {
      return CONSTANTS.COLORS.YELLOW.normal;
    }
    case 2: {
      return CONSTANTS.COLORS.GREEN.normal;
    }
    case 3: {
      return CONSTANTS.COLORS.BLUE.normal;
    }
    case 4: {
      return CONSTANTS.COLORS.PURPLE.normal;
    }
    default: {
      return CONSTANTS.COLORS.YELLOW.normal;
    }
  }
};
