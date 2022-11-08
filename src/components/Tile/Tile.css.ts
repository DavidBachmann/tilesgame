import { motion } from "framer-motion";
import { animated } from "@react-spring/web";
import styled from "styled-components";
import { CONSTANTS } from "../../constants";

export const root = styled(motion.div)({
  position: "relative",
});

export const tile = styled(motion.div)({
  background:
    "linear-gradient(240deg, var(--color-bg-from, transparent), var(--color-bg-to, transparent))",
  backgroundOrigin: "border-box",
  border: "2px solid transparent",
  borderRadius: 10,
  boxShadow: "0 4px 0 var(--color-shadow, transparent)",
  boxSizing: "border-box",
  height: CONSTANTS.TILE_SIZE,
  overflow: "hidden",
  position: "relative",
  cursor: "grab",
  transition: "opacity 0.1s",
  width: CONSTANTS.TILE_SIZE,
  "@media (pointer: fine)": {
    "&:hover": {
      borderColor: "rgba(255,255,255,0.1)",
    },
    "&:hover::after": {
      opacity: 0.6,
    },
  },
  "&::after": {
    background: "transparent",
    borderRadius: "50%",
    boxShadow: "0px 0px 10px 16px rgba(255, 255, 255, 0.2)",
    content: "''",
    opacity: 0.4,
    position: "absolute",
    right: "10px",
    top: "10px",
    transition: "opacity 0.2s",
    zIndex: 1,
  },
  "&::before": {
    background: "var(--color-shadow)",
    borderRadius: "50%",
    boxShadow: "0px 1px 0px rgba(0,0,0,0.2)",
    content: "''",
    inset: 4,
    opacity: 0,
    position: "absolute",
    transition: "opacity 0.2s",
    zIndex: 1,
  },
  '&[data-visually-disabled="true"]': {
    opacity: 0.9,
    cursor: "unset",
  },
  '&[data-focus="true"]:not([data-visually-disabled="true"])': {
    cursor: "grabbing",
  },
  '&[data-selected="true"]::before': {
    opacity: 0.2,
  },
  '&[data-type="-1"]': {
    "&::before, &::after": {
      content: "initial",
    },
  },
  '&[data-type="0"]': {
    "--color-shadow": CONSTANTS.COLORS.RED.shadow,
    "--color-bg-from": CONSTANTS.COLORS.RED.normal,
    "--color-bg-to": CONSTANTS.COLORS.RED.secondary,
  },
  '&[data-type="1"]': {
    "--color-shadow": CONSTANTS.COLORS.YELLOW.shadow,
    "--color-bg-from": CONSTANTS.COLORS.YELLOW.normal,
    "--color-bg-to": CONSTANTS.COLORS.YELLOW.secondary,
  },
  '&[data-type="2"]': {
    "--color-shadow": CONSTANTS.COLORS.GREEN.shadow,
    "--color-bg-from": CONSTANTS.COLORS.GREEN.normal,
    "--color-bg-to": CONSTANTS.COLORS.GREEN.secondary,
  },
  '&[data-type="3"]': {
    "--color-shadow": CONSTANTS.COLORS.BLUE.shadow,
    "--color-bg-from": CONSTANTS.COLORS.BLUE.normal,
    "--color-bg-to": CONSTANTS.COLORS.BLUE.secondary,
  },
  '&[data-type="4"]': {
    "--color-shadow": CONSTANTS.COLORS.PURPLE.shadow,
    "--color-bg-from": CONSTANTS.COLORS.PURPLE.normal,
    "--color-bg-to": CONSTANTS.COLORS.PURPLE.secondary,
  },
});

export const explosion = styled(motion.div)({
  background: CONSTANTS.COLORS.WHITE.normal,
  borderRadius: 10,
  boxShadow: `0 4px 0 ${CONSTANTS.COLORS.WHITE.shadow}`,
  inset: 0,
  position: "absolute",
});

export const draggable = styled(animated.div)({
  userSelect: "none",
  touchAction: "none",
  height: CONSTANTS.TILE_SIZE,
  width: CONSTANTS.TILE_SIZE,
  willChange: "transform",
});
