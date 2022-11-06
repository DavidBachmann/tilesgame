import styled from "styled-components";
import { motion } from "framer-motion";

export const root = styled("div")({
  display: "flex",
  justifyContent: "center",
  padding: 24,
});

export const text = styled(motion.span)({
  fontSize: 32,
  margin: 0,
  textAlign: "center",
});
