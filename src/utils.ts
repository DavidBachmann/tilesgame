export function random_between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const delay = (t: number) => {
  return new Promise((resolve) => setTimeout(resolve, t));
};
