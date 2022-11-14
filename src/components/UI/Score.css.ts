import styled from "styled-components";
import { motion } from "framer-motion";

export const text = styled(motion.span)({
  fontSize: 24,
  margin: 0,
  textAlign: "center",
});

export const root = styled("button")({
  alignItems: "center",
  background: "black",
  appearance: "none",
  padding: 0,
  backgroundColor: "rgba(7,14,23,0.3)",
  borderRadius: 32,
  display: "flex",
  justifyContent: "center",
  margin: "auto",
  minHeight: 48,
  position: "relative",
  width: "calc(100% - 16px)",
  "&[disabled]": {
    pointerEvents: "none",
  },
});
