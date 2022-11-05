import styled from "styled-components";

export const root = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: 32,
});

export const area = styled("div")({
  position: "relative",
});

export const header = styled("header")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 24,
  svg: {
    opacity: 0.9,
    transition: "opacity 200ms",
    height: 24,
    width: 24,
    pointerEvents: "none",
  },
  "a:hover svg, a:focus-visible svg": {
    opacity: 1,
  },
});
