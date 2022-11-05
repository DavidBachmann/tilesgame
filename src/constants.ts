const colors = {
  RED: { secondary: "#d0321e", normal: "#f71919" },
  YELLOW: { normal: "#ffca3a", secondary: "#ffba00" },
  GREEN: { normal: "#8ac926", secondary: "#78a432" },
  BLUE: { secondary: "#33859c", normal: "#27b2da" },
  PURPLE: { secondary: "#8b21aa", normal: "#bc1cea" },
};
export const CONSTANTS = {
  DIRECTIONS: ["top", "right", "bottom", "left"] as const,
  REGULAR_HIT: 3,
  DIMENSIONS: 6,
  TILE_SIZE: 48,
  TILE_TYPES: 4,
  TILE_ANIMATION_MS: 300,
  COLORS: colors,
};
