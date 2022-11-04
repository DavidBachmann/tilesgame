import { motion } from "framer-motion";
import styled from "styled-components";

const RED = { light: "#ff595e", medium: "#D83441" };
const YELLOW = { light: "#ffca3a", medium: "#CB9D00" };
const GREEN = { light: "#8ac926", medium: "#60A000" };
const BLUE = { light: "#1982c4", medium: "#004F8C" };

export const root = styled(motion.div)({
  width: 48,
  height: 48,
  borderRadius: 4,
  background: "blue",
  transition: "opacity 0.1s",
  cursor: "pointer",
  '&[data-type="-1"]': {
    background: "transparent",
  },
  '&[data-type="0"]': {
    background: RED.light,
    ":hover": {
      background: RED.medium,
    },
  },
  '&[data-type="1"]': {
    background: YELLOW.light,
    ":hover": {
      background: YELLOW.medium,
    },
  },
  '&[data-type="2"]': {
    background: GREEN.light,
    ":hover": {
      background: GREEN.medium,
    },
  },
  '&[data-type="3"]': {
    background: BLUE.light,
    ":hover": {
      background: BLUE.medium,
    },
  },
});
