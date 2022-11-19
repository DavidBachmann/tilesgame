import { motion } from "framer-motion";
import { animated } from "@react-spring/web";
import styled from "styled-components";
import { CONSTANTS } from "../../constants";

export const root = styled(motion.div)({
  position: "relative",
});

export const tileOuter = styled(motion.div)({
  height: `var(--tile-size, ${CONSTANTS.TILE_SIZE_MAX}px)`,
  position: "relative",
  width: `var(--tile-size, ${CONSTANTS.TILE_SIZE_MAX}px)`,
  zIndex: 1,
});

export const tile = styled("div")({
  background:
    "linear-gradient(to bottom, var(--color-1, #fdd94e), var(--color-2, #f5c703))",
  width: "100%",
  height: "100%",
  position: "relative",
  borderRadius: `var(--tile-radius, ${CONSTANTS.TILE_RADIUS_MAX})`,
  cursor: "grab",
  transition: "opacity 0.1s",
  boxSizing: "content-box",
  "&::before": {
    borderRadius: `var(--tile-radius, ${CONSTANTS.TILE_RADIUS_MAX})`,
    content: "''",
    background:
      "linear-gradient(to bottom, var(--color-2, #f4b404), var(--color-1, #f7cb76))",
    top: 5,
    bottom: 5,
    left: 6,
    right: 6,
    position: "absolute",
    zIndex: 1,
  },
  "&::after": {
    content: "''",
    background: "var(--color-3, #bb8b00)",
    position: "absolute",
    top: 4,
    bottom: -4,
    left: 0,
    right: 0,
    zIndex: -1,
    borderRadius: `var(--tile-radius, ${CONSTANTS.TILE_RADIUS_MAX})`,
  },

  '&[data-focus="true"]': {
    cursor: "grabbing",
  },

  '&[data-type="-1"]': {
    "&::before, &::after": {
      content: "initial",
    },
  },

  '&[data-type="0"]': {
    // red
    "--color-1": "#ff877a",
    "--color-2": "#fd3218",
    "--color-3": "#c70500",
  },

  '&[data-type="1"]': {
    // yellow
    "--color-1": "#fdd94e",
    "--color-2": "#f4b404",
    "--color-3": "#bb8b00",
  },
  '&[data-type="2"]': {
    // green
    "--color-1": "#7ef51c",
    "--color-2": "#5dc903",
    "--color-3": "#59a911",
  },
  '&[data-type="3"]': {
    // light blue
    "--color-1": "#19f2f1",
    "--color-2": "#1bc2d4",
    "--color-3": "#05a3aa",
  },
  '&[data-type="4"]': {
    // purple
    "--color-1": "#c4a3f9",
    "--color-2": "#9c6aea",
    "--color-3": "#672de1",
  },
  '&[data-type="5"]': {
    // dark blue
    "--color-1": "#6baffb",
    "--color-2": "#2b60f3",
    "--color-3": "#214fcd",
  },
});

export const explosion = styled(motion.div)({
  background: CONSTANTS.COLORS.WHITE.normal,
  borderRadius: `var(--tile-radius, ${CONSTANTS.TILE_RADIUS_MAX})`,
  height: `var(--tile-size, ${CONSTANTS.TILE_SIZE_MAX}px)`,
  inset: 0,
  position: "absolute",
  width: `var(--tile-size, ${CONSTANTS.TILE_SIZE_MAX}px)`,
});

export const draggable = styled(animated.div)({
  height: `var(--tile-size, ${CONSTANTS.TILE_SIZE_MAX}px)`,
  touchAction: "none",
  userSelect: "none",
  width: `var(--tile-size, ${CONSTANTS.TILE_SIZE_MAX}px)`,
  willChange: "transform",
});
