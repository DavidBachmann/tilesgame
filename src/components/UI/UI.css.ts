import { NavLink } from "react-router-dom";
import styled from "styled-components";

const green = "#14cd96";
const bg2 = "#1e232f";

export const root = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: 8,
});

export const area = styled("div")({
  position: "relative",
  marginTop: 32,
});

export const header = styled("header")({
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
});

export const nav = styled("nav")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 16,
});

export const button = styled(NavLink)({
  borderRadius: 6,
  background: bg2,
  lineHeight: 1,
  padding: "14px 18px",
  color: "#b3b8c2",
  fontSize: 16,
  "&.active": {
    background: green,
    color: "white",
  },
  "&[disabled]": {
    cursor: "auto",
  },
});

export const title = styled("div")({
  fontSize: 20,
});

export const content = styled("div")({
  display: "flex",
  alignItems: "center",
  columnGap: 16,
});

export const os = styled("div")({
  display: "none",
  svg: {
    width: 20,
    height: "auto",
  },

  "@media (min-width: 429px)": {
    display: "flex",
  },
});

export const footer = styled("footer")({
  position: "absolute",
  left: 32,
  right: 32,
  bottom: 16,
  display: "flex",
  justifyContent: "space-between",
});

export const text = styled("span")({
  color: "rgba(255,255,255,0.8)",
  fontSize: 12,
});
