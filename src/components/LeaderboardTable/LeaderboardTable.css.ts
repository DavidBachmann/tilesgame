import { motion } from "framer-motion";
import styled from "styled-components";

export const root = styled(motion.div)({
  backgroundColor: "#1a1b29",
  borderRadius: 12,
  left: 8,
  margin: "auto",
  maxWidth: 480,
  position: "fixed",
  right: 8,
  zIndex: 1,
  padding: 16,
  boxShadow: "0px 10px 10px 14px rgba(0, 0, 0, 0.1)",
});

export const wrap = styled("div")({
  display: "flex",
  flexDirection: "column",
  padding: 8,
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
    background: "#101017",
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
