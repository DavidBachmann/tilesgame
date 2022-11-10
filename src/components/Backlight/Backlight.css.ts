import styled from "styled-components";

export const root = styled("div")({
  inset: 0,
  transition: "opacity 300ms",
  position: "absolute",
  zIndex: -1,
});

export const backlight = styled("div")({
  pointerEvents: "none",
  "&::before, &::after": {
    backgroundSize: "100%",
    bottom: "5%",
    content: "''",
    filter: "blur(75px)",
    transform: "translate3d(0, 0, 0)",
    margin: "0 auto",
    position: "absolute",
    top: "5%",
    zIndex: -1,
  },
  "&::before": {
    background: "linear-gradient(180deg, var(--quadrant-1), var(--quadrant-2))",
    left: "5%",
    right: "50%",
  },
  "&::after": {
    background: "linear-gradient(180deg, var(--quadrant-3), var(--quadrant-4))",
    left: "50%",
    right: "5%",
  },
});
