import { motion } from "framer-motion";
import styled from "styled-components";
import { CONSTANTS } from "../../constants";

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
    background: `linear-gradient(240deg, ${CONSTANTS.COLORS.RED.normal}, ${CONSTANTS.COLORS.RED.secondary})`,
  },
  '&[data-type="1"]': {
    background: `linear-gradient(240deg, ${CONSTANTS.COLORS.YELLOW.normal}, ${CONSTANTS.COLORS.YELLOW.secondary})`,
  },
  '&[data-type="2"]': {
    background: `linear-gradient(240deg, ${CONSTANTS.COLORS.GREEN.normal}, ${CONSTANTS.COLORS.GREEN.secondary})`,
  },
  '&[data-type="3"]': {
    background: `linear-gradient(240deg, ${CONSTANTS.COLORS.BLUE.normal}, ${CONSTANTS.COLORS.BLUE.secondary})`,
  },
  '&[data-type="4"]': {
    background: `linear-gradient(240deg, ${CONSTANTS.COLORS.PURPLE.normal}, ${CONSTANTS.COLORS.PURPLE.secondary})`,
  },
});

export const explosion = styled(motion.div)({
  position: "absolute",
  inset: 0,
  borderRadius: 4,
  background: "#fff2b0",
});
