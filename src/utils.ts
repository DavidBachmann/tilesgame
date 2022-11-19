import { CONSTANTS } from "./constants";
import { TileType } from "./types";

declare global {
  interface Window {
    DEBUG_MESSAGES: boolean;
  }
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

export const throttle = <
  F extends (...args: any[]) => ReturnType<F> | Promise<ReturnType<F>>
>(
  func: F,
  waitFor: number
) => {
  const now = () => new Date().getTime();
  const resetStartTime = () => (startTime = now());
  let timeout: ReturnType<typeof setInterval>;
  let startTime: number = now() - waitFor;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      const timeLeft = startTime + waitFor - now();
      if (timeout) {
        clearTimeout(timeout);
      }
      if (startTime + waitFor <= now()) {
        resetStartTime();
        resolve(func(...args));
      } else {
        timeout = setTimeout(() => {
          resetStartTime();
          resolve(func(...args));
        }, timeLeft);
      }
    });
};

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const combo_counter = (combo: number) => {
  return Math.min(
    CONSTANTS.MAX_MULTIPLIER,
    Math.floor(Math.max(1, combo + 1) / 2)
  );
};

export function convert_date_to_UTC(date: Date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

const pluralRules = new Intl.PluralRules("en-US", { type: "ordinal" });

const suffixes = new Map([
  ["one", "st"],
  ["two", "nd"],
  ["few", "rd"],
  ["other", "th"],
]);

export const format_ordinals = (n: number) => {
  const rule = pluralRules.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
};

const round = (x: number) => (x + 0.5) << 0;

export function clampy(
  from: number,
  to: number,
  fromWidth: number,
  toWidth: number
) {
  const f = round(from);
  const t = round(to);

  return `clamp(${f}px, calc(${f}px + (${t} - ${f}) * (100vw - ${fromWidth}px) / (${toWidth} - ${fromWidth})), ${t}px)`;
}
