import { motion } from "framer-motion";
import styled from "styled-components";

export const root = styled("div")({
  alignItems: "center",
  padding: 0,
  backgroundColor: "rgba(7,14,23,0.3)",
  borderRadius: "32px 32px 0 0",
  display: "flex",
  justifyContent: "center",
  margin: "auto",
  minHeight: 48,
  position: "relative",
  width: "calc(100% - 16px)",
});

export const track = styled("div")({
  background: "#3a3d47",
  borderRadius: 2,
  height: 4,
  inset: 20,
  margin: "auto",
  overflow: "hidden",
  position: "absolute",
});

export const meter = styled(motion.div)({
  background: "#ffba00",
  height: "100%",
  inset: 0,
  position: "absolute",
  transformOrigin: "center left",
  transition: "all 800ms linear",
});

export const message = styled("span")({
  lineHeight: 1,
});
