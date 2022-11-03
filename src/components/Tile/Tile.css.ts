import { motion } from "framer-motion";
import styled from "styled-components";

const GREEN = { light: "#6da776", medium: "#408a47", dark: "#265d42" };
const YELLOW = { light: "#ffc367", medium: "#ffaf33", dark: "#f2682c" };
const BLUE = { light: "#6b748c", medium: "#374062", dark: "#242943" };
const BROWN = { light: "#cc937b", medium: "#b8704f", dark: "#733f39" };

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
    background: GREEN.medium,
    ":hover": {
      background: GREEN.light,
    },
  },
  '&[data-type="1"]': {
    background: YELLOW.medium,
    ":hover": {
      background: YELLOW.light,
    },
  },
  '&[data-type="2"]': {
    background: BLUE.medium,
    ":hover": {
      background: BLUE.light,
    },
  },
  '&[data-type="3"]': {
    background: BROWN.medium,
    ":hover": {
      background: BROWN.light,
    },
  },
});
