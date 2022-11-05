import { motion } from "framer-motion";
import styled from "styled-components";
import { CONSTANTS } from "../../constants";

export const root = styled(motion.div)({
  position: "relative",
});

export const tile = styled(motion.div)({
  width: CONSTANTS.TILE_SIZE,
  height: CONSTANTS.TILE_SIZE,
  borderRadius: 10,
  transition: "opacity 0.1s",
  cursor: "pointer",
  boxShadow: "0 4px 0 var(--color-shadow, transparent)",
  overflow: "hidden",
  position: "relative",
  background:
    "linear-gradient(240deg, var(--color-bg-from, transparent), var(--color-bg-to, transparent))",
  "&::before": {
    content: "''",
    zIndex: 1,
    position: "absolute",
    background: "transparent",
    borderRadius: "50%",
    right: "10px",
    top: "10px",
    boxShadow: "0px 0px 10px 16px rgba(255, 255, 255, 0.12)",
  },
  '&[data-type="-1"]': {
    "&::before": {
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
  position: "absolute",
  inset: 0,
  borderRadius: 10,
  background: CONSTANTS.COLORS.WHITE.normal,
  boxShadow: `0 4px 0 ${CONSTANTS.COLORS.WHITE.shadow}`,
});
