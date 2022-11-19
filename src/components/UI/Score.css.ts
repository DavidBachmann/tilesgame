import styled from "styled-components";
import { motion } from "framer-motion";

export const text = styled(motion.span)({
  fontFamily: "Barlow",
  fontSize: 36,
  fontWeight: 500,
  margin: 0,
  textAlign: "center",
  textShadow: "0 2px 20px #1de1e7, 0 1px 0 black, 0 3px 2px black",
  letterSpacing: "2px",
  "@media (min-width: 429px)": {
    fontSize: 54,
  },
});

export const root = styled("div")({
  margin: "24px auto",
  "@media (min-width: 429px)": {
    margin: "32px auto",
  },
});
