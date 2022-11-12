import styled from "styled-components";

export const root = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: 24,

  "@media (min-width: 429px)": {
    rowGap: 32,
    paddingTop: 80,
  },
});

export const area = styled("div")({
  position: "relative",
});

export const header = styled("header")({
  flexDirection: "column",
  alignItems: "center",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
});
