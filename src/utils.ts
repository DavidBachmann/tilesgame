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
