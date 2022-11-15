import styled from "styled-components";
import { motion } from "framer-motion";

export const text = styled(motion.span)({
  fontSize: 32,
  margin: 0,
  textAlign: "center",
});

export const root = styled("div")({
  margin: "auto",
});
