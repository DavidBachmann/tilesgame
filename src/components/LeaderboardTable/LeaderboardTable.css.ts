import { motion } from "framer-motion";
import styled from "styled-components";

export const root = styled(motion.div)({
  paddingBottom: 32,
});

export const wrap = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: 24,
});

export const table = styled("table")({
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
  "td, th": {
    padding: 8,
  },
});

export const row = styled("tr")({
  "&:nth-child(2n)": {
    background: "#161722",
  },
  td: {
    maxWidth: 128,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
});

export const column = styled("div")({
  padding: 8,
  display: "flex",
  columnGap: 8,
  justifyContent: "space-between",
});

export const timeHeader = styled("th")({
  display: "none",
  "@media (min-width: 429px)": {
    display: "table-cell",
  },
});
export const timeCell = styled("td")({
  display: "none",
  "@media (min-width: 429px)": {
    display: "table-cell",
  },
});

export const button = styled("div")({
  "> a": {
    display: "block",
  },
});
