import { motion } from "framer-motion";
import styled from "styled-components";
import { CONSTANTS } from "../../constants";

const RED = { normal: "#ff595e" };
const YELLOW = { normal: "#ffca3a" };
const GREEN = { normal: "#8ac926" };
const BLUE = { normal: "#1982c4" };
const PURPLE = { normal: "#8b21aa" };

export const root = styled(motion.div)({
  position: "relative",
});

export const tile = styled(motion.div)({
  width: CONSTANTS.TILE_SIZE,
  height: CONSTANTS.TILE_SIZE,
  borderRadius: 4,
  transition: "opacity 0.1s",
  cursor: "pointer",
  '&[data-type="-1"]': {
    background: "transparent",
  },
  '&[data-type="0"]': {
    background: RED.normal,
  },
  '&[data-type="1"]': {
    background: YELLOW.normal,
  },
  '&[data-type="2"]': {
    background: GREEN.normal,
  },
  '&[data-type="3"]': {
    background: BLUE.normal,
  },
  '&[data-type="4"]': {
    background: PURPLE.normal,
  },
});

export const explosion = styled(motion.div)({
  position: "absolute",
  inset: 0,
  borderRadius: 4,
  background: "#fff2b0",
});
