const colors = {
  RED: { secondary: "#d0321e", normal: "#f71919", shadow: "#8b2626" },
  YELLOW: { normal: "#ffca3a", secondary: "#ffba00", shadow: "#b59003" },
  GREEN: { normal: "#8ac926", secondary: "#78a432", shadow: "#54810e" },
  BLUE: { secondary: "#33859c", normal: "#27b2da", shadow: "#156a84" },
  PURPLE: { secondary: "#8b21aa", normal: "#bc1cea", shadow: "#680a82" },
  WHITE: {
    normal: "#efe2e1",
    secondary: "#f7f0ef",
    shadow: "#d6d6d2",
  },
};

const POINTS_BONUS = {
  QUAD: 6,
  QUINT: 15,
};

export const CONSTANTS = {
  DIRECTIONS: ["top", "right", "bottom", "left"] as const,
  TILE_SIZE: 48,
  TILE_ANIMATION: { ms: 300, s: 0.3 },
  MESSAGE_ANIMATION: { ms: 1200, s: 1.2 },
  COLORS: colors,
  MAX_MULTIPLIER: 5,
  TIMER_INITIAL_VALUE: 100,
  POINTS_BONUS,
};
