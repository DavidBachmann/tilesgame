import { motion } from "framer-motion";
import styled from "styled-components";

export const root = styled(motion.div)({
  display: "grid",
  inset: 0,
  placeItems: "center",
  position: "absolute",
  transformOrigin: "center",
  pointerEvents: "none",
});

export const box = styled("div")({
  alignItems: "center",
  display: "inline-flex",
  flexDirection: "column",
});

export const message = styled("span")({
  fontWeight: 600,
  lineHeight: 1.2,
  textShadow: "0 2px 4px rgba(0,0,0,0.28)",
  fontSize: 48,
});
export const small = styled("span")({
  textShadow: "0 2px 4px rgba(0,0,0,0.28)",
  lineHeight: 1.2,
  fontWeight: 600,
  padding: "8px 0",
  fontSize: 32,
});
