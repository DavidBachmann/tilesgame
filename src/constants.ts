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

const newColors = {
  WHITE: "#f1f1f1",
  SEA_GREEN: "#6dd8b9",
  BLUE: "#6ca7fe",
  BLUE2: "#2b60f3",
  PURPLE: "#8850f5",
  GRAY: "#2c2b30",
  BLACK: "#030303",
  DARK: "#1c1b20",
};

const POINTS_BONUS = {
  QUAD: 6,
  QUINT: 15,
};

const TIME_ATTACK = {
  TIMER_START: 15000,
  TIMER_ADD: 2000,
  TIMER_QUAD_ADD_BONUS: 1000,
  TIMER_QUINT_ADD_BONUS: 2000,
};

export const CONSTANTS = {
  DIRECTIONS: ["top", "right", "bottom", "left"] as const,
  TILE_SIZE_MAX: 58,
  TILE_SIZE_MIN: 44,
  TILE_GAP_MAX: 12,
  TILE_GAP_MIN: 7,
  TILE_RADIUS_MAX: 16,
  TILE_RADIUS_MIN: 10,
  TILE_ANIMATION: { ms: 300, s: 0.3 },
  MESSAGE_ANIMATION: { ms: 1200, s: 1.2 },
  COLORS: colors,
  NEW_COLORS: newColors,
  MAX_MULTIPLIER: 5,
  POINTS_BONUS,
  TIME_ATTACK,
};
